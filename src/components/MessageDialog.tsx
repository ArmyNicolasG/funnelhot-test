// Modal de mensaje para reemplazar alerts
// Solo muestra un botón de aceptar

'use client';

import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface MessageDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    variant?: 'success' | 'error' | 'info';
    onClose: () => void;
}

export const MessageDialog = ({
    isOpen,
    title,
    message,
    variant = 'info',
    onClose
}: MessageDialogProps) => {

    if (!isOpen) return null;

    const Icon = variant === 'success' ? CheckCircle : variant === 'error' ? XCircle : Info;
    const iconBg = variant === 'success' ? 'bg-success-100' : variant === 'error' ? 'bg-danger-100' : 'bg-primary-100';
    const iconColor = variant === 'success' ? 'text-success-600' : variant === 'error' ? 'text-danger-600' : 'text-primary-600';

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] animate-fade-in" onClick={onClose} />
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-start gap-3 sm:gap-4 mb-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
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
                            onClick={onClose}
                            className="text-neutral-400 hover:text-neutral-600 transition-all duration-200 ease-out active:scale-[0.98] flex-shrink-0"
                            aria-label="Cerrar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all duration-200 ease-out active:scale-[0.98] font-medium"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
