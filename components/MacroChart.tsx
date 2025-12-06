import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { MacroNutrients } from '../types';

interface MacroChartProps {
  macros: MacroNutrients;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b']; // Blue (Protein), Green (Carbs), Orange (Fat)

const MacroChart: React.FC<MacroChartProps> = ({ macros }) => {
  const data = [
    { name: 'Protein', value: macros.protein },
    { name: 'Carbs', value: macros.carbs },
    { name: 'Fat', value: macros.fat },
  ];

  // If all values are 0, don't render an empty chart that might look broken
  if (data.every(d => d.value === 0)) {
    return <div className="text-gray-400 text-sm text-center py-4">No macro data available</div>;
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => `${value}g`}
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacroChart;
