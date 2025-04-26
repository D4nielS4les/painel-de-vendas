'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';
import { ServiceType } from '../types';
import confetti from 'canvas-confetti';

interface GoalChartProps {
  type: ServiceType;
  current: number;
  goal: number;
  onGoalUpdate: (type: ServiceType, newValue: number) => void;
}

const randomInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const getCelebratedGoals = (): string[] => {
  const celebrated = localStorage.getItem('celebratedGoals');
  return celebrated ? JSON.parse(celebrated) : [];
};

const addCelebratedGoal = (type: string) => {
  const celebrated = getCelebratedGoals();
  if (!celebrated.includes(type)) {
    celebrated.push(type);
    localStorage.setItem('celebratedGoals', JSON.stringify(celebrated));
  }
};

export function GoalChart({ type, current, goal, onGoalUpdate }: GoalChartProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newGoal, setNewGoal] = useState(goal);
  const [hasReachedGoal, setHasReachedGoal] = useState(false);

  const progress = Math.min((current / goal) * 100, 100);
  const progressColor = progress >= 100 ? 'bg-green-500' : 'bg-indigo-500';

  useEffect(() => {
    if (progress >= 100 && !hasReachedGoal) {
      setHasReachedGoal(true);
      
      // Verificar se esta meta já foi celebrada
      const celebratedGoals = getCelebratedGoals();
      if (!celebratedGoals.includes(type)) {
        // Disparar confetes apenas se for a primeira vez
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
          });
        }, 250);

        // Marcar esta meta como celebrada
        addCelebratedGoal(type);
      }
    } else if (progress < 100) {
      setHasReachedGoal(false);
    }
  }, [progress, hasReachedGoal, type]);

  const handleSave = () => {
    onGoalUpdate(type, newGoal);
    setIsEditing(false);
  };

  return (
    <div className={`space-y-4 p-4 rounded-lg transition-colors duration-500 ${
      hasReachedGoal ? 'bg-green-50 border-2 border-green-500' : 'bg-white'
    }`}>
      <div className="flex justify-between items-center">
        <h3 className={`text-lg font-semibold ${hasReachedGoal ? 'text-green-800' : 'text-indigo-800'}`}>
          {type}
        </h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsEditing(true)}
          className={`${hasReachedGoal ? 'text-green-600 hover:text-green-800 hover:bg-green-100' : 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50'}`}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <Input
            type="number"
            value={newGoal}
            onChange={(e) => setNewGoal(parseFloat(e.target.value))}
            min="0"
            step="100"
            className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
          />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
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
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className={hasReachedGoal ? 'text-green-600' : 'text-indigo-600'}>
              Atual: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(current)}
            </span>
            <span className={hasReachedGoal ? 'text-green-600' : 'text-indigo-600'}>
              Meta: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal)}
            </span>
          </div>
          <Progress value={progress} className={`h-2 ${hasReachedGoal ? 'bg-green-100' : 'bg-indigo-100'} [&>div]:${progressColor}`} />
          <div className={`text-right text-sm font-medium ${hasReachedGoal ? 'text-green-700' : 'text-indigo-700'}`}>
            {progress.toFixed(1)}% concluído
          </div>
        </div>
      )}
    </div>
  );
}