import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Printer,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Calendar,
  CheckCircle,
  Activity,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const dadosRelatorio = {
  dataGeracao: new Date().toLocaleDateString('pt-BR'),
  periodo: '2023',
  setor: 'Combustíveis',
  top3Regioes: [
    {
      posicao: 1,
      regiao: 'Norte',
      estado: 'Amazonas',
      aumento: 38.2,
      score: 72.5,
      volumeAnomalo: 1840000000,
      operacoesDetectadas: 847,
      principais: ['Exportação de petróleo', 'Movimentações atípicas', 'Subfaturamento']
    },
    {
      posicao: 2,
      regiao: 'Nordeste',
      estado: 'Bahia',
      aumento: 31.5,
      score: 58.3,
      volumeAnomalo: 1250000000,
      operacoesDetectadas: 623,
      principais: ['Importação de derivados', 'Triangulação comercial', 'Valores incompatíveis']
    },
    {
      posicao: 3,
      regiao: 'Norte',
      estado: 'Pará',
      aumento: 29.7,
      score: 54.8,
      volumeAnomalo: 980000000,
      operacoesDetectadas: 412,
      principais: ['Transações suspeitas', 'Padrões irregulares', 'Volume atípico']
    }
  ],
  comparativo: [
    { regiao: 'Amazonas', atual: 38.2, anterior: 27.6 },
    { regiao: 'Bahia', atual: 31.5, anterior: 23.9 },
    { regiao: 'Pará', atual: 29.7, anterior: 22.9 },
    { regiao: 'Rio de Janeiro', atual: 22.3, anterior: 19.8 },
    { regiao: 'São Paulo', atual: 18.5, anterior: 16.1 }
  ]
};

export default function Relatorio() {
  const [imprimindo, setImprimindo] = useState(false);
  const relatorioRef = useRef(null);

  const handleImprimir = () => {
    window.print();
  };

  const getMedalhaEmoji = (posicao) => {
    const emojis = ['🥇', '🥈', '🥉'];
    return emojis[posicao - 1] || `${posicao}º`;
  };

  const getNivelRisco = (score) => {
    if (score >= 70) return { label: 'CRÍTICO', cor: 'bg-red-500 text-white' };
    if (score >= 50) return { label: 'ALTO', cor: 'bg-orange-500 text-white' };
    if (score >= 30) return { label: 'MÉDIO', cor: 'bg-yellow-500 text-black' };
    return { label: 'BAIXO', cor: 'bg-green-500 text-white' };
  };

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">
      {/* Header com ações */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-xl">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Relatório de Análise</h1>
                <p className="text-sm text-slate-500">Ranking das Regiões Críticas</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleImprimir}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
              <Button size="sm" className="bg-slate-800 hover:bg-slate-900">
                <Download className="w-4 h-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo do Relatório */}
      <main ref={relatorioRef} className="max-w-5xl mx-auto px-4 py-8 print:py-4">
        {/* Cabeçalho do Relatório */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 print:shadow-none print:border-2"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-semibold">RELATÓRIO CONFIDENCIAL</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Análise de Tendências e Anomalias
            </h1>
            <h2 className="text-xl text-slate-600 mb-4">
              Fluxos Cambiais - Setor de {dadosRelatorio.setor}
            </h2>
            <div className="flex justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Período: {dadosRelatorio.periodo}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                Gerado em: {dadosRelatorio.dataGeracao}
              </span>
            </div>
          </div>

          {/* Sumário Executivo */}
          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Sumário Executivo
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Esta análise identificou padrões significativos de anomalias nos fluxos cambiais 
              do setor de combustíveis no Brasil. Utilizando modelos de Machine Learning 
              (Random Forest e Isolation Forest), foram detectadas <strong>2.847 operações suspeitas</strong> com 
              potencial risco de evasão de divisas. A região <strong>Norte</strong> apresenta o 
              maior índice de anomalias, com destaque para o estado do <strong>Amazonas</strong>.
            </p>
          </div>

          {/* Métricas gerais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Volume Analisado', valor: '$20.5B', icone: BarChart3 },
              { label: 'Anomalias Detectadas', valor: '2.847', icone: AlertTriangle },
              { label: 'Score Médio', valor: '47.3%', icone: Activity },
              { label: 'Variação Anual', valor: '+22.1%', icone: TrendingUp }
            ].map((metrica, i) => (
              <div key={i} className="bg-slate-100 rounded-xl p-4 text-center">
                <metrica.icone className="w-5 h-5 mx-auto mb-2 text-slate-500" />
                <p className="text-2xl font-bold text-slate-800">{metrica.valor}</p>
                <p className="text-xs text-slate-500">{metrica.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ranking TOP 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 print:shadow-none print:border-2"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Top 3 Regiões com Maior Aumento de Anomalias
              </h3>
              <p className="text-sm text-slate-500">
                Ranking baseado na variação percentual de anomalias no último ano
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {dadosRelatorio.top3Regioes.map((item, index) => {
              const nivel = getNivelRisco(item.score);
              return (
                <motion.div
                  key={item.estado}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`border-2 rounded-2xl overflow-hidden ${
                    index === 0 ? 'border-red-500 bg-red-50/30' : 
                    index === 1 ? 'border-orange-400 bg-orange-50/30' : 
                    'border-yellow-400 bg-yellow-50/30'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{getMedalhaEmoji(item.posicao)}</span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-lg font-bold text-slate-800">
                              {item.estado}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500">{item.regiao}</span>
                          </div>
                          <Badge className={nivel.cor}>{nivel.label}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-red-600">+{item.aumento}%</p>
                        <p className="text-sm text-slate-500">aumento anual</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Score de Anomalia</p>
                        <p className="text-xl font-bold text-slate-800">{item.score}%</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Volume Anômalo</p>
                        <p className="text-xl font-bold text-slate-800">
                          ${(item.volumeAnomalo / 1000000000).toFixed(2)}B
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Operações Detectadas</p>
                        <p className="text-xl font-bold text-slate-800">{item.operacoesDetectadas}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Principais Indicadores:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.principais.map((principal, i) => (
                          <Badge key={i} variant="outline" className="bg-white">
                            {principal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Gráfico Comparativo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 print:shadow-none print:border-2"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Comparativo Anual - Taxa de Anomalias por Estado
          </h3>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosRelatorio.comparativo} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val) => `${val}%`}
                />
                <YAxis 
                  type="category" 
                  dataKey="regiao" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  width={100}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 rounded-lg shadow-lg border">
                          <p className="font-semibold">{data.regiao}</p>
                          <p className="text-sm text-blue-600">
                            Atual: {data.atual}%
                          </p>
                          <p className="text-sm text-slate-400">
                            Anterior: {data.anterior}%
                          </p>
                          <p className="text-sm text-green-600 font-medium">
                            Variação: +{(data.atual - data.anterior).toFixed(1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="anterior" fill="#cbd5e1" radius={[0, 4, 4, 0]} name="Ano Anterior" />
                <Bar dataKey="atual" fill="#ef4444" radius={[0, 4, 4, 0]} name="Ano Atual">
                  {dadosRelatorio.comparativo.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={index < 3 ? '#ef4444' : '#f97316'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Conclusões e Recomendações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 print:shadow-none print:border-2"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Conclusões e Recomendações
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <h4 className="font-bold text-red-800 mb-3">⚠️ Pontos Críticos</h4>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• Amazonas: Maior aumento percentual (38.2%)</li>
                <li>• Bahia: Crescimento significativo em derivados</li>
                <li>• Pará: Padrões irregulares em transações</li>
                <li>• Concentração de riscos na região Norte</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h4 className="font-bold text-green-800 mb-3">✅ Recomendações</h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Intensificar fiscalização no Amazonas</li>
                <li>• Monitorar exportações de petróleo no Norte</li>
                <li>• Auditar operações de importação na Bahia</li>
                <li>• Implementar alertas automáticos para anomalias</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-100 rounded-xl">
            <p className="text-sm text-slate-600 italic">
              💡 <strong>Nota:</strong> A análise manual não é escalável. Este projeto oferece uma 
              solução assertiva e de baixo custo para a fiscalização através de modelos de 
              Machine Learning com precisão de 94.7%.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}