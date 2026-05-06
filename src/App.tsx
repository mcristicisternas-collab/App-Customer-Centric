/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Loader2, 
  Target,
  Users, 
  Clock, 
  Zap, 
  ArrowRight,
  RefreshCw,
  Building2,
  FileText,
  FileDown,
  Mail,
  Send,
  Phone,
  Infinity,
  ShieldCheck,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GoogleGenAI } from '@google/genai';
import { QUESTIONS, Question } from './constants';
import { cn } from './utils';

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

type FormValues = {
  [key: string]: string | string[];
};

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<FormValues>({});
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });
  const [emailSent, setEmailSent] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      generatePlan();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleSelect = (id: string, value: string) => {
    const question = QUESTIONS.find(q => q.id === id);
    if (question?.type === 'multiselect') {
      const current = (values[id] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      setValues({ ...values, [id]: updated });
    } else {
      setValues({ ...values, [id]: value });
    }
  };

  const handleOtherChange = (id: string, value: string) => {
    setValues({ ...values, [`${id}_other`]: value });
  };

  const generatePlan = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const prompt = `
      # ROL: Senior Strategic CX Consultant (World-Class Level)
      # MARCO DE REFERENCIA OBLIGATORIO: Modelo Taiken 5E® y el libro "88 Prácticas Reales y Efectivas para ser una Empresa Cliente Céntrica" de Matías Cristi Cisternas.
      
      ## OBJETIVO:
      Generar un Roadmap Estratégico de Transformación CX personalizado basado ESTRICTAMENTE en las dimensiones del Modelo Taiken 5E. 
      
      ## DIMENSIONES TAIKEN 5E (Conocimiento Base):
      1. **ENFOCAR**: Disposición al cambio, Propósito claro, Governance (Comités), Recursos asignados. Sin foco, no hay proyecto.
      2. **ESCUCHAR**: Gestión de la lealtad. VoC (Voz del Cliente), Close the Loop, Feedback transaccional y relacional, métricas (NPS, CSAT, CES).
      3. **EMPODERAR**: Experiencia del Colaborador (EX). Cliente interno, diseño participativo, entrenamiento en herramientas CX, captura de voz del empleado.
      4. **ENCARNAR**: Liderazgo Humano. Conductas y actitudes, pasar de la empatía (entender) a la compasión (actuar), compromiso del C-Level, vocación de servicio.
      5. **ESCALAR**: Transformación Digital y Futuro. CRM, IA, Omnicanalidad, Automatización (RPA), Datos CX para decisiones en tiempo real.

      ## CONCEPTOS CRÍTICOS DEL AUTOR:
      - **ROI de CX**: Si no impacta en el EBITDA, es filantropía corporativa.
      - **Service Blueprint**: Escenarios y escenas para orquestar la servucción.
      - **Customer Lifetime Value (CLV)**: Segmentación por valor futuro.
      - **Empatía vs Compasión**: Entender vs Actuar (Hacerse cargo).

      # DATOS DEL DIAGNÓSTICO (Caso de Negocio):
      - Nombre del Solicitante: ${values.user_name}
      - Tipo de Organización: ${values.org_type === 'Otro' ? values.org_type_other : values.org_type}
      - Problemas Actuales: ${Array.isArray(values.problems) ? values.problems.join(', ') : values.problems} ${values.problems_other ? `(Otros: ${values.problems_other})` : ''}
      - Percepción de Alineamiento: ${values.current_perception}
      - Enfoque Primario Necesario: ${values.primary_focus} ${values.primary_focus_other ? `(Otro: ${values.primary_focus_other})` : ''}
      - Urgencia/Horizonte: ${values.urgency}
      - Capacidad de Implementación: ${values.capacity}

      # INSTRUCCIONES DE SALIDA:
      - Genera un reporte técnico, ejecutivo e inspirador.
      - Utiliza un tono de autoridad pero cercano (como el de Matías Cristi).
      - PRESENTACIÓN: Utiliza tablas Markdown para las secciones 1, 2, 3 y 5.
      - **PROHIBICIÓN TOTAL**: No menciones a Kotter, Six Sigma ni otros autores externos. Todo el análisis, incluyendo el cambio cultural debe basarse exclusivamente en el libro 88 y los **5 ejes del Modelo Taiken 5E** (Enfocar, Escuchar, Empoderar, Encarnar, Escalar).

      # ESTRUCTURA DEL REPORTE (Markdown):
      ## 🎯 ESTRATEGIA TAIKEN 5E PARA ${values.user_name?.toString().toUpperCase()}
      
      ### 📋 DIAGNÓSTICO ESTRATÉGICO
      **Visión de Autor:** [Una frase potente sobre la brecha detectada].
      [Párrafo de 3 líneas fundamentando el desafío técnico].

      ### 1. HOJA DE RUTA ESTRATÉGICA (Dimensiones Prioritarias)
      | ESTRATEGIA | ACCIÓN TÉCNICA TAIKEN 5E | IMPACTO (KPI/ROI) |
      | :--- | :--- | :--- |
      | **[Eje 1]** | [Acción específica] | [Efecto en EBITDA/NPS] |
      | **[Eje 2]** | [Acción específica] | [Efecto en EBITDA/NPS] |

      ### 2. HERRAMIENTAS OPERATIVAS (Quick Wins)
      | PALANCA | IMPLEMENTACIÓN CONCRETA | OBJETIVO |
      | :--- | :--- | :--- |
      | [Ej: Protocolo DIGA] | [Cómo aplicarlo] | [Meta de control] |

      ### 3. CRONOGRAMA DE TRANSFORMACIÓN (90 DÍAS)
      | FASE | ACCIONES CLAVE | HITO |
      | :--- | :--- | :--- |
      | **MES 1** | [Cimentación] | [Resultado 1] |
      | **MES 2** | [Ejecución] | [Resultado 2] |
      | **MES 3** | [Escalamiento] | [Resultado 3] |

      ### 4. MICROACCIONES (Para iniciar este lunes)
      - [ ] **[Acción]**: [Detalle]
      - [ ] **[Acción]**: [Detalle]

      ### 5. RITUALES DE EXCELENCIA
      | RITUAL | FRECUENCIA | PROPÓSITO TAIKEN |
      | :--- | :--- | :--- |
      | [Ritual] | [Período] | [Objetivo] |

      ### ⚠️ ALERTA DE RIESGO
      [Análisis de silos o ego organizacional para este caso].

      ---
      ### ✍️ FIRMA DE AUTORIDAD
      "El momento de transformar es ahora, ${values.user_name}. ¡Exito en su implementación!"
      **Matias Cristi Cisternas | Autor de "88 Prácticas" Reales Customer Centric**
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          temperature: 0.4,
          topP: 0.9,
        }
      });

      if (response.text) {
        setResult(response.text);
      } else {
        throw new Error("Respuesta vacía del servidor.");
      }
    } catch (err) {
      console.error("AI Error:", err);
      setError("Tuvimos un problema al conectar con el motor de inteligencia. Por favor, asegúrate de haber respondido todas las preguntas e inténtalo una vez más.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    
    setIsExporting(true);
    try {
      const element = reportRef.current;
      
      // Create a hidden iframe to isolate the report content for capture
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.top = '-9999px';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Could not create iframe document');

      // Basic safe styles for the PDF
      const styles = `
        <style>
          body { font-family: sans-serif; background: white; padding: 40px; color: #0f172a; }
          .markdown-body h1 { font-style: italic; color: #c2410c; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; text-transform: uppercase; text-align: center; font-size: 32px; }
          .markdown-body h2 { color: #c2410c; text-transform: uppercase; margin-top: 30px; font-size: 14px; letter-spacing: 0.2em; display: flex; align-items: center; gap: 10px; }
          .markdown-body h2::before { content: ""; width: 6px; height: 20px; background: #1e3a8a; display: inline-block; border-radius: 99px; }
          .markdown-body table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; }
          .markdown-body th { background: #f8fafc; padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; text-transform: uppercase; }
          .markdown-body td { padding: 12px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
          .markdown-body ul { list-style: none; padding: 0; }
          .markdown-body li { margin-bottom: 15px; padding-left: 20px; position: relative; }
          .markdown-body li::before { content: "•"; position: absolute; left: 0; color: #c2410c; }
          .markdown-body blockquote { border-left: 6px solid #ea580c; padding: 20px; background: #fff7ed; font-style: italic; font-size: 18px; margin: 30px 0; }
        </style>
      `;

      iframeDoc.write(`
        <html>
          <head>${styles}</head>
          <body>
            <div class="markdown-body">${element.innerHTML}</div>
          </body>
        </html>
      `);
      iframeDoc.close();

      // Wait for resources to load if any
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      document.body.removeChild(iframe);

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Roadmap_CX_Taiken_5E_${values.user_name || 'Diagnostico'}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const currentQuestion = QUESTIONS[currentStep];
  const isLastStep = currentStep === QUESTIONS.length - 1;
  const isStepComplete = useMemo(() => {
    const val = values[currentQuestion.id];
    if (currentQuestion.type === 'multiselect') {
      return Array.isArray(val) && val.length > 0;
    }
    return !!val;
  }, [values, currentQuestion]);

  const progress = (currentStep / (QUESTIONS.length - 1)) * 100;

  if (result) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col p-4 md:p-8 selection:bg-brand-orange/30 print:bg-white text-slate-800">
        <header className="max-w-5xl mx-auto w-full mb-8 flex justify-between items-center bg-white/60 backdrop-blur-xl p-5 rounded-3xl border border-white/80 shadow-2xl print:hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center p-2">
              <ShieldCheck className="text-white w-full h-full" />
            </div>
            <div className="text-left">
              <h1 className="text-xs font-black tracking-[0.2em] text-slate-900 uppercase">Strategic Unit</h1>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Diagnóstico Taiken 5E</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className={cn(
                "px-6 py-2.5 bg-white hover:bg-slate-50 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all border border-slate-200 shadow-sm flex items-center gap-2",
                isExporting && "opacity-50 cursor-wait"
              )}
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-blue" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-brand-blue" />
              )}
              {isExporting ? 'Generando...' : 'PDF'}
            </button>
            <div className="h-12 w-px bg-slate-200 mx-2" />
            <img src="/logo.png" alt="Taiken" className="h-8 w-auto object-contain" />
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center">
          <motion.div 
            ref={reportRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden print:shadow-none print:border-none"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 blur-3xl pointer-events-none rounded-full -mr-48 -mt-48" />
            
            <div className="flex justify-between items-start mb-16 border-b border-slate-100 pb-12 print:hidden">
              <div>
                <span className="text-[10px] uppercase font-black tracking-[0.5em] text-brand-orange mb-3 block">Roadmap de Transformación</span>
                <h2 className="text-4xl italic text-slate-900 font-display font-black leading-tight">
                  Estrategia <span className="text-brand-blue">Cliente Céntrica</span>
                </h2>
              </div>
              <button 
                onClick={() => {
                  setResult(null);
                  setCurrentStep(0);
                  setValues({});
                  setIsStarted(false);
                }}
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-slate-100 transition-colors border border-slate-200">
                  <RefreshCw className="w-5 h-5 text-slate-400 group-hover:rotate-180 duration-500 transition-all" />
                </div>
                <span className="text-[9px] uppercase tracking-widest font-black text-slate-400">Nuevo</span>
              </button>
            </div>
            
            <div className="markdown-body p-4 sm:p-0">
              <Markdown remarkPlugins={[remarkGfm]}>{result}</Markdown>
            </div>

            <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col md:flex-row gap-8 items-center justify-between print:hidden">
              <div className="flex items-center gap-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Organización</span>
                  <span className="text-xs font-black text-slate-800 uppercase">{values.org_type === 'Otro' ? values.org_type_other : values.org_type}</span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Madurez</span>
                  <span className="text-xs font-black text-slate-800 uppercase">{values.capacity}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowEmailForm(true)}
                className="px-10 py-5 btn-accent text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl hover:scale-105 transition-all flex items-center gap-3"
              >
                <Mail className="w-4 h-4" />
                Recibir en mi Email
              </button>
            </div>
          </motion.div>
        </main>

        {/* Email Modal */}
        <AnimatePresence>
          {showEmailForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white p-12 rounded-[2.5rem] shadow-2xl border border-white"
              >
                {emailSent ? (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Send className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-display font-black text-slate-900 mb-2 italic">¡En camino!</h3>
                    <p className="text-slate-500 text-sm">Tu plan estratégico ha sido enviado con éxito.</p>
                    <button 
                      onClick={() => { setShowEmailForm(false); setEmailSent(false); }}
                      className="mt-10 w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                    >
                      Cerrar
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-display font-black text-slate-900 mb-8 italic text-center">Ficha Técnica</h3>
                    <div className="space-y-5">
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="email" 
                          placeholder="Email corporativo"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue/30 rounded-2xl py-5 pl-14 pr-6 text-sm outline-none transition-all"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="tel" 
                          placeholder="Teléfono (Opcional)"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue/30 rounded-2xl py-5 pl-14 pr-6 text-sm outline-none transition-all"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                        />
                      </div>
                      <button 
                        onClick={() => { if (contactInfo.email) setEmailSent(true); }}
                        className="w-full mt-4 btn-accent py-5 rounded-2xl text-white font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-3 shadow-xl"
                      >
                        Enviar Diagnóstico
                        <Send className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setShowEmailForm(false)}
                        className="w-full py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-brand-orange/30">
      {!isStarted ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          {/* Decorative Mesh */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-blue/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-orange/10 blur-[120px] rounded-full" />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center z-10 max-w-4xl"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-slate-200 text-brand-orange text-[10px] font-black mb-10 tracking-[0.4em] uppercase shadow-xl flex items-center mx-auto">
              <Sparkles className="w-4 h-4 text-brand-blue" />
              Strategic Excellence Engine
            </div>
            
            <h1 className="text-5xl md:text-8xl font-display font-black text-slate-900 mb-10 tracking-tighter leading-[0.9] italic uppercase text-center">
              Taiken <span className="text-brand-blue drop-shadow-sm">5E</span><br />
              <span className="text-4xl md:text-7xl block mt-4 opacity-90">Intelligence</span>
            </h1>

            <div className="bg-white/40 backdrop-blur-2xl p-10 md:p-16 rounded-[3rem] border border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] mb-12 relative">
              <p className="text-slate-800 text-xl md:text-3xl leading-relaxed font-sans font-medium italic">
                Activa tu hoja de ruta <span className="text-brand-blue font-black not-italic border-b-4 border-brand-blue/20">Customer Centric</span> basada en las 88 prácticas de éxito real.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 mt-12 opacity-60">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-blue" />
                  <span className="text-[10px] uppercase font-black tracking-widest">ROI Focus</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-brand-orange" />
                  <span className="text-[10px] uppercase font-black tracking-widest">Real Strategy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-blue-light" />
                  <span className="text-[10px] uppercase font-black tracking-widest">Culture First</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsStarted(true)}
              className="btn-accent px-16 py-8 rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-sm text-white shadow-2xl hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-8 mx-auto group shadow-brand-orange/30 overflow-hidden relative"
            >
              <span className="relative z-10 font-sans">Iniciar Auditoría Estratégica</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col p-4 md:p-10 max-w-6xl mx-auto w-full">
          <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <button
              onClick={() => setIsStarted(false)}
              className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Inicio</span>
            </button>
            
            <div className="flex-1 max-w-xl w-full flex flex-col gap-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Progreso del Diagnóstico</span>
                <span className="text-[10px] font-black text-brand-orange">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner p-[1px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-linear-to-r from-brand-blue to-brand-orange rounded-full transition-all duration-700"
                />
              </div>
            </div>

            <div className="w-32 flex justify-end">
               <img src="/logo.png" alt="Taiken" className="h-6 w-auto opacity-40" />
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-2xl bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-white relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-brand-blue/20" />
                
                <div className="mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6 font-sans">
                    Módulo {currentStep + 1}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 leading-tight italic">
                    {currentQuestion.label}
                  </h2>
                </div>

                <div className="flex flex-col gap-3.5">
                  {currentQuestion.type === 'text' ? (
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue/30 rounded-2xl py-6 px-8 text-xl font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 font-sans"
                      placeholder="Escribe aquí..."
                      value={values[currentQuestion.id] as string || ''}
                      onChange={(e) => setValues({ ...values, [currentQuestion.id]: e.target.value })}
                      autoFocus
                    />
                  ) : currentQuestion.options.map((option) => {
                    const isSelected = Array.isArray(values[currentQuestion.id])
                      ? (values[currentQuestion.id] as string[]).includes(option)
                      : values[currentQuestion.id] === option;

                    return (
                      <button
                        key={option}
                        onClick={() => handleSelect(currentQuestion.id, option)}
                        className={cn(
                          "w-full text-left p-6 rounded-2xl border transition-all duration-400 flex items-center justify-between group",
                          isSelected 
                            ? "bg-brand-blue border-brand-blue text-white shadow-xl shadow-brand-blue/20" 
                            : "bg-white border-slate-100 hover:border-slate-300 text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <span className={cn("font-bold text-lg font-sans", isSelected ? "text-white" : "text-slate-700")}>{option}</span>
                        <div className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                          isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-300"
                        )}>
                          <ChevronRight className={cn("w-4 h-4", isSelected && "translate-x-0.5")} />
                        </div>
                      </button>
                    );
                  })}

                  {currentQuestion.allowOther && (
                    <input
                      type="text"
                      placeholder="Especifique otro..."
                      className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-8 text-sm outline-none focus:border-brand-orange/40 transition-all font-bold font-sans"
                      value={values[`${currentQuestion.id}_other`] as string || ''}
                      onChange={(e) => handleOtherChange(currentQuestion.id, e.target.value)}
                    />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-12 flex flex-col items-center gap-8 w-full max-w-2xl">
              <div className="flex w-full gap-4">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={cn(
                    "w-24 h-24 rounded-3xl bg-white border border-slate-200 flex flex-col items-center justify-center gap-1 transition-all hover:bg-slate-50 shadow-lg group",
                    currentStep === 0 && "opacity-0 pointer-events-none"
                  )}
                >
                  <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest font-sans">Atrás</span>
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={!isStepComplete || isLoading}
                  className={cn(
                    "flex-1 h-24 rounded-3xl btn-accent text-white font-black uppercase tracking-[0.4em] text-xs shadow-2xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-6 font-sans",
                    !isStepComplete && "opacity-40 grayscale pointer-events-none"
                  )}
                >
                  {isLastStep ? 'Generar Plan Estratégico' : 'Siguiente Paso'}
                  {isLastStep ? <ShieldCheck className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                </button>
              </div>

              {error && (
                <div className="w-full p-6 bg-red-50 border border-red-100 rounded-3xl text-red-600 text-[10px] font-black uppercase tracking-widest text-center">
                  ⚠️ {error}
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* Analysis UI */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
            <div className="w-full max-w-md bg-white p-12 md:p-16 rounded-[3.5rem] shadow-2xl text-center border border-white">
              <div className="relative mb-10">
                <Loader2 className="w-20 h-20 text-brand-blue animate-spin mx-auto" />
              </div>
              <h3 className="text-3xl font-display font-black text-slate-900 mb-4 italic">Analizando</h3>
              <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.4em] mb-10 font-sans">Procesando las 88 prácticas estratégicas...</p>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-sans">Tiempo</span>
                    <span className="text-[10px] font-black text-slate-900 uppercase font-sans">{elapsedTime}s</span>
                 </div>
              </div>

              <p className="mt-10 text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed font-sans">
                Estamos personalizando tu diagnóstico.<br />
                Por favor, espera unos segundos.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-10 text-center opacity-40">
        <p className="text-[11px] text-slate-500 font-black tracking-[0.4em] uppercase font-sans">© 2026 5to Elemento • Intelligence Unit</p>
      </footer>
    </div>
  );
}
