export type ServiceType =
  | 'Funilaria e Pintura'
  | 'Espelhamento de Pintura'
  | 'Higienização Interna'
  | 'Serviços de Aro de Roda'
  | 'DSP'
  | 'Mecânica'
  | 'Serviços de Farois'
  | 'Serviços Particulares'
  | 'Outros Serviços';

export interface Service {
  id: string;
  vehicle: string;
  license_plate: string;
  type: ServiceType;
  value: number;
  date: string;
}

export interface ServiceGoal {
  type: ServiceType;
  value: number;
}