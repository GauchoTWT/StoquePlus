import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle } from 'lucide-react';

export const StockChart = ({ products }) => {
  const chartData = products.map(product => ({
    name: product.name.length > 12 
      ? `${product.name.substring(0, 12)}...` 
      : product.name,
    Quantidade: product.quantity,
    'Mínimo': product.minStock,
    status: product.quantity <= product.minStock ? 'Crítico' : 'Normal'
  }));

  return (
    <div className="glass-effect rounded-xl p-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Níveis de Estoque</h3>
        {products.some(p => p.quantity <= p.minStock) && (
          <span className="flex items-center text-red-400 text-sm">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Itens em estado crítico
          </span>
        )}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
            />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                background: '#1e293b',
                borderColor: '#334155',
                borderRadius: '0.5rem'
              }}
              formatter={(value) => [`${value} unidades`, value === 'Mínimo' ? 'Estoque mínimo' : 'Quantidade atual']}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => value === 'Mínimo' ? 'Estoque mínimo' : 'Quantidade atual'}
            />
            <Bar 
              dataKey="Quantidade" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="Mínimo" 
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

StockChart.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      minStock: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      supplier: PropTypes.string.isRequired,
      area: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
      batch: PropTypes.string.isRequired,
      expirationDate: PropTypes.string,
      lastUpdated: PropTypes.string.isRequired
    })
  ).isRequired,
};