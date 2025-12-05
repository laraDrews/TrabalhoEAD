import React from 'react';
import { motion } from 'framer-motion';

const regiaoCoords = {
  Norte: { x: 180, y: 120, width: 200, height: 150 },
  Nordeste: { x: 380, y: 100, width: 120, height: 180 },
  'Centro-Oeste': { x: 220, y: 250, width: 140, height: 120 },
  Sudeste: { x: 320, y: 340, width: 100, height: 80 },
  Sul: { x: 280, y: 420, width: 80, height: 70 }
};

const estadosPorRegiao = {
  Norte: ['AM', 'PA', 'AC', 'RO', 'RR', 'AP', 'TO'],
  Nordeste: ['MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'],
  'Centro-Oeste': ['MT', 'MS', 'GO', 'DF'],
  Sudeste: ['SP', 'RJ', 'MG', 'ES'],
  Sul: ['PR', 'SC', 'RS']
};

export default function MapaBrasil({ dadosRegiao, onRegiaoClick, regiaoSelecionada }) {
  const getCorRisco = (score) => {
    if (score >= 70) return { fill: '#ef4444', stroke: '#dc2626', label: 'Crítico' };
    if (score >= 50) return { fill: '#f97316', stroke: '#ea580c', label: 'Alto' };
    if (score >= 30) return { fill: '#eab308', stroke: '#ca8a04', label: 'Médio' };
    return { fill: '#22c55e', stroke: '#16a34a', label: 'Baixo' };
  };

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <svg viewBox="0 0 500 520" className="w-full h-full">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.2" />
          </filter>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="500" height="520" fill="url(#bgGradient)" rx="12" />

        {/* Norte */}
        <motion.path
          d="M80,50 L280,30 L380,80 L350,180 L280,220 L180,240 L100,200 L60,140 Z"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          fill={getCorRisco(dadosRegiao?.Norte?.score || 0).fill}
          stroke={regiaoSelecionada === 'Norte' ? '#1e293b' : getCorRisco(dadosRegiao?.Norte?.score || 0).stroke}
          strokeWidth={regiaoSelecionada === 'Norte' ? 3 : 1.5}
          filter="url(#shadow)"
          className="cursor-pointer transition-all duration-300 hover:brightness-110"
          onClick={() => onRegiaoClick('Norte')}
        />

        {/* Nordeste */}
        <motion.path
          d="M380,80 L480,100 L490,200 L450,280 L380,300 L340,260 L350,180 Z"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          fill={getCorRisco(dadosRegiao?.Nordeste?.score || 0).fill}
          stroke={regiaoSelecionada === 'Nordeste' ? '#1e293b' : getCorRisco(dadosRegiao?.Nordeste?.score || 0).stroke}
          strokeWidth={regiaoSelecionada === 'Nordeste' ? 3 : 1.5}
          filter="url(#shadow)"
          className="cursor-pointer transition-all duration-300 hover:brightness-110"
          onClick={() => onRegiaoClick('Nordeste')}
        />

        {/* Centro-Oeste */}
        <motion.path
          d="M180,240 L280,220 L340,260 L360,340 L320,400 L240,410 L180,360 L160,300 Z"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          fill={getCorRisco(dadosRegiao?.['Centro-Oeste']?.score || 0).fill}
          stroke={regiaoSelecionada === 'Centro-Oeste' ? '#1e293b' : getCorRisco(dadosRegiao?.['Centro-Oeste']?.score || 0).stroke}
          strokeWidth={regiaoSelecionada === 'Centro-Oeste' ? 3 : 1.5}
          filter="url(#shadow)"
          className="cursor-pointer transition-all duration-300 hover:brightness-110"
          onClick={() => onRegiaoClick('Centro-Oeste')}
        />

        {/* Sudeste */}
        <motion.path
          d="M340,260 L380,300 L420,340 L400,400 L340,420 L320,400 L360,340 Z"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          fill={getCorRisco(dadosRegiao?.Sudeste?.score || 0).fill}
          stroke={regiaoSelecionada === 'Sudeste' ? '#1e293b' : getCorRisco(dadosRegiao?.Sudeste?.score || 0).stroke}
          strokeWidth={regiaoSelecionada === 'Sudeste' ? 3 : 1.5}
          filter="url(#shadow)"
          className="cursor-pointer transition-all duration-300 hover:brightness-110"
          onClick={() => onRegiaoClick('Sudeste')}
        />

        {/* Sul */}
        <motion.path
          d="M240,410 L320,400 L340,420 L360,480 L300,500 L240,490 L220,450 Z"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          fill={getCorRisco(dadosRegiao?.Sul?.score || 0).fill}
          stroke={regiaoSelecionada === 'Sul' ? '#1e293b' : getCorRisco(dadosRegiao?.Sul?.score || 0).stroke}
          strokeWidth={regiaoSelecionada === 'Sul' ? 3 : 1.5}
          filter="url(#shadow)"
          className="cursor-pointer transition-all duration-300 hover:brightness-110"
          onClick={() => onRegiaoClick('Sul')}
        />

        {/* Labels */}
        {Object.entries(regiaoCoords).map(([regiao, coords]) => (
          <g key={regiao}>
            <text
              x={coords.x}
              y={coords.y}
              fill="#1e293b"
              fontSize="11"
              fontWeight="600"
              textAnchor="middle"
              className="pointer-events-none"
            >
              {regiao}
            </text>
            {dadosRegiao?.[regiao] && (
              <text
                x={coords.x}
                y={coords.y + 14}
                fill="#475569"
                fontSize="9"
                textAnchor="middle"
                className="pointer-events-none"
              >
                {dadosRegiao[regiao].score?.toFixed(1)}% risco
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Legenda */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-slate-200">
        <p className="text-xs font-semibold text-slate-700 mb-2">Nível de Risco</p>
        <div className="space-y-1.5">
          {[
            { cor: '#ef4444', label: 'Crítico (≥70%)' },
            { cor: '#f97316', label: 'Alto (50-69%)' },
            { cor: '#eab308', label: 'Médio (30-49%)' },
            { cor: '#22c55e', label: 'Baixo (<30%)' }
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: item.cor }} />
              <span className="text-xs text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}