'use client';

import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const ConfirmDialog = ({ // Modal de confirmación
    isOpen,
    title,
    message,
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    isLoading = false
}: ConfirmDialogProps) => {

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-fade-in" onClick={onCancel} />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-start gap-3 sm:gap-4 mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-warning-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-warning-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-1">
                                {title}
                            </h3>
                            <p className="text-neutral-600 text-xs sm:text-sm break-words">
                                {message}
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
                        <button
                            onClick={onCancel}
                            disabled={isLoading}
                            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-all duration-200 ease-out active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {cancelText}
                        </button>

                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-white bg-warning-600 rounded-lg hover:bg-warning-700 transition-all duration-200 ease-out active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
