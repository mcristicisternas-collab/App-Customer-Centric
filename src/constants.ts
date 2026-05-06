export interface Question {
  id: string;
  label: string;
  type: 'multiselect' | 'select' | 'text';
  options: string[];
  allowOther?: boolean;
}

export const QUESTIONS: Question[] = [
  {
    id: 'user_name',
    label: 'Para comenzar, ¿cuál es tu nombre?',
    type: 'text',
    options: ['Tu nombre servirá para personalizar tu Road Map CX'],
  },
  {
    id: 'problems',
    label: '¿Qué es lo que hoy no está funcionando bien con tus clientes?',
    type: 'multiselect',
    options: [
      'Reclamos/pérdida de confianza',
      'Fuga de clientes',
      'Experiencia inconsistente',
      'Problemas internos entre áreas',
      'Baja conversión/ventas',
      'No sabemos qué mejorar',
    ],
    allowOther: true,
  },
  {
    id: 'current_perception',
    label: '¿Dónde sientes que está hoy tu organización en el alineamiento hacia el cliente?',
    type: 'select',
    options: [
      'Inicial (reactivo)',
      'En desarrollo',
      'Avanzado pero inconsistente',
    ],
  },
  {
    id: 'org_type',
    label: '¿Qué tipo de organización eres?',
    type: 'select',
    options: [
      'Servicios',
      'Salud',
      'Financiero',
      'Retail/consumo',
      'Seguros',
      'B2B',
    ],
    allowOther: true,
  },
  {
    id: 'primary_focus',
    label: '¿Qué necesitas lograr primero?',
    type: 'select',
    options: [
      'Definir y formalizar la experiencia',
      'Mejorar liderazgo (Alinear equipos)',
      'Reducir reclamos',
      'Aumentar ventas',
      'Diseñar y mejorar el journey del cliente',
    ],
    allowOther: true,
  },
  {
    id: 'urgency',
    label: '¿En qué horizonte necesitas ver resultados?',
    type: 'select',
    options: [
      'Corto plazo (0-3 meses)',
      'Mediano (3-6 meses)',
      'Transformación (6-12 meses)',
    ],
  },
  {
    id: 'capacity',
    label: 'Hoy, ¿cuánta capacidad real tienes para implementar cambios?',
    type: 'select',
    options: [
      'Baja (poco tiempo/equipo)',
      'Media',
      'Alta',
    ],
  },
];
