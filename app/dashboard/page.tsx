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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-indigo-800">Dashboard de Metas</h1>
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
          <Link 
            href="/" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Voltar
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div key={goal.type} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
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