import { supabase } from './supabase';
import { Service, ServiceGoal } from '@/app/types';

export const storage = {
  getServices: async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar serviços:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      return [];
    }
  },
  
  setServices: async (services: Service[]) => {
    try {
      const { error } = await supabase
        .from('services')
        .upsert(services);

      if (error) {
        console.error('Erro ao salvar serviços:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao salvar serviços:', error);
      throw error;
    }
  },

  deleteService: async (id: string) => {
    try {
      console.log('Deletando serviço:', id);
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar serviço:', error);
        throw error;
      }
      console.log('Serviço deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      throw error;
    }
  },
  
  getGoals: async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*');

      if (error) {
        console.error('Erro ao buscar metas:', error);
        return null;
      }

      return data || null;
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      return null;
    }
  },
  
  setGoals: async (goals: ServiceGoal[]) => {
    try {
      console.log('Salvando metas:', goals);
      const { error } = await supabase
        .from('goals')
        .upsert(goals);

      if (error) {
        console.error('Erro ao salvar metas:', error);
        throw error;
      }
      console.log('Metas salvas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar metas:', error);
      throw error;
    }
  }
};