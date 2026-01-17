import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    assistantName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean; //está procesando la eliminación
}

// Componente de diálogo de confirmación para eliminar asistentes
export const DeleteConfirmDialog = ({ isOpen, assistantName, onConfirm, onCancel, isLoading = false }: DeleteConfirmDialogProps) => {

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-fade-in" onClick={onCancel} /> 
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 animate-slide-up" onClick={(e) => e.stopPropagation()} >
                    <div className="flex items-start gap-3 sm:gap-4 mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-danger-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-danger-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-1">
                                ¿Eliminar asistente?
                            </h3>
                            <p className="text-neutral-600 text-xs sm:text-sm break-words">
                                Estás a punto de eliminar <strong className="text-neutral-900">{assistantName}</strong>.
                                Esta acción no se puede deshacer.
                            </p>
                        </div>

                        <button
                            onClick={onCancel}
                            disabled={isLoading}
                            className="text-neutral-400 hover:text-neutral-600 disabled:opacity-50 transition-all duration-200 ease-out active:scale-[0.98] flex-shrink-0"
                            aria-label="Cerrar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end mt-6">
                        <button onClick={onCancel} disabled={isLoading} className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-all duration-200 ease-out active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                            Cancelar
                        </button>

                        <button onClick={onConfirm} disabled={isLoading} className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-white bg-danger-600 rounded-lg hover:bg-danger-700 transition-all duration-200 ease-out active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium">
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent 
                                  rounded-full animate-spin" />
                                    Eliminando...
                                </>
                            ) : (
                                'Eliminar'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};