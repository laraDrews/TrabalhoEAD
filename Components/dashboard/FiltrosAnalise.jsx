import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Calendar, Fuel, MapPin } from 'lucide-react';

export default function FiltrosAnalise({ filtros, setFiltros, onAplicar }) {
  const anos = [2024, 2023, 2022, 2021, 2020];
  const setores = ['Combustíveis', 'Mineração', 'Agronegócio', 'Manufatura', 'Serviços'];
  const regioes = ['Todas', 'Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
    >
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700">Filtros de Análise</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <Select
            value={filtros.ano?.toString()}
            onValueChange={(val) => setFiltros({ ...filtros, ano: parseInt(val) })}
          >
            <SelectTrigger className="w-[120px] h-9 text-sm">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {anos.map(ano => (
                <SelectItem key={ano} value={ano.toString()}>{ano}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Fuel className="w-4 h-4 text-slate-400" />
          <Select
            value={filtros.setor}
            onValueChange={(val) => setFiltros({ ...filtros, setor: val })}
          >
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Setor" />
            </SelectTrigger>
            <SelectContent>
              {setores.map(setor => (
                <SelectItem key={setor} value={setor}>{setor}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <Select
            value={filtros.regiao}
            onValueChange={(val) => setFiltros({ ...filtros, regiao: val })}
          >
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <SelectValue placeholder="Região" />
            </SelectTrigger>
            <SelectContent>
              {regioes.map(regiao => (
                <SelectItem key={regiao} value={regiao}>{regiao}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={onAplicar}
          size="sm"
          className="bg-slate-800 hover:bg-slate-900 text-white"
        >
          Aplicar Filtros
        </Button>
      </div>
    </motion.div>
  );
}