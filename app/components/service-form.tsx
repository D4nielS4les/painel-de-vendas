'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceType } from '../types';
import { storage } from '@/lib/storage';

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

interface ServiceFormProps {
  onServiceAdded: () => void;
}

export function ServiceForm({ onServiceAdded }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    vehicle: '',
    licensePlate: '',
    type: '' as ServiceType,
    value: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newService = {
      id: crypto.randomUUID(),
      vehicle: formData.vehicle,
      license_plate: formData.licensePlate,
      type: formData.type,
      value: parseFloat(formData.value),
      date: new Date().toISOString()
    };

    const services = storage.getServices();
    storage.setServices([newService, ...services]);

    setFormData({
      vehicle: '',
      licensePlate: '',
      type: '' as ServiceType,
      value: ''
    });
    
    onServiceAdded();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Novo Serviço</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="vehicle">Veículo</label>
            <Input
              id="vehicle"
              value={formData.vehicle}
              onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
              placeholder="Ex: Fiat Palio 2020"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="licensePlate">Placa</label>
            <Input
              id="licensePlate"
              value={formData.licensePlate}
              onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
              placeholder="ABC-1234"
              required
            />
          </div>
          <div className="space-y-2">
            <label>Tipo de Serviço</label>
            <Select 
              required
              onValueChange={(value) => setFormData({ ...formData, type: value as ServiceType })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de serviço" />
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
            <label htmlFor="value">Valor do Serviço</label>
            <Input
              id="value"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="R$ 0,00"
              required
              min="0"
              step="0.01"
            />
          </div>
          <Button type="submit" className="w-full">
            Adicionar Serviço
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}