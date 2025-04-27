'use client';

import { useEffect, useState } from 'react';
import { GoalChart } from '../components/goal-chart';
import { ServiceGoal, ServiceType, Service } from '../types';
import { storage } from '@/lib/storage';
import Link from 'next/link';

const initialGoals: ServiceGoal[] = [
  { type: 'Funilaria e Pintura', value: 10000 },
  { type: 'Espelhamento de Pintura', value: 5000 },
  { type: 'Higienização Interna', value: 3000 },
  { type: 'Serviços de Aro de Roda', value: 4000 },
  { type: 'DSP', value: 6000 },
  { type: 'Mecânica', value: 8000 },
  { type: 'Serviços de Farois', value: 3500 },
  { type: 'Serviços Particulares', value: 5000 },
  { type: 'Outros Serviços', value: 2000 }
];

export default function Dashboard() {
  const [goals, setGoals] = useState<ServiceGoal[]>(initialGoals);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [savedServices, savedGoals] = await Promise.all([
        storage.getServices(),
        storage.getGoals()
      ]);
      
      console.log('Serviços carregados:', savedServices);
      console.log('Metas carregadas:', savedGoals);
      
      setServices(savedServices || []);
      
      if (savedGoals && savedGoals.length > 0) {
        setGoals(savedGoals);
      } else {
        console.log('Nenhuma meta encontrada, salvando metas iniciais...');
        await storage.setGoals(initialGoals);
        setGoals(initialGoals);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  console.log('Estado atual:', { services, goals, isLoading });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-150 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-screen">
          <div className="text-2xl text-indigo-800">Carregando...</div>
        </div>
      </main>
    );
  }

  if (!services || services.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-150 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h1 className="text-2xl sm:text-4xl font-bold text-indigo-800 text-center sm:text-left">Dashboard de Metas</h1>
            <Link 
              href="/" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm text-center w-full sm:w-auto"
            >
              Voltar
            </Link>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
            <p className="text-lg text-indigo-600">Nenhum serviço encontrado</p>
          </div>
        </div>
      </main>
    );
  }

  const calculateTotal = (type: ServiceType) => {
    if (!Array.isArray(services)) {
      console.log('services não é um array:', services);
      return 0;
    }
    
    const filteredServices = services.filter((service) => service.type === type);
    console.log(`Serviços filtrados para ${type}:`, filteredServices);
    
    const total = filteredServices.reduce((acc, service) => acc + service.value, 0);
    console.log(`Total para ${type}:`, total);
    
    return total;
  };

  const calculateMonthTotal = () => {
    if (!Array.isArray(services)) return 0;
    
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return services
      .filter(service => {
        const serviceDate = new Date(service.date);
        return serviceDate >= firstDayOfMonth && serviceDate <= lastDayOfMonth;
      })
      .reduce((total, service) => total + service.value, 0);
  };

  const handleGoalUpdate = async (type: ServiceType, newValue: number) => {
    const updatedGoals = goals.map(goal => 
      goal.type === type ? { ...goal, value: newValue } : goal
    );
    setGoals(updatedGoals);
    await storage.setGoals(updatedGoals);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-150 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <h1 className="text-2xl sm:text-4xl font-bold text-indigo-800 text-center sm:text-left">Dashboard de Metas</h1>
            <div className="flex items-center gap-2">
              <div className="bg-indigo-50 px-4 py-2 rounded-md border border-indigo-200">
                <span className="text-sm text-indigo-600 font-medium">Total do Mês:</span>
                <span className="ml-2 text-lg font-bold text-indigo-700">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(calculateMonthTotal())}
                </span>
              </div>
            </div>
          </div>
          <Link 
            href="/" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm text-center w-full sm:w-auto"
          >
            Voltar
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {goals.map((goal) => {
            const total = calculateTotal(goal.type);
            console.log(`Renderizando gráfico para ${goal.type}:`, {
              total,
              goal: goal.value,
              progress: (total / goal.value) * 100
            });
            return (
              <div key={goal.type} className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <GoalChart
                  type={goal.type}
                  current={total}
                  goal={goal.value}
                  onGoalUpdate={handleGoalUpdate}
                />
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
} 