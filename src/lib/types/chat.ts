//Tipos de datos para los chats

//Mensaje de chat
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Historial de chat de un asistente
export interface ChatHistory {
  assistantId: string;
  messages: ChatMessage[];
}
