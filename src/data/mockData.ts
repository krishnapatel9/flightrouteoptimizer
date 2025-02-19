import { City, Flight } from '../types';

export const cities: City[] = [
  { id: 'nyc', name: 'New York', code: 'NYC' },
  { id: 'lax', name: 'Los Angeles', code: 'LAX' },
  { id: 'chi', name: 'Chicago', code: 'ORD' },
  { id: 'mia', name: 'Miami', code: 'MIA' },
  { id: 'sfo', name: 'San Francisco', code: 'SFO' },
];

export const flights: Flight[] = [
  { from: 'nyc', to: 'lax', cost: 350, duration: 360 },
  { from: 'lax', to: 'nyc', cost: 380, duration: 370 },
  { from: 'nyc', to: 'chi', cost: 180, duration: 150 },
  { from: 'chi', to: 'nyc', cost: 190, duration: 155 },
  { from: 'chi', to: 'lax', cost: 250, duration: 240 },
  { from: 'lax', to: 'chi', cost: 260, duration: 245 },
  { from: 'mia', to: 'nyc', cost: 220, duration: 180 },
  { from: 'nyc', to: 'mia', cost: 210, duration: 175 },
  { from: 'sfo', to: 'lax', cost: 150, duration: 90 },
  { from: 'lax', to: 'sfo', cost: 160, duration: 95 },
];