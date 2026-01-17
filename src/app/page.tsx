// Página principal: Listado de asistentes
// Ruta: /
// RESPONSIVE con paleta de colores centralizada

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Loader2 } from 'lucide-react';
import { useAssistantStore } from '@/store/assistantStore';
import { AssistantCard } from '@/components/AssistantCard';
import { AssistantModal } from '@/components/AssistantModal';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { MessageDialog } from '@/components/MessageDialog';
import {
    getAssistants,
    createAssistant,
    updateAssistant,
    deleteAssistant
} from '@/lib/services/assistantService';
import { CreateAssistantInput, Assistant } from '@/lib/types/assistant';

export default function HomePage() {
    // Store de Zustand para el modal
    const {
        isModalOpen,
        modalMode,
        selectedAssistant,
        openCreateModal,
        closeModal,
        deleteDialogOpen,
        assistantToDeleteId,
        openDeleteDialog,
        closeDeleteDialog,
        messageDialogOpen,
        messageDialogTitle,
        messageDialogMessage,
        messageDialogVariant,
        openMessageDialog,
        closeMessageDialog
    } = useAssistantStore();

    const queryClient = useQueryClient();

    /**
     * QUERY: Obtener lista de asistentes
     * React Query maneja cache, loading, error automáticamente
     */
    const {
        data: assistants = [],
        isLoading,
        error
    } = useQuery({
        queryKey: ['assistants'], // Clave única para esta query
        queryFn: getAssistants, // Función que hace el fetch
    });

    //Crear nuevo asistente
    const createMutation = useMutation({
        mutationFn: createAssistant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assistants'] });
            closeModal();
            openMessageDialog({
                variant: 'success',
                title: 'Listo',
                message: 'Asistente creado exitosamente'
            });
        },
        onError: (error: Error) => {
            openMessageDialog({
                variant: 'error',
                title: 'Error',
                message: `Error al crear: ${error.message}`
            });
        }
    });

    // Actualizar asistente
    const updateMutation = useMutation({
        mutationFn: updateAssistant,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assistants'] });
            closeModal();
            openMessageDialog({
                variant: 'success',
                title: 'Listo',
                message: 'Asistente actualizado exitosamente'
            });
        },
        onError: (error: Error) => {
            openMessageDialog({
                variant: 'error',
                title: 'Error',
                message: `Error al actualizar: ${error.message}`
            });
        }
    });

    //Eliminar asistente
    const deleteMutation = useMutation({
        mutationFn: deleteAssistant,
        // Optimistic update que actualiza la interfaz inmediatamente
        onMutate: async (deletedId) => {
            
            await queryClient.cancelQueries({ queryKey: ['assistants'] }); // Cancela cualquier refetch en progreso

            
            const previousAssistants = queryClient.getQueryData<Assistant[]>(['assistants']); // Guarda el estado anterior por si hay que revertir

            queryClient.setQueryData<Assistant[]>(['assistants'], (old) =>
                old?.filter(a => a.id !== deletedId) || []
            );

            // Retorna contexto con el estado anterior
            return { previousAssistants };
        },
        onSuccess: () => {
            closeDeleteDialog();
            openMessageDialog({
                variant: 'success',
                title: 'Listo',
                message: 'Asistente eliminado exitosamente'
            });
        },
        onError: (error: Error, deletedId, context) => {
            // Si hay error, revierte al estado anterior
            if (context?.previousAssistants) {
                queryClient.setQueryData(['assistants'], context.previousAssistants);
            }
            openMessageDialog({
                variant: 'error',
                title: 'Error',
                message: `Error al eliminar: ${error.message}`
            });
            closeDeleteDialog();
        },
        onSettled: () => {
            // Siempre invalida para sincronizar con el servidor
            queryClient.invalidateQueries({ queryKey: ['assistants'] });
        }
    });

    // Envío del modal.
    const handleModalSubmit = (data: CreateAssistantInput) => {
        if (modalMode === 'create') {
            createMutation.mutate(data);
        } else if (selectedAssistant) {
            updateMutation.mutate({
                id: selectedAssistant.id,
                ...data
            });
        }
    };

    // Diálogo de confirmación de eliminación
    const handleDeleteClick = (id: string) => {
        openDeleteDialog(id);
    };

    // COnfirma y ejecuta la eliminación del asistente
    const handleDeleteConfirm = () => {
        if (assistantToDeleteId) {
            deleteMutation.mutate(assistantToDeleteId);
        }
    };

    // Estado de carga inicial
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="text-center px-4">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 animate-spin mx-auto mb-4" />
                    <p className="text-neutral-600 text-sm sm:text-base">Cargando asistentes...</p>
                </div>
            </div>
        );
    }

    // Estado de error
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="text-center px-4">
                    <p className="text-danger-600 mb-4 text-sm sm:text-base">
                        Error al cargar los asistentes
                    </p>
                    <button
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['assistants'] })}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
                       transition-colors text-sm sm:text-base shadow-sm"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <MessageDialog
                isOpen={messageDialogOpen}
                title={messageDialogTitle}
                message={messageDialogMessage}
                variant={messageDialogVariant}
                onClose={closeMessageDialog}
            />
            {/* Header - RESPONSIVE */}
            <header className="bg-white border-b border-neutral-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                                Asistentes IA
                            </h1>
                            <p className="text-neutral-600 mt-1 text-sm sm:text-base">
                                Gestiona tus asistentes de inteligencia artificial
                            </p>
                        </div>

                        {/* Botón crear asistente - RESPONSIVE */}
                        <button
                            onClick={openCreateModal}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 
                         bg-primary-600 text-white rounded-lg hover:bg-primary-700 
                         transition-colors shadow-sm text-sm sm:text-base font-medium
                         w-full sm:w-auto"
                        >
                            <Plus className="w-5 h-5" />
                            Crear Asistente
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenido principal - RESPONSIVE */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {assistants.length === 0 ? (
                    // Estado vacío
                    <EmptyState />
                ) : (
                    <>
                        {/* Contador de asistentes */}
                        <div className="mb-4 sm:mb-6">
                            <p className="text-xs sm:text-sm text-neutral-600">
                                {assistants.length} {assistants.length === 1 ? 'asistente' : 'asistentes'}
                            </p>
                        </div>

                        {/* Grid de tarjetas - RESPONSIVE */}
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {assistants.map((assistant) => (
                                <AssistantCard
                                    key={assistant.id}
                                    assistant={assistant}
                                    onDelete={handleDeleteClick}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>

            {/* Modal de creación/edición */}
            <AssistantModal
                isOpen={isModalOpen}
                mode={modalMode}
                assistant={selectedAssistant}
                onClose={closeModal}
                onSubmit={handleModalSubmit}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />

            {/* Diálogo de confirmación de eliminación */}
            <DeleteConfirmDialog
                isOpen={deleteDialogOpen}
                assistantName={assistants.find(a => a.id === assistantToDeleteId)?.name || ''}
                onConfirm={handleDeleteConfirm}
                onCancel={closeDeleteDialog}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}