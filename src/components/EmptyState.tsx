import { Bot } from 'lucide-react';

export const EmptyState = () => { // Muestra un estado vacío cuando no hay asistentes
    return (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-400" />
            </div>

            <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2 text-center">
                No hay asistentes creados
            </h3>

            <p className="text-sm sm:text-base text-neutral-500 text-center max-w-sm sm:max-w-md px-4">
                Comienza creando tu primer asistente IA haciendo clic en el botón "Crear Asistente"
            </p>
        </div>
    );
};