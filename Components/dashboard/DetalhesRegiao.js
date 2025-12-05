import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, TrendingUp, DollarSign, AlertTriangle, Building2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function DetalhesRegiao({ regiao, dados, onClose }) {
  if (!regiao || !dados) return null;

  const estadosData = [
    { estado: 'AM', anomalias: 38.2, volume: 2500000000 },
    { estado: 'PA', anomalias: 29.7, volume: 1800000000 },
    { estado: 'BA', anomalias: 31.5, volume: 2100000000 },
    { estado: 'RJ', anomalias: 22.3, volume: 4500000000 },
    { estado: 'SP', anomalias: 18.5, volume: 5200000000 },
  ];

  const filteredEstados = estadosData.filter(e => {
    const mapa = {
      Norte: ['AM', 'PA'],
      Nordeste: ['BA'],
      Sudeste: ['RJ', 'SP'],
      Sul: ['RS', 'PR'],
      'Centro-Oeste': ['MT', 'GO']
    };
    return mapa[regiao]?.includes(e.estado) || true;
  }).slice(0, 4);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-700 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{regiao}</h3>
                <p className="text-slate-300 text-sm">Análise detalhada de anomalias</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-slate-300">Score Anomalia</span>
              </div>
              <p className="text-2xl font-bold">{dados.score?.toFixed(1)}%</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-slate-300">Variação Anual</span>
              </div>
              <p className="text-2xl font-bold">+{dados.variacaoAnual?.toFixed(1)}%</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-xs text-slate-300">Volume Total</span>
              </div>
              <p className="text-2xl font-bold">
                ${(dados.volumeTotal / 1000000000).toFixed(1)}B
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Estados principais */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Estados com Maior Risco
            </h4>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredEstados} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="estado" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    width={40}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.length) {
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border">
                            <p className="font-semibold">{payload[0].payload.estado}</p>
                            <p className="text-sm text-red-600">
                              Anomalias: {payload[0].value?.toFixed(1)}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="anomalias" 
                    fill="#ef4444" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Indicadores */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Indicadores de Risco
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Operações Suspeitas', valor: 156, variacao: 23 },
                { label: 'Valor Médio Anômalo', valor: '$2.3M', variacao: 18 },
                { label: 'Frequência Mensal', valor: 12, variacao: 45 }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{item.valor}</span>
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                      +{item.variacao}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}