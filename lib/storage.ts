export const storage = {
  getServices: () => {
    const services = localStorage.getItem('services');
    return services ? JSON.parse(services) : [];
  },
  
  setServices: (services: any[]) => {
    localStorage.setItem('services', JSON.stringify(services));
  },
  
  getGoals: () => {
    const goals = localStorage.getItem('goals');
    return goals ? JSON.parse(goals) : null;
  },
  
  setGoals: (goals: any[]) => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }
};