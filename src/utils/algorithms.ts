import { Flight } from '../types';

export function bellmanFord(
  flights: Flight[],
  cities: string[],
  start: string,
  end: string,
  criterion: 'cost' | 'duration'
): { distance: { [key: string]: number }, predecessor: { [key: string]: string | null } } {
  const distance: { [key: string]: number } = {};
  const predecessor: { [key: string]: string | null } = {};

  // Initialize distances
  cities.forEach(city => {
    distance[city] = Infinity;
    predecessor[city] = null;
  });
  distance[start] = 0;

  // Relax edges |V| - 1 times
  for (let i = 0; i < cities.length - 1; i++) {
    for (const flight of flights) {
      const weight = criterion === 'cost' ? flight.cost : flight.duration;
      if (distance[flight.from] + weight < distance[flight.to]) {
        distance[flight.to] = distance[flight.from] + weight;
        predecessor[flight.to] = flight.from;
      }
    }
  }

  // Check for negative cycles
  for (const flight of flights) {
    const weight = criterion === 'cost' ? flight.cost : flight.duration;
    if (distance[flight.from] + weight < distance[flight.to]) {
      throw new Error('Graph contains negative cycle');
    }
  }

  return { distance, predecessor };
}

export function floydWarshall(
  flights: Flight[],
  cities: string[],
  criterion: 'cost' | 'duration'
): { distances: number[][], next: (string | null)[][] } {
  const n = cities.length;
  const cityToIndex = new Map(cities.map((city, index) => [city, index]));
  
  // Initialize distance matrix
  const distances: number[][] = Array(n).fill(0).map(() => Array(n).fill(Infinity));
  const next: (string | null)[][] = Array(n).fill(0).map(() => Array(n).fill(null));
  
  // Set diagonal to 0
  for (let i = 0; i < n; i++) {
    distances[i][i] = 0;
  }
  
  // Fill initial distances
  for (const flight of flights) {
    const i = cityToIndex.get(flight.from)!;
    const j = cityToIndex.get(flight.to)!;
    const weight = criterion === 'cost' ? flight.cost : flight.duration;
    distances[i][j] = weight;
    next[i][j] = flight.to;
  }
  
  // Floyd-Warshall algorithm
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (distances[i][k] + distances[k][j] < distances[i][j]) {
          distances[i][j] = distances[i][k] + distances[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }
  
  return { distances, next };
}

export function reconstructPath(
  start: string,
  end: string,
  predecessor: { [key: string]: string | null }
): string[] {
  const path: string[] = [];
  let current = end;
  
  while (current !== null) {
    path.unshift(current);
    current = predecessor[current];
  }
  
  if (path[0] !== start) {
    return [];
  }
  
  return path;
}