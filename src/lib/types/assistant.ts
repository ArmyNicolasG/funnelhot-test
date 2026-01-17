//Tipos de datos para los asistentes

//Idiomas
export type Language = 'Español' | 'Inglés' | 'Portugués';

// Tipos de personalidades disponibles para los asistentes
export type Tone = 'Formal' | 'Casual' | 'Profesional' | 'Amigable';

// Configuración de longitud de respuestas
export interface ResponseLength {
  short: number;
  medium: number;
  long: number;
}


//Asistente
export interface Assistant {
  id: string;
  name: string; // Mínimo 3 letras
  language: Language;
  tone: Tone;
  responseLength: ResponseLength;
  audioEnabled: boolean;
  rules?: string; //Reglas opcionales de entrenamiento
}

//Interfaz de creación de asistente sin el id no generado
export type CreateAssistantInput = Omit<Assistant, 'id'>;

// Campos de  actualización de un asistente ya existente
export interface UpdateAssistantInput {
  id: string;
  name?: string;
  language?: Language;
  tone?: Tone;
  responseLength?: ResponseLength;
  audioEnabled?: boolean;
  rules?: string;
}