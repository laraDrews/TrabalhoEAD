import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function CardEstatistica({ 
  titulo, 
  valor, 
  variacao, 
  icone: Icone, 
  corIcone = 'bg-blue-500',
  formato = 'numero',
  delay = 0 
}) {
  const formatarValor = (val) => {
    if (formato === 'moeda') {
      return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(val);
    }
    if (formato === 'percentual') {
      return `${val?.toFixed(1)}%`;
    }
    if (formato === 'numero') {
      return new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(val);
    }
    return val;
  };

  const getTendencia = () => {
    if (!variacao || variacao === 0) return { icone: Minus, cor: 'text-slate-400', bg: 'bg-slate-100' };
    if (variacao > 0) return { icone: TrendingUp, cor: 'text-red-500', bg: 'bg-red-50' };
    return { icone: TrendingDown, cor: 'text-green-500', bg: 'bg-green-50' };
  };

  const tendencia = getTendencia();
  const IconeTendencia = tendencia.icone;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${corIcone}`}>
          <Icone className="w-5 h-5 text-white" />
        </div>
        {variacao !== undefined && variacao !== null && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${tendencia.bg}`}>
            <IconeTendencia className={`w-3.5 h-3.5 ${tendencia.cor}`} />
            <span className={`text-xs font-medium ${tendencia.cor}`}>
              {Math.abs(variacao).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <p className="text-sm text-slate-500 mb-1">{titulo}</p>
      <p className="text-2xl font-bold text-slate-800">{formatarValor(valor)}</p>
    </motion.div>
  );
}