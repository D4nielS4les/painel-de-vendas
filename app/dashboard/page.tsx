'use client';

import { useEffect, useState } from 'react';
import { GoalChart } from '../components/goal-chart';
import { ServiceGoal, ServiceType } from '../types';
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
  const [services, setServices] = useState<any[]>([]);

  const loadData = () => {
    const savedServices = storage.getServices();
    const savedGoals = storage.getGoals();
    
    setServices(savedServices);
    
    if (savedGoals) {
      setGoals(savedGoals);
    } else {
      storage.setGoals(initialGoals);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateTotal = (type: ServiceType) => {
    return services
      .filter((service) => service.type === type)
      .reduce((acc, service) => acc + service.value, 0);
  };

  const calculateMonthTotal = () => {
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

  const handleGoalUpdate = (type: ServiceType, newValue: number) => {
    const updatedGoals = goals.map(goal => 
      goal.type === type ? { ...goal, value: newValue } : goal
    );
    setGoals(updatedGoals);
    storage.setGoals(updatedGoals);
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
          {goals.map((goal) => (
            <div key={goal.type} className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <GoalChart
                type={goal.type}
                current={calculateTotal(goal.type)}
                goal={goal.value}
                onGoalUpdate={handleGoalUpdate}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 