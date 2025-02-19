import React, { useState, useMemo } from 'react';
import { Plane, Clock, DollarSign } from 'lucide-react';
import { cities, flights } from './data/mockData';
import { bellmanFord, reconstructPath } from './utils/algorithms';
import type { Route } from './types';

function App() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [criterion, setCriterion] = useState<'cost' | 'duration'>('cost');

  const route: Route | null = useMemo(() => {
    if (!from || !to) return null;

    try {
      const cityIds = cities.map(city => city.id);
      const { distance, predecessor } = bellmanFord(flights, cityIds, from, to, criterion);
      const path = reconstructPath(from, to, predecessor);
      
      if (path.length === 0) return null;

      return {
        path,
        totalCost: criterion === 'cost' ? distance[to] : 
          path.reduce((total, city, i) => {
            if (i === 0) return total;
            const flight = flights.find(f => f.from === path[i-1] && f.to === city);
            return total + (flight?.cost || 0);
          }, 0),
        totalDuration: criterion === 'duration' ? distance[to] :
          path.reduce((total, city, i) => {
            if (i === 0) return total;
            const flight = flights.find(f => f.from === path[i-1] && f.to === city);
            return total + (flight?.duration || 0);
          }, 0)
      };
    } catch (error) {
      console.error('Error calculating route:', error);
      return null;
    }
  }, [from, to, criterion]);

  const getCityName = (id: string) => cities.find(city => city.id === id)?.name || id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
            <div className="flex items-center mb-6">
              <Plane className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Flight Route Optimizer</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select departure city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} ({city.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select destination city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} ({city.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Optimize for</label>
                <select
                  value={criterion}
                  onChange={(e) => setCriterion(e.target.value as 'cost' | 'duration')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="cost">Lowest Cost</option>
                  <option value="duration">Shortest Duration</option>
                </select>
              </div>
            </div>

            {route && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Optimal Route</h2>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-600">Total Cost:</span>
                    <span className="ml-2 font-semibold">${route.totalCost}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-gray-600">Total Duration:</span>
                    <span className="ml-2 font-semibold">
                      {Math.floor(route.totalDuration / 60)}h {route.totalDuration % 60}m
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute top-4 left-4 bottom-4 w-0.5 bg-indigo-200"></div>
                  <div className="space-y-4 pl-8">
                    {route.path.map((cityId, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-indigo-600"></div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <span className="font-medium">{getCityName(cityId)}</span>
                          {index < route.path.length - 1 && (
                            <div className="text-sm text-gray-500 mt-1">
                              {(() => {
                                const nextCity = route.path[index + 1];
                                const flight = flights.find(f => f.from === cityId && f.to === nextCity);
                                return flight ? (
                                  <>
                                    <span className="mr-3">Cost: ${flight.cost}</span>
                                    <span>Duration: {Math.floor(flight.duration / 60)}h {flight.duration % 60}m</span>
                                  </>
                                ) : null;
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!route && from && to && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                No valid route found between the selected cities.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;