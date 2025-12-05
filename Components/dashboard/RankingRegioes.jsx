import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, MapPin } from 'lucide-react';

export default function RankingRegioes({ regioes, onRegiaoClick }) {
  const getMedalha = (posicao) => {
    const cores = ['bg-amber-400', 'bg-slate-300', 'bg-amber-600'];
    const emojis = ['🥇', '🥈', '🥉'];
    return { cor: cores[posicao] || 'bg-slate-200', emoji: emojis[posicao] || `${posicao + 1}º` };
  };

  const getNivelRisco = (score) => {
    if (score >= 70) return { label: 'Crítico', cor: 'bg-red-100 text-red-700 border-red-200' };
    if (score >= 50) return { label: 'Alto', cor: 'bg-orange-100 text-orange-700 border-orange-200' };
    if (score >= 30) return { label: 'Médio', cor: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    return { label: 'Baixo', cor: 'bg-green-100 text-green-700 border-green-200' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
    >
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Ranking de Risco</h3>
            <p className="text-sm text-slate-500">Regiões com maior aumento de anomalias</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {regioes.slice(0, 5).map((regiao, index) => {
          const medalha = getMedalha(index);
          const nivel = getNivelRisco(regiao.score);
          const isTop3 = index < 3;

          return (
            <motion.div
              key={regiao.nome}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`p-4 hover:bg-slate-50 cursor-pointer transition-all duration-200 ${isTop3 ? 'bg-red-50/30' : ''}`}
              onClick={() => onRegiaoClick(regiao.nome)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full ${medalha.cor} flex items-center justify-center text-lg font-bold shadow-sm`}>
                  {medalha.emoji}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-800">{regiao.nome}</span>
                    <Badge className={`text-xs ${nivel.cor} border`}>
                      {nivel.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-500">
                      Principal estado: <span className="font-medium text-slate-700">{regiao.estadoPrincipal}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-lg font-bold">+{regiao.variacaoAnual?.toFixed(1)}%</span>
                  </div>
                  <p className="text-xs text-slate-500">vs ano anterior</p>
                </div>
              </div>

              {/* Barra de progresso do score */}
              <div className="mt-3 ml-14">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Score de Anomalia</span>
                  <span className="font-medium text-slate-700">{regiao.score?.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${regiao.score}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                    className={`h-full rounded-full ${
                      regiao.score >= 70 ? 'bg-red-500' :
                      regiao.score >= 50 ? 'bg-orange-500' :
                      regiao.score >= 30 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}