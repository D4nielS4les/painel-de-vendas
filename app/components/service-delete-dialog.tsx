'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Service } from '../types';
import { storage } from '@/lib/storage';
import { useState } from 'react';

interface ServiceDeleteDialogProps {
  service: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

export function ServiceDeleteDialog({ service, open, onOpenChange, onDelete }: ServiceDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const services = await storage.getServices();
      const updatedServices = services.filter((s: Service) => s.id !== service.id);
      await storage.setServices(updatedServices);
      onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-lg shadow-xl border border-indigo-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-800">Excluir Serviço</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            Tem certeza que deseja excluir o serviço do veículo {service.vehicle}?
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 