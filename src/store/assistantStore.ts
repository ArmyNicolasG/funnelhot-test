// Estados globales de la aplicación

import { create } from 'zustand';
import { Assistant } from '@/lib/types/assistant';
import { ChatHistory } from '@/lib/types/chat';

// Interfaz del storage
interface AssistantStore {

    // Modal de creación o edición de asistente
    isModalOpen: boolean;
    modalMode: 'create' | 'edit';
    selectedAssistant: Assistant | null; // Se pasa el asistente que está siendo editado o se deja en null si se está creando uno nuevo

    modalStep: 1 | 2;

    // Diálogo de mensaje global
    messageDialogOpen: boolean;
    messageDialogTitle: string;
    messageDialogMessage: string;
    messageDialogVariant: 'success' | 'error' | 'info';

    // Diálogo de eliminación
    deleteDialogOpen: boolean;
    assistantToDeleteId: string | null;

    // Historial de chats con cada asistente
    chatHistories: Record<string, ChatHistory>; // Clave: assistantId, Valor: ChatHistory

    trainingTipsOpen: boolean


    //Acciones del modal
    openCreateModal: () => void;
    openEditModal: (assistant: Assistant) => void;
    closeModal: () => void;

    setModalStep: (step: 1 | 2) => void;

    openMessageDialog: (data: { title: string; message: string; variant?: 'success' | 'error' | 'info' }) => void;
    closeMessageDialog: () => void;

    openDeleteDialog: (assistantId: string) => void;
    closeDeleteDialog: () => void;

    // Acciones de los chats
    addMessageToChat: (assistantId: string, message: { role: 'user' | 'assistant'; content: string }) => void;
    clearChatHistory: (assistantId: string) => void;
    getChatHistory: (assistantId: string) => ChatHistory | undefined;

    openTrainingTips: () => void;
    closeTrainingTips: () => void;
}


export const useAssistantStore = create<AssistantStore>((set, get) => ({
    
    // Estado inicial
    isModalOpen: false,
    modalMode: 'create',
    selectedAssistant: null,
    modalStep: 1,

    messageDialogOpen: false,
    messageDialogTitle: '',
    messageDialogMessage: '',
    messageDialogVariant: 'info',

    deleteDialogOpen: false,
    assistantToDeleteId: null,
    chatHistories: {},

    trainingTipsOpen: true,

    // Abrir modal de creación de asistente
    openCreateModal: () => set({
        isModalOpen: true,
        modalMode: 'create',
        selectedAssistant: null,
        modalStep: 1
    }),

    //Abrir modal en modo edición de asistente
    openEditModal: (assistant: Assistant) => set({
        isModalOpen: true,
        modalMode: 'edit',
        selectedAssistant: assistant,
        modalStep: 1
    }),

    //Cerrar modal
    closeModal: () => set({
        isModalOpen: false,
        selectedAssistant: null,
        modalStep: 1
    }),

    setModalStep: (step) => set({ modalStep: step }),

    openMessageDialog: ({ title, message, variant = 'info' }) => set({
        messageDialogOpen: true,
        messageDialogTitle: title,
        messageDialogMessage: message,
        messageDialogVariant: variant
    }),

    closeMessageDialog: () => set({
        messageDialogOpen: false,
        messageDialogTitle: '',
        messageDialogMessage: '',
        messageDialogVariant: 'info'
    }),

    openDeleteDialog: (assistantId) => set({
        deleteDialogOpen: true,
        assistantToDeleteId: assistantId
    }),

    closeDeleteDialog: () => set({
        deleteDialogOpen: false,
        assistantToDeleteId: null
    }),

    
    addMessageToChat: (assistantId, message) => {   // Añadir mensaje a un historial de chat con ID de asistente y mensaje
        const currentHistories = get().chatHistories;

        //Crear historial si no existe
        const existingHistory = currentHistories[assistantId] || {
            assistantId,
            messages: []
        };

        const newMessage = {
            id: `${Date.now()}-${Math.random()}`,
            role: message.role,
            content: message.content,
            timestamp: new Date()
        };

        set({
            chatHistories: {
                ...currentHistories,
                [assistantId]: {
                    ...existingHistory,
                    messages: [...existingHistory.messages, newMessage]
                }
            }
        });
    },

    //Borra todo el historial de chat con un asistente
    clearChatHistory: (assistantId) => {
        const currentHistories = get().chatHistories;

        set({
            chatHistories: {
                ...currentHistories,
                [assistantId]: {
                    assistantId,
                    messages: []
                }
            }
        });
    },

    // GET del historial de chat con un asistente
    getChatHistory: (assistantId) => {
        return get().chatHistories[assistantId];
    },

    openTrainingTips: () => set({ trainingTipsOpen: true }),
    closeTrainingTips: () => set({ trainingTipsOpen: false })
}));