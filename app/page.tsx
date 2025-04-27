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
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const savedServices = await storage.getServices();
      setServices(savedServices);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const updatedServices = services.filter(service => service.id !== id);
      await storage.setServices(updatedServices);
      await loadData();
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
    }
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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-150 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-screen">
          <div className="text-2xl text-indigo-800">Carregando...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-150 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h1 className="text-2xl sm:text-4xl font-bold text-indigo-800 text-center sm:text-left">Painel de Vendas - Paulo Roberto</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Link 
              href="/relatorio" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm text-center"
            >
              Relatório Mensal
            </Link>
            <Link 
              href="/dashboard" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm text-center"
            >
              Ver Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md sticky top-4 sm:top-8">
              <ServiceForm onServiceAdded={loadData} />
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-indigo-800">Serviços Recentes</h2>
                <div className="bg-green-50 px-4 py-2 rounded-md border border-green-200 w-full sm:w-auto">
                  <span className="text-sm text-green-600 font-medium">Total do Dia:</span>
                  <span className="ml-2 text-lg font-bold text-green-700">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(calculateTodayTotal())}
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-indigo-200">
                      <thead>
                        <tr className="bg-indigo-50">
                          <th className="px-4 py-2 text-left text-sm font-medium text-indigo-600">Veículo</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-indigo-600">Placa</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-indigo-600">Tipo</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-indigo-600">Valor</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-indigo-600">Data</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-indigo-600">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-indigo-100">
                        {services.map((service) => (
                          <tr key={service.id} className="hover:bg-indigo-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{service.vehicle}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{service.license_plate}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{service.type}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-green-600">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(service.value)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{formatDate(service.date)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
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