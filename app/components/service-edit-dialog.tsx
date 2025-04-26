'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Service, ServiceType } from '../types';
import { storage } from '@/lib/storage';
import { useState } from 'react';

const serviceTypes: ServiceType[] = [
  'Funilaria e Pintura',
  'Espelhamento de Pintura',
  'Higienização Interna',
  'Serviços de Aro de Roda',
  'DSP',
  'Mecânica',
  'Serviços de Farois',
  'Serviços Particulares',
  'Outros Serviços'
];

interface ServiceEditDialogProps {
  service: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function ServiceEditDialog({ service, open, onOpenChange, onUpdate }: ServiceEditDialogProps) {
  const [editedService, setEditedService] = useState(service);

  const handleSave = () => {
    const services = storage.getServices();
    const updatedServices = services.map((s: Service) =>
      s.id === service.id ? editedService : s
    );
    storage.setServices(updatedServices);
    onUpdate();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-lg shadow-xl border border-indigo-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-800">Editar Serviço</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="vehicle" className="text-sm font-medium text-indigo-700">Veículo</label>
            <Input
              id="vehicle"
              value={editedService.vehicle}
              onChange={(e) => setEditedService({ ...editedService, vehicle: e.target.value })}
              placeholder="Ex: Fiat Palio 2020"
              className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="licensePlate" className="text-sm font-medium text-indigo-700">Placa</label>
            <Input
              id="licensePlate"
              value={editedService.license_plate}
              onChange={(e) => setEditedService({ ...editedService, license_plate: e.target.value })}
              placeholder="ABC-1234"
              className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-indigo-700">Tipo de Serviço</label>
            <Select 
              value={editedService.type}
              onValueChange={(value) => setEditedService({ ...editedService, type: value as ServiceType })}
            >
              <SelectTrigger className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="value" className="text-sm font-medium text-indigo-700">Valor do Serviço</label>
            <Input
              id="value"
              type="number"
              value={editedService.value}
              onChange={(e) => setEditedService({ ...editedService, value: parseFloat(e.target.value) })}
              placeholder="R$ 0,00"
              min="0"
              step="0.01"
              className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 