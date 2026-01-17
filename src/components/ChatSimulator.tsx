// Simulador de chat para probar el asistente
// Muestra mensajes y simula respuestas con delay
// RESPONSIVE con paleta de colores centralizada

'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, RotateCcw, Loader2, Bot, User } from 'lucide-react';
import { useAssistantStore } from '@/store/assistantStore';
import { getChatResponse } from '@/lib/services/chatService';
import { Assistant } from '@/lib/types/assistant';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface ChatSimulatorProps {
    assistant: Assistant;
}

export const ChatSimulator = ({ assistant }: ChatSimulatorProps) => {
    
    const { getChatHistory, addMessageToChat, clearChatHistory } = useAssistantStore();// Obtiene funciones del store para manejar el chat

    const [inputMessage, setInputMessage] = useState(''); // Estado local para el input del usuario

    const [isAssistantTyping, setIsAssistantTyping] = useState(false);

    const [resetDialogOpen, setResetDialogOpen] = useState(false);

    // Ref para hacer scroll automático al último mensaje
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Obtiene el historial del chat del asistente abierto.
    const chatHistory = getChatHistory(assistant.id);
    const messages = chatHistory?.messages || [];

    // Scroll automático al último mensaje cuando cambian los mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputMessage.trim() || isAssistantTyping) return;

        const userMessage = inputMessage.trim();

        // Agrega el mensaje del usuario al historial
        addMessageToChat(assistant.id, {
            role: 'user',
            content: userMessage
        });

        setInputMessage('');

        setIsAssistantTyping(true);

        try {
            // Obtiene la respuesta del servicio de chat
            const response = await getChatResponse();

            addMessageToChat(assistant.id, {
                role: 'assistant',
                content: response
            });
        } catch (error) {
            console.error('Error al obtener respuesta:', error);

            // Mensaje de error si falla
            addMessageToChat(assistant.id, {
                role: 'assistant',
                content: 'Lo siento, hubo un error al procesar tu mensaje.'
            });
        } finally {
            setIsAssistantTyping(false);
        }
    };


    const handleResetChat = () => {
        setResetDialogOpen(true);
    };

    return (
        <div className="bg-white rounded-lg border border-neutral-200 flex flex-col 
                    h-[500px] sm:h-[600px] shadow-sm">
            <ConfirmDialog
                isOpen={resetDialogOpen}
                title="Reiniciar conversación"
                message="¿Estás seguro de reiniciar la conversación?"
                confirmText="Reiniciar"
                onConfirm={() => {
                    clearChatHistory(assistant.id);
                    setResetDialogOpen(false);
                }}
                onCancel={() => setResetDialogOpen(false)}
            />
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-neutral-200 
                      flex items-center justify-between bg-neutral-50 rounded-t-lg">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0" />
                    <h3 className="font-semibold text-sm sm:text-base text-neutral-900 truncate">
                        Chat Simulado
                    </h3>
                </div>

                <button
                    onClick={handleResetChat}
                    className="text-xs sm:text-sm text-neutral-600 hover:text-neutral-900 
                     flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 
                     rounded-lg hover:bg-neutral-100 transition-colors flex-shrink-0"
                    aria-label="Reiniciar conversación"
                >
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Reiniciar</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 
                      scrollbar-thin">
                {messages.length === 0 ? (
                    // Estado vacío cuando no hay mensajes
                    <div className="flex flex-col items-center justify-center h-full text-neutral-500 px-4">
                        <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-300 mb-3" />
                        <p className="text-center text-xs sm:text-sm">
                            Inicia una conversación enviando un mensaje
                        </p>
                    </div>
                ) : (
                    // Lista de mensajes
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                } animate-fade-in`}
                        >
                            {message.role === 'assistant' && (
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-100 rounded-full 
                                flex items-center justify-center flex-shrink-0 mt-1">
                                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
                                </div>
                            )}

                            <div
                                className={`max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 sm:py-2.5 
                            rounded-lg shadow-sm ${message.role === 'user'
                                        ? 'bg-primary-600 text-white rounded-br-sm'
                                        : 'bg-neutral-100 text-neutral-900 rounded-bl-sm'
                                    }`}
                            >
                                <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">
                                    {message.content}
                                </p>

                                <p className={`text-[10px] sm:text-xs mt-1 ${message.role === 'user' ? 'text-primary-100' : 'text-neutral-500'
                                    }`}>
                                    {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>

                            {message.role === 'user' && (
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-600 rounded-full 
                                flex items-center justify-center flex-shrink-0 mt-1">
                                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                </div>
                            )}
                        </div>
                    ))
                )}

                {isAssistantTyping && (
                    <div className="flex gap-2 sm:gap-3 justify-start animate-fade-in">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-100 rounded-full 
                            flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
                        </div>
                        <div className="bg-neutral-100 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg 
                            rounded-bl-sm flex items-center gap-2 shadow-sm">
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-600 animate-spin" />
                            <span className="text-xs sm:text-sm text-neutral-600">Escribiendo...</span>
                        </div>
                    </div>
                )}

                {/* div invisible para el scroll automático */}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-neutral-200 p-3 sm:p-4 bg-neutral-50 rounded-b-lg">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        disabled={isAssistantTyping}
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-neutral-300 
                       rounded-lg focus:ring-2 focus:ring-primary-500 
                       focus:border-transparent disabled:bg-neutral-100 
                       disabled:cursor-not-allowed text-xs sm:text-sm transition-shadow"
                    />

                    <button
                        type="submit"
                        disabled={!inputMessage.trim() || isAssistantTyping}
                        className="px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg 
                       hover:bg-primary-700 transition-colors disabled:opacity-50 
                       disabled:cursor-not-allowed flex items-center gap-2 
                       flex-shrink-0 shadow-sm"
                        aria-label="Enviar mensaje"
                    >
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline text-sm font-medium">Enviar</span>
                    </button>
                </form>
            </div>
        </div>
    );
};