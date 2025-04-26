'use client';

import { useEffect, useState } from 'react';
import { Service } from '../types';
import { storage } from '@/lib/storage';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export default function Relatorio() {
  const [services, setServices] = useState<Service[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const loadData = () => {
    const savedServices = storage.getServices();
    setServices(savedServices);
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  const getMonthServices = () => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    return services
      .filter(service => {
        const serviceDate = new Date(service.date);
        return serviceDate >= firstDayOfMonth && serviceDate <= lastDayOfMonth;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const calculateMonthTotal = () => {
    return getMonthServices().reduce((total, service) => total + service.value, 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-150 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <h1 className="text-2xl sm:text-4xl font-bold text-indigo-800 text-center sm:text-left">Relatório de Vendas</h1>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={handlePreviousMonth}
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                ←
              </Button>
              <span className="text-lg font-semibold text-indigo-700">
                {formatMonth(currentMonth)}
              </span>
              <Button 
                variant="outline" 
                onClick={handleNextMonth}
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                →
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-indigo-50 px-4 py-2 rounded-md border border-indigo-200 w-full sm:w-auto">
              <span className="text-sm text-indigo-600 font-medium">Total do Mês:</span>
              <span className="ml-2 text-lg font-bold text-indigo-700">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(calculateMonthTotal())}
              </span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                onClick={handlePrint}
                className="bg-indigo-600 text-white hover:bg-indigo-700 w-full sm:w-auto"
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Link 
                href="/" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm text-center w-full sm:w-auto"
              >
                Voltar
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-indigo-200">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="px-4 py-2 text-left text-sm font-medium text-indigo-600">Data</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-indigo-600">Veículo</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-indigo-600">Placa</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-indigo-600">Tipo</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-indigo-600">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-100">
                    {getMonthServices().map((service) => (
                      <tr key={service.id} className="hover:bg-indigo-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{formatDate(service.date)}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{service.vehicle}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{service.license_plate}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{service.type}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-green-600">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(service.value)}
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

      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          main {
            padding: 0;
            background: white;
          }
          .no-print {
            display: none;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
          }
        }
      `}</style>
    </main>
  );
} 