'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, ChevronLeft } from 'lucide-react';
import { Assistant, CreateAssistantInput } from '@/lib/types/assistant';
import { useAssistantStore } from '@/store/assistantStore';

interface AssistantModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    assistant: Assistant | null; // null si está en modo creación
    onClose: () => void;
    onSubmit: (data: CreateAssistantInput) => void;
    isLoading?: boolean;
}

interface FormData {
    name: string;
    language: 'Español' | 'Inglés' | 'Portugués';
    tone: 'Formal' | 'Casual' | 'Profesional' | 'Amigable';
    short: number;
    medium: number;
    long: number;
    audioEnabled: boolean;
}

export const AssistantModal = ({
    isOpen,
    mode,
    assistant,
    onClose,
    onSubmit,
    isLoading = false
}: AssistantModalProps) => {
    const { modalStep, setModalStep, openMessageDialog } = useAssistantStore();

    // React Hook Form para manejo de formulario
    const {
        register,        // Registra inputs en el formulario
        handleSubmit,    // Maneja el submit
        formState: { errors }, // Errores de validación
        watch,           // Observa valores de campos
        reset            // Resetea el formulario
    } = useForm<FormData>({

        defaultValues: {
            name: '',
            language: 'Español',
            tone: 'Profesional',
            short: 30,
            medium: 50,
            long: 20,
            audioEnabled: false
        }
    });

    // Observa los valores de los porcentajes para validación en tiempo real
    const shortValue = watch('short');
    const mediumValue = watch('medium');
    const longValue = watch('long');
    const totalPercentage = Number(shortValue) + Number(mediumValue) + Number(longValue);

    // listener para cargar datos del asistente en modo edición
    useEffect(() => {
        if (isOpen && mode === 'edit' && assistant) {
            reset({
                name: assistant.name,
                language: assistant.language,
                tone: assistant.tone,
                short: assistant.responseLength.short,
                medium: assistant.responseLength.medium,
                long: assistant.responseLength.long,
                audioEnabled: assistant.audioEnabled
            });
        } else if (isOpen && mode === 'create') {
            // Resetea a valores por defecto en modo crear
            reset({
                name: '',
                language: 'Español',
                tone: 'Profesional',
                short: 30,
                medium: 50,
                long: 20,
                audioEnabled: false
            });
        }
    }, [isOpen, mode, assistant, reset]);

    // listener para resetear al paso 1 cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setModalStep(1);
        }
    }, [isOpen, setModalStep]);

    // Validación de paso 1 y 2
    const handleNextStep = () => {
        const nameValue = watch('name');

        if (!nameValue || nameValue.trim().length < 3) {
            openMessageDialog({
                variant: 'error',
                title: 'Error',
                message: 'El nombre debe tener al menos 3 caracteres'
            });
            return;
        }

        setModalStep(2);
    };


    const onFormSubmit = (data: FormData) => { //Verificación antes de guardado final
        if (totalPercentage !== 100) {
            openMessageDialog({
                variant: 'error',
                title: 'Error',
                message: 'La suma de los porcentajes debe ser exactamente 100%'
            });
            return;
        }

        const submitData: CreateAssistantInput = {
            name: data.name.trim(),
            language: data.language,
            tone: data.tone,
            responseLength: {
                short: Number(data.short),
                medium: Number(data.medium),
                long: Number(data.long)
            },
            audioEnabled: data.audioEnabled,
            rules: assistant?.rules || '' // Mantiene las rules existentes en edición
        };

        onSubmit(submitData);
    };
    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div
                    className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8 
                      max-h-[90vh] overflow-y-auto animate-slide-up"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="sticky top-0 bg-white border-b border-neutral-200 px-4 sm:px-6 
                          py-4 flex items-center justify-between z-10 rounded-t-lg">
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">
                                {mode === 'create' ? 'Crear Asistente' : 'Editar Asistente'}
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                                Paso {modalStep} de 2
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-neutral-400 hover:text-neutral-600 disabled:opacity-50 
                         transition-all duration-200 ease-out active:scale-[0.98] p-1"
                            aria-label="Cerrar modal"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>

                    {/*  formulario */}
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="px-4 sm:px-6 py-4 sm:py-6">

                            {modalStep === 1 && (
                                <div className="space-y-4 sm:space-y-5 animate-fade-in">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                            Nombre del asistente *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('name', {
                                                required: 'El nombre es requerido',
                                                minLength: {
                                                    value: 3,
                                                    message: 'El nombre debe tener al menos 3 caracteres'
                                                }
                                            })}
                                            className="w-full px-3 py-2 sm:py-2.5 border border-neutral-300 rounded-lg 
                                 focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                 text-sm sm:text-base transition-shadow"
                                            placeholder="Ej: Asistente de Ventas"
                                        />
                                        {errors.name && (
                                            <p className="text-danger-600 text-xs sm:text-sm mt-1 relative z-10">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                            Idioma *
                                        </label>
                                        <select
                                            {...register('language', { required: true })}
                                            className="w-full px-3 py-2 sm:py-2.5 border border-neutral-300 rounded-lg 
                                 focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                 text-sm sm:text-base transition-shadow bg-white"
                                        >
                                            <option value="Español">Español</option>
                                            <option value="Inglés">Inglés</option>
                                            <option value="Portugués">Portugués</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                            Tono/Personalidad *
                                        </label>
                                        <select
                                            {...register('tone', { required: true })}
                                            className="w-full px-3 py-2 sm:py-2.5 border border-neutral-300 rounded-lg 
                                 focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                 text-sm sm:text-base transition-shadow bg-white"
                                        >
                                            <option value="Formal">Formal</option>
                                            <option value="Casual">Casual</option>
                                            <option value="Profesional">Profesional</option>
                                            <option value="Amigable">Amigable</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Paso 2 */}
                            {modalStep === 2 && (
                                <div className="space-y-5 sm:space-y-6 animate-fade-in">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2 sm:mb-3">
                                            Longitud de respuestas *
                                        </label>
                                        <p className="text-xs sm:text-sm text-neutral-600 mb-4">
                                            Indica el porcentaje de cada tipo de respuesta. La suma debe ser 100%.
                                        </p>

                                        <div className="space-y-4 sm:space-y-5">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="text-xs sm:text-sm text-neutral-700 font-medium">
                                                        Cortas
                                                    </label>
                                                    <span className="text-xs sm:text-sm font-semibold text-neutral-900 
                                         bg-success-50 px-2 py-1 rounded">
                                                        {shortValue}%
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    {...register('short')}
                                                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none 
                                     cursor-pointer accent-success-500"
                                                />
                                            </div>

                                            {/* Respuestas medias */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="text-xs sm:text-sm text-neutral-700 font-medium">
                                                        Medias
                                                    </label>
                                                    <span className="text-xs sm:text-sm font-semibold text-neutral-900 
                                         bg-warning-50 px-2 py-1 rounded">
                                                        {mediumValue}%
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    {...register('medium')}
                                                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none 
                                     cursor-pointer accent-warning-500"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="text-xs sm:text-sm text-neutral-700 font-medium">
                                                        Largas
                                                    </label>
                                                    <span className="text-xs sm:text-sm font-semibold text-neutral-900 
                                         bg-primary-50 px-2 py-1 rounded">
                                                        {longValue}%
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    {...register('long')}
                                                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none 
                                     cursor-pointer accent-primary-500"
                                                />
                                            </div>
                                        </div>

                                        <div className={`mt-4 p-3 rounded-lg text-sm font-medium transition-all ${totalPercentage === 100
                                                ? 'bg-success-50 text-success-700 border border-success-200'
                                                : 'bg-danger-50 text-danger-700 border border-danger-200'
                                            }`}>
                                            <p>
                                                Total: {totalPercentage}%
                                                {totalPercentage === 100 ? ' ✓' : ' (debe ser 100%)'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 sm:gap-3 pt-2">
                                        <input
                                            type="checkbox"
                                            id="audioEnabled"
                                            {...register('audioEnabled')}
                                            className="w-4 h-4 text-primary-600 border-neutral-300 rounded 
                                 focus:ring-primary-500 cursor-pointer"
                                        />
                                        <label htmlFor="audioEnabled" className="text-xs sm:text-sm text-neutral-700 cursor-pointer">
                                            Habilitar respuestas de audio
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 border-t border-neutral-200 px-4 sm:px-6 
                            py-3 sm:py-4 flex justify-between bg-white rounded-b-lg">
                            {modalStep === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setModalStep(1)}
                                    disabled={isLoading}
                                    className="px-3 sm:px-4 py-2 text-sm sm:text-base text-neutral-700 
                             bg-neutral-100 rounded-lg hover:bg-neutral-200 
                             transition-all duration-200 ease-out active:scale-[0.98] flex items-center gap-2 disabled:opacity-50
                             font-medium"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Atrás</span>
                                </button>
                            )}

                            {modalStep === 1 && <div />}

                            <div className="flex gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="px-3 sm:px-4 py-2 text-sm sm:text-base text-neutral-700 
                             bg-neutral-100 rounded-lg hover:bg-neutral-200 
                             transition-all duration-200 ease-out active:scale-[0.98] disabled:opacity-50 font-medium"
                                >
                                    Cancelar
                                </button>

                                {modalStep === 1 ? (
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                    className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-primary-600 
                               text-white rounded-lg hover:bg-primary-700 transition-all duration-200 ease-out active:scale-[0.98]
                               font-medium shadow-sm"
                                    >
                                        Siguiente
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleSubmit(onFormSubmit)()}
                                        disabled={isLoading || totalPercentage !== 100}
                                        className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-primary-600 
                               text-white rounded-lg hover:bg-primary-700 transition-all duration-200 ease-out active:scale-[0.98] 
                               disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center gap-2 font-medium shadow-sm"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent 
                                        rounded-full animate-spin" />
                                                <span className="hidden sm:inline">Guardando...</span>
                                                <span className="sm:hidden">...</span>
                                            </>
                                        ) : (
                                            'Guardar'
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};