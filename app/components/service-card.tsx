import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Service, ServiceType } from '../types';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { storage } from '@/lib/storage';

interface ServiceCardProps {
  service: Service;
  onUpdate: () => void;
}

const serviceTypes = [
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

export function ServiceCard({ service, onUpdate }: ServiceCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedService, setEditedService] = useState(service);

  const handleSave = () => {
    const services = storage.getServices();
    const updatedServices = services.map((s: Service) =>
      s.id === service.id ? editedService : s
    );
    storage.setServices(updatedServices);
    setIsEditing(false);
    onUpdate();
  };

  const handleDelete = () => {
    const services = storage.getServices();
    const updatedServices = services.filter((s: Service) => s.id !== service.id);
    storage.setServices(updatedServices);
    onUpdate();
  };

  if (isEditing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Input
            value={editedService.vehicle}
            onChange={(e) => setEditedService({ ...editedService, vehicle: e.target.value })}
            className="font-semibold"
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Placa:</label>
              <Input
                value={editedService.license_plate}
                onChange={(e) => setEditedService({ ...editedService, license_plate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Tipo:</label>
              <Select
                value={editedService.type}
                onValueChange={(value: ServiceType) => setEditedService({ ...editedService, type: value })}
              >
                <SelectTrigger>
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
              <label className="text-sm text-muted-foreground">Valor:</label>
              <Input
                type="number"
                value={editedService.value}
                onChange={(e) => setEditedService({ ...editedService, value: parseFloat(e.target.value) })}
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{service.vehicle}</CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Placa:</span>
            <span className="font-medium">{service.license_plate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipo:</span>
            <span className="font-medium">{service.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor:</span>
            <span className="font-medium">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(service.value)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}