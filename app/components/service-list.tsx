'use client';

import { Service } from '../types';
import { ServiceEditDialog } from './service-edit-dialog';
import { ServiceDeleteDialog } from './service-delete-dialog';
import { useState } from 'react';
import { storage } from '@/lib/storage';

interface ServiceListProps {
  services: Service[];
  onServicesChange: (services: Service[]) => void;
}

export function ServiceList({ services, onServicesChange }: ServiceListProps) {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const handleEdit = (service: Service) => {
    setEditingService(service);
  };

  const handleDelete = (service: Service) => {
    setDeletingService(service);
  };

  const handleUpdate = async () => {
    try {
      const updatedServices = await storage.getServices();
      onServicesChange(updatedServices);
    } catch (error) {
      console.error('Erro ao atualizar serviços:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingService) return;
    
    try {
      const updatedServices = services.filter(service => service.id !== deletingService.id);
      await storage.setServices(updatedServices);
      onServicesChange(updatedServices);
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
    }
  };

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div
          key={service.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-indigo-800">{service.vehicle}</h3>
              <p className="text-sm text-gray-600">Placa: {service.license_plate}</p>
              <p className="text-sm text-gray-600">Tipo: {service.type}</p>
              <p className="text-sm text-gray-600">Valor: R$ {service.value.toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(service)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(service)}
                className="text-red-600 hover:text-red-800"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      ))}

      {editingService && (
        <ServiceEditDialog
          service={editingService}
          open={!!editingService}
          onOpenChange={(open) => !open && setEditingService(null)}
          onUpdate={handleUpdate}
        />
      )}

      {deletingService && (
        <ServiceDeleteDialog
          service={deletingService}
          open={!!deletingService}
          onOpenChange={(open) => !open && setDeletingService(null)}
          onDelete={handleDeleteConfirm}
        />
      )}
    </div>
  );
} 