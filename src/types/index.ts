export interface Flight {
  from: string;
  to: string;
  cost: number;
  duration: number; // in minutes
}

export interface City {
  id: string;
  name: string;
  code: string;
}

export interface Route {
  path: string[];
  totalCost: number;
  totalDuration: number;
}