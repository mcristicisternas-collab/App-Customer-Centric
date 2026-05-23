import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Lazy initializer for Firebase Firestore database
let db: any = null;

const getDb = () => {
  if (!db) {
    try {
      const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
      if (fs.existsSync(configPath)) {
        const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        const firebaseApp = initializeApp(firebaseConfig);
        db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
        console.log('Firebase initialized securely with Database ID:', firebaseConfig.firestoreDatabaseId);
      } else {
        console.error('firebase-applet-config.json not found!');
      }
    } catch (err) {
      console.error('Failed to initialize Firebase securely:', err);
    }
  }
  return db;
};

// API: Save audit (available to everyone, saves silently to centralized Firestore)
app.post('/api/audits', async (req, res) => {
  const { audit } = req.body;
  if (!audit || !audit.id) {
    return res.status(400).json({ error: 'Invalid audit payload' });
  }

  try {
    const firestoreDb = getDb();
    if (!firestoreDb) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const docReference = doc(firestoreDb, 'audits', audit.id);
    await setDoc(docReference, audit);
    res.json({ success: true, message: 'Audit saved centrally to Cloud Firestore' });
  } catch (error) {
    console.error('Error saving audit to Firestore:', error);
    res.status(500).json({ error: 'Failed to write to central database' });
  }
});

// API: Fetch all audits (restricted by passcode/email check)
app.post('/api/audits/list', async (req, res) => {
  const { passcode, email } = req.body;
  
  // Matias' admin credentials check
  // Authorized if either email is mcristicisternas@gmail.com OR passcode matched
  const isAuthorized = 
    (email && email.toLowerCase().trim() === 'mcristicisternas@gmail.com') ||
    (passcode && passcode.toLowerCase().trim() === '88practicas');

  if (!isAuthorized) {
    return res.status(403).json({ error: 'Acceso no autorizado' });
  }

  try {
    const firestoreDb = getDb();
    if (!firestoreDb) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const querySnapshot = await getDocs(collection(firestoreDb, 'audits'));
    const audits: any[] = [];
    querySnapshot.forEach((docSnapshot) => {
      audits.push(docSnapshot.data());
    });

    // Sort descending by timestamp
    audits.sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeB - timeA;
    });

    res.json({ success: true, audits });
  } catch (error) {
    console.error('Error reading audits from Firestore:', error);
    res.status(500).json({ error: 'Failed to fetch centralized list' });
  }
});

// API: Delete single audit
app.post('/api/audits/delete', async (req, res) => {
  const { passcode, id } = req.body;
  if (passcode !== '88practicas') {
    return res.status(403).json({ error: 'Acceso no autorizado' });
  }

  try {
    const firestoreDb = getDb();
    if (!firestoreDb) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const docReference = doc(firestoreDb, 'audits', id);
    await deleteDoc(docReference);

    // Fetch updated list to return
    const querySnapshot = await getDocs(collection(firestoreDb, 'audits'));
    const audits: any[] = [];
    querySnapshot.forEach((docSnapshot) => {
      audits.push(docSnapshot.data());
    });

    audits.sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeB - timeA;
    });

    res.json({ success: true, audits });
  } catch (error) {
    console.error('Error deleting audit from Firestore:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

// API: Delete all audits
app.post('/api/audits/clear', async (req, res) => {
  const { passcode } = req.body;
  if (passcode !== '88practicas') {
    return res.status(403).json({ error: 'Acceso no autorizado' });
  }

  try {
    const firestoreDb = getDb();
    if (!firestoreDb) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const querySnapshot = await getDocs(collection(firestoreDb, 'audits'));
    const deletePromises: Promise<any>[] = [];
    querySnapshot.forEach((docSnapshot) => {
      deletePromises.push(deleteDoc(doc(firestoreDb, 'audits', docSnapshot.id)));
    });

    await Promise.all(deletePromises);
    res.json({ success: true, audits: [] });
  } catch (error) {
    console.error('Error clearing audits from Firestore:', error);
    res.status(500).json({ error: 'Failed to clear records' });
  }
});

// Vite / static file serving middleware
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupVite();
