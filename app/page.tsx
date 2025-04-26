'use client';

import { useEffect, useState } from 'react';
import { ServiceForm } from './components/service-form';
import { Service } from './types';
import { storage } from '@/lib/storage';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { ServiceEditDialog } from './components/service-edit-dialog';

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const loadData = () => {
    const savedServices = storage.getServices();
    setServices(savedServices);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string) => {
    const updatedServices = services.filter(service => service.id !== id);
    storage.setServices(updatedServices);
    loadData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTodayTotal = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return services
      .filter(service => {
        const serviceDate = new Date(service.date);
        serviceDate.setHours(0, 0, 0, 0);
        return serviceDate.getTime() === today.getTime();
      })
      .reduce((total, service) => total + service.value, 0);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-150 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-indigo-800">Painel de Vendas - Paulo Roberto</h1>
          <div className="flex gap-4">
            <Link 
              href="/relatorio" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Relatório Mensal
            </Link>
            <Link 
              href="/dashboard" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Ver Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
              <ServiceForm onServiceAdded={loadData} />
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-indigo-800">Serviços Recentes</h2>
                <div className="bg-green-50 px-4 py-2 rounded-md border border-green-200">
                  <span className="text-sm text-green-600 font-medium">Total do Dia:</span>
                  <span className="ml-2 text-lg font-bold text-green-700">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(calculateTodayTotal())}
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-indigo-200">
                      <th className="text-left p-2 text-indigo-600">Veículo</th>
                      <th className="text-left p-2 text-indigo-600">Placa</th>
                      <th className="text-left p-2 text-indigo-600">Tipo</th>
                      <th className="text-left p-2 text-indigo-600">Valor</th>
                      <th className="text-left p-2 text-indigo-600">Data</th>
                      <th className="text-left p-2 text-indigo-600">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id} className="border-b border-indigo-100 hover:bg-indigo-50">
                        <td className="p-2">{service.vehicle}</td>
                        <td className="p-2">{service.license_plate}</td>
                        <td className="p-2">{service.type}</td>
                        <td className="p-2 font-medium text-green-600">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(service.value)}
                        </td>
                        <td className="p-2 text-gray-600">{formatDate(service.date)}</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setEditingService(service)}
                              className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(service.id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editingService && (
        <ServiceEditDialog
          service={editingService}
          open={!!editingService}
          onOpenChange={(open) => !open && setEditingService(null)}
          onUpdate={loadData}
        />
      )}
    </main>
  );
}