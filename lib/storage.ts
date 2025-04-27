import { supabase } from './supabase';
import { Service, ServiceGoal } from '@/app/types';

export const storage = {
  getServices: async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar serviços:', error);
      return [];
    }

    return data || [];
  },
  
  setServices: async (services: Service[]) => {
    const { error } = await supabase
      .from('services')
      .upsert(services);

    if (error) {
      console.error('Erro ao salvar serviços:', error);
    }
  },
  
  getGoals: async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*');

    if (error) {
      console.error('Erro ao buscar metas:', error);
      return null;
    }

    return data || null;
  },
  
  setGoals: async (goals: ServiceGoal[]) => {
    const { error } = await supabase
      .from('goals')
      .upsert(goals);

    if (error) {
      console.error('Erro ao salvar metas:', error);
    }
  }
};