// Servicio mock para simular operaciones  con el backend

import { Assistant, CreateAssistantInput, UpdateAssistantInput } from '../types/assistant';

const INITIAL_ASSISTANTS: Assistant[] = [
    {
        id: '1',
        name: 'Asistente de Ventas',
        language: 'Español',
        tone: 'Profesional',
        responseLength: {
            short: 30,
            medium: 50,
            long: 20
        },
        audioEnabled: true,
        rules: 'Eres un asistente especializado en ventas. Siempre sé cordial y enfócate en identificar necesidades del cliente antes de ofrecer productos.'
    },
    {
        id: '2',
        name: 'Soporte Técnico',
        language: 'Inglés',
        tone: 'Amigable',
        responseLength: {
            short: 20,
            medium: 30,
            long: 50
        },
        audioEnabled: false,
        rules: 'Ayudas a resolver problemas técnicos de manera clara y paso a paso. Siempre confirma que el usuario haya entendido antes de continuar.'
    }
];

//Almacenamiento en mmemoria de los asistentes
let assistantsDB: Assistant[] = [...INITIAL_ASSISTANTS];

// Simulación de delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// SImulador de error aleatorio para delete
const shouldSimulateError = () => Math.random() < 0.1;


export const getAssistants = async (): Promise<Assistant[]> => {
    await delay(300);
    return [...assistantsDB];
};

// Función GET de asistente por id
export const getAssistantById = async (id: string): Promise<Assistant> => {
    await delay(200);
    const assistant = assistantsDB.find(a => a.id === id);

    if (!assistant) {
        throw new Error(`Asistente con ID ${id} no encontrado`);
    }

    return { ...assistant };
};

// Función POST de asistente
export const createAssistant = async (input: CreateAssistantInput): Promise<Assistant> => {
    await delay(400);

    const newAssistant: Assistant = {
        ...input,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Se usa timestamp y random para el ID
    };

    assistantsDB.push(newAssistant);
    return { ...newAssistant };
};

// Función PUT de asistente
export const updateAssistant = async (input: UpdateAssistantInput): Promise<Assistant> => {
    await delay(400);

    const index = assistantsDB.findIndex(a => a.id === input.id);

    if (index === -1) {
        throw new Error(`Asistente con ID ${input.id} no encontrado`);
    }

    assistantsDB[index] = {
        ...assistantsDB[index],
        ...input
    };

    return { ...assistantsDB[index] };
};

//DELETE de asistente
export const deleteAssistant = async (id: string): Promise<void> => {
    await delay(500);

    if (shouldSimulateError()) {
        throw new Error('Error al eliminar el asistente. Por favor intenta de nuevo.');
    }

    const index = assistantsDB.findIndex(a => a.id === id);

    if (index === -1) {
        throw new Error(`Asistente con ID ${id} no encontrado`);
    }

    assistantsDB.splice(index, 1);
};