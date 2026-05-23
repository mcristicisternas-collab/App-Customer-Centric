export interface Question {
  id: string;
  label: string;
  type: 'multiselect' | 'select' | 'text';
  options: string[];
  allowOther?: boolean;
  ejeName?: string;
}

const LIKERT_OPTIONS = [
  '1 - Muy bajo',
  '2 - Bajo',
  '3 - Medio',
  '4 - Alto',
  '5 - Muy alto'
];

export const QUESTIONS: Question[] = [
  {
    id: 'user_name',
    label: 'Para comenzar, ¿cuál es tu nombre?',
    type: 'text',
    options: ['Tu nombre servirá para personalizar tu Road Map CX'],
  },
  // --- E1 ENFOCAR ---
  {
    id: 'enfocar_1',
    label: '¿Existe una definición clara y compartida de la experiencia que queremos generar en nuestros clientes y se utiliza como referencia para decidir y actuar?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E1: ENFOCAR',
  },
  {
    id: 'enfocar_2',
    label: '¿El modelo de atención está definido formalmente y está adecuado para los diferentes segmentos?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E1: ENFOCAR',
  },
  {
    id: 'enfocar_3',
    label: '¿Existe un sistema claro y activo de toma de decisiones que gobierne la experiencia del cliente de forma transversal y vinculada al negocio?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E1: ENFOCAR',
  },
  {
    id: 'enfocar_4',
    label: '¿La organización tiene claridad sobre qué iniciativas a priorizar para mejorar la experiencia del cliente bajo criterios comunes?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E1: ENFOCAR',
  },
  {
    id: 'enfocar_5',
    label: '¿La experiencia del cliente cuenta con recursos explícitos y suficientes para sostener iniciativas y mejoras en el tiempo?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E1: ENFOCAR',
  },
  // --- E2 ESCUCHAR ---
  {
    id: 'escuchar_1',
    label: '¿La organización escucha activamente a sus clientes de manera sistemática y continua a lo largo de su experiencia?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E2: ESCUCHAR',
  },
  {
    id: 'escuchar_2',
    label: '¿La organización es capaz de traducir la voz del cliente en insights accionables que orienten decisiones reales del negocio?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E2: ESCUCHAR',
  },
  {
    id: 'escuchar_3',
    label: '¿Los servicios se diseñan o ajustan sistemáticamente a partir del entendimiento del viaje real del cliente y las emociones predominantes en cada etapa?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E2: ESCUCHAR',
  },
  {
    id: 'escuchar_4',
    label: '¿La organización disminuye sistemáticamente los problema de clientes y es capaz de recuperar su confianza cuando ocurre un quiebre en su experiencia?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E2: ESCUCHAR',
  },
  {
    id: 'escuchar_5',
    label: '¿Las solicitudes y consultas de los clientes se analizan como una oportunidad de mejorar su gestión y la experiencia del cliente?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E2: ESCUCHAR',
  },
  {
    id: 'escuchar_6',
    label: '¿La organización escucha activamente a sus colaboradores y utiliza esa información para mejorar la efectividad de la cadena de valor?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E2: ESCUCHAR',
  },
  // --- E3 EMPODERAR ---
  {
    id: 'empoderar_1',
    label: '¿Cada colaborador entiende claramente cómo su rol impacta la experiencia del cliente y qué se espera de él en ese ámbito?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E3: EMPODERAR',
  },
  {
    id: 'empoderar_2',
    label: '¿La capacitación prepara sistemáticamente a los colaboradores para entregar la experiencia definida?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E3: EMPODERAR',
  },
  {
    id: 'empoderar_3',
    label: '¿Los colaboradores cuentan con autonomía clara y segura para tomar decisiones frente al cliente en situaciones reales?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E3: EMPODERAR',
  },
  {
    id: 'empoderar_4',
    label: '¿Las áreas trabajan de forma coordinada y bajo acuerdos de servicio entendiendo su impacto en la experiencia del cliente final?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E3: EMPODERAR',
  },
  {
    id: 'empoderar_5',
    label: '¿Las conductas que mejoran la experiencia del cliente son reconocidas de forma visible y coherente por la organización?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E3: EMPODERAR',
  },
  // --- E4 ENCARNAR ---
  {
    id: 'encarnar_1',
    label: '¿Las áreas toman decisiones alineadas entre sí cuando estas afectan la experiencia del cliente?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E4: ENCARNAR',
  },
  {
    id: 'encarnar_2',
    label: '¿La organización logra que la experiencia que representa su promesa sea la forma habitual de operar frente a los clientes con estándares y protocolos conocidos y medidos?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E4: ENCARNAR',
  },
  {
    id: 'encarnar_3',
    label: '¿Las comunicaciones internas de la empresa incorporan la voz del cliente para fomentar y reforzar la cultura de servicio deseada en cada rol?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E4: ENCARNAR',
  },
  {
    id: 'encarnar_4',
    label: '¿La organización se anticipa de manera intencional a situaciones que pueden afectar la experiencia del cliente antes de que este lo manifieste?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E4: ENCARNAR',
  },
  {
    id: 'encarnar_5',
    label: '¿Las interacciones digitales facilitan realmente la experiencia del cliente o solo trasladan fricciones del mundo físico al digital?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E4: ENCARNAR',
  },
  // --- E5 ESCALAR ---
  {
    id: 'escalar_1',
    label: '¿Los procesos digitalizados simplifican la operación y mejoran la experiencia del cliente o solo replican la complejidad existente?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E5: ESCALAR',
  },
  {
    id: 'escalar_2',
    label: '¿Las decisiones sobre experiencia y operación se toman con datos integrados sobre el comportamiento de los clientes o por intuición y urgencia?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E5: ESCALAR',
  },
  {
    id: 'escalar_3',
    label: '¿La organización aprende de la experiencia real y ajusta su forma de operar con un método continuo formal de mejora con roles y presupuesto asignado?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E5: ESCALAR',
  },
  {
    id: 'escalar_4',
    label: '¿La experiencia definida escala al siguiente nivel para lograr competitividad y nuevos diferenciales hacia el mercado objetivo?',
    type: 'select',
    options: LIKERT_OPTIONS,
    ejeName: 'E5: ESCALAR',
  },
  // --- OTROS ---
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
