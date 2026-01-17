// Servicio mock para simular respuestas de chat

const CHAT_RESPONSES = [
    'Entendido, ¿en qué más puedo ayudarte?',
    'Esa es una excelente pregunta. Déjame explicarte...',
    'Claro, con gusto te ayudo con eso.',
    '¿Podrías darme más detalles sobre tu consulta?',
    'Perfecto, he registrado esa información.'
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getChatResponse = async (): Promise<string> => {
    await delay(1000 + Math.random() * 1000);

    const randomIndex = Math.floor(Math.random() * CHAT_RESPONSES.length);
    return CHAT_RESPONSES[randomIndex];
};
