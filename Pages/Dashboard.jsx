import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  Fuel,
  Download,
  RefreshCw,
  User,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink
} from 'lucide-react';

// --- FIREBASE IMPORTS (Obrigatório para persistência de dados) ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';


// =================================================================
// 1. DEFINIÇÕES MÍNIMAS DOS COMPONENTES DE UI FALTANTES (Button, Tabs)
//    Isso resolve o erro de importação que você tinha: '@/components/ui/...'
// =================================================================

// Componente Básico de Botão (Substitui Button de Shadcn)
const Button = ({ children, className = '', onClick, variant, size, ...props }) => {
  let baseStyles = 'px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors duration-150 flex items-center justify-center';
  let variantStyles = 'bg-slate-800 text-white hover:bg-slate-700';

  if (variant === 'outline') {
    variantStyles = 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100';
  }

  const sizeStyles = size === 'sm' ? 'px-3 py-1.5' : '';

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Componentes Mínimos de Tabs (Substitui Tabs de Shadcn)
const TabsContext = createContext({});

const Tabs = ({ value, onValueChange, children }) => {
  return (
    <TabsContext.Provider value={{ activeTab: value, setActiveTab: onValueChange }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className = '' }) => (
  <div className={`flex p-1 bg-slate-100 rounded-lg ${className}`}>
    {children}
  </div>
);

const TabsTrigger = ({ value, children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;
  
  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
        isActive ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-800'
      }`}
    >
      {children}
    </button>
  );
};

// Componente para Mensagens Temporárias (Substitui alerts)
const MessageBar = ({ message }) => {
    if (!message) return null;

    const colorClasses = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    };
    const Icon = {
        success: CheckCircle,
        error: XCircle,
        info: Info,
        warning: AlertTriangle,
    }[message.type];

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-3 rounded-lg border-l-4 shadow-lg z-50 max-w-sm w-full ${colorClasses[message.type]}`}
        >
            <div className="flex items-center gap-2">
                {Icon && <Icon className="w-5 h-5" />}
                <p className="text-sm font-medium">{message.text}</p>
            </div>
        </motion.div>
    );
};


// =================================================================
// 2. DADOS SIMULADOS E COMPONENTES AUXILIARES (do seu código original)
// =================================================================

// Componente Auxiliar para formatar moeda
const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(valor);

// Componente Auxiliar para formatar score (com cor)
const ScoreBadge = ({ score }) => {
  let color = 'bg-green-500';
  if (score > 40) color = 'bg-orange-500';
  if (score > 60) color = 'bg-red-500';

  return (
    <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-full ${color}`}>
      {score.toFixed(1)}%
    </span>
  );
};

// Dados simulados baseados na análise (seu original)
const dadosSimulados = {
  regioes: {
    Norte: { score: 72.5, variacaoAnual: 38.2, volumeTotal: 4800000000, estadoPrincipal: 'Amazonas' },
    Nordeste: { score: 58.3, variacaoAnual: 31.5, volumeTotal: 3200000000, estadoPrincipal: 'Bahia' },
    'Centro-Oeste': { score: 41.2, variacaoAnual: 18.7, volumeTotal: 2100000000, estadoPrincipal: 'Mato Grosso' },
    Sudeste: { score: 35.8, variacaoAnual: 12.4, volumeTotal: 8500000000, estadoPrincipal: 'Rio de Janeiro' },
    Sul: { score: 28.6, variacaoAnual: 8.9, volumeTotal: 1900000000, estadoPrincipal: 'Paraná' }
  },
  tendencia: [
    { periodo: 'Jan/23', valor: 2800000000, anomalia: 28 }, { periodo: 'Fev/23', valor: 3100000000, anomalia: 31 },
    { periodo: 'Mar/23', valor: 2950000000, anomalia: 35 }, { periodo: 'Abr/23', valor: 3400000000, anomalia: 38 },
    { periodo: 'Mai/23', valor: 3200000000, anomalia: 42 }, { periodo: 'Jun/23', valor: 3600000000, anomalia: 45 },
    { periodo: 'Jul/23', valor: 3800000000, anomalia: 48 }, { periodo: 'Ago/23', valor: 4100000000, anomalia: 52 },
    { periodo: 'Set/23', valor: 4300000000, anomalia: 55 }, { periodo: 'Out/23', valor: 4500000000, anomalia: 58 },
    { periodo: 'Nov/23', valor: 4800000000, anomalia: 62 }, { periodo: 'Dez/23', valor: 5200000000, anomalia: 65 }
  ],
  resumo: {
    volumeTotal: 20500000000,
    anomaliasDetectadas: 2847,
    mediaScore: 47.3,
    variacaoGeral: 22.1
  }
};


// Simulação de componentes locais (apenas para evitar erros de importação)
const CardEstatistica = ({ titulo, valor, variacao, icone: Icon, corIcone, formato, delay }) => {
  const displayValue = formato === 'moeda' ? formatarMoeda(valor) : 
                       formato === 'percentual' ? `${valor.toFixed(1)}%` :
                       formato === 'numero' ? valor.toLocaleString('pt-BR') :
                       valor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6 rounded-2xl shadow-md border border-slate-100"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-medium text-slate-500">{titulo}</h3>
        <div className={`p-2 rounded-full text-white ${corIcone}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-slate-900">{displayValue}</p>
        {variacao && (
          <p className={`text-sm mt-1 flex items-center gap-1 ${variacao > 0 ? 'text-red-500' : 'text-green-500'}`}>
            <TrendingUp className="w-4 h-4" />
            {variacao > 0 ? `+${variacao.toFixed(1)}%` : `${variacao.toFixed(1)}%`}
            <span className="text-slate-400">vs ano anterior</span>
          </p>
        )}
      </div>
    </motion.div>
  );
};

// Placeholder para Mapa, Gráfico, Filtros, Ranking e Detalhes
const MapaBrasil = ({ dadosRegiao, onRegiaoClick, regiaoSelecionada }) => (
    <div className="bg-slate-50 p-6 flex flex-col items-center justify-center h-[400px]">
        <h4 className="text-lg font-semibold text-slate-600">
            [Mapa do Brasil Placeholder]
        </h4>
        <p className="text-sm text-slate-500 mt-2">
            Distribuição de Risco. Selecione uma região:
        </p>
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {Object.keys(dadosRegiao).map(regiao => (
                <button
                    key={regiao}
                    onClick={() => onRegiaoClick(regiao)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        regiao === regiaoSelecionada ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                >
                    {regiao} {regiaoSelecionada === regiao ? '✓' : ''}
                </button>
            ))}
        </div>
    </div>
);

const GraficoTendencia = ({ titulo, dados }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-[468px]">
        <h3 className="font-semibold text-slate-800 mb-4">{titulo}</h3>
        <p className="text-sm text-slate-500">
            [Gráfico de Linhas: Volume vs Anomalia - Requer biblioteca como Recharts/D3]
        </p>
        <div className="mt-8 text-center text-slate-300 text-6xl">
            📈
        </div>
        <div className="mt-4 text-sm text-slate-500">
            Último valor (Dez/23): {formatarMoeda(dados[dados.length - 1].valor)}
        </div>
    </div>
);

const FiltrosAnalise = ({ filtros, setFiltros, onAplicar }) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
        <label className="text-sm font-medium text-slate-700">Ano:</label>
        <select 
            value={filtros.ano} 
            onChange={(e) => setFiltros(f => ({ ...f, ano: parseInt(e.target.value) }))}
            className="border rounded-lg p-2 text-sm bg-slate-50"
        >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
        </select>

        <label className="text-sm font-medium text-slate-700">Setor:</label>
        <select 
            value={filtros.setor} 
            onChange={(e) => setFiltros(f => ({ ...f, setor: e.target.value }))}
            className="border rounded-lg p-2 text-sm bg-slate-50"
        >
            <option>Combustíveis</option>
            <option>Mineração</option>
            <option>Agronegócio</option>
        </select>

        <Button onClick={onAplicar} className="ml-auto">
            Aplicar Filtros
        </Button>
    </div>
);

const RankingRegioes = ({ regioes, onRegiaoClick }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" /> Ranking de Risco Regional
        </h3>
        <ul className="space-y-3">
            {regioes.map((reg, index) => (
                <li key={reg.nome} className="flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-slate-50 cursor-pointer" onClick={() => onRegiaoClick(reg.nome)}>
                    <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 flex items-center justify-center text-sm font-bold rounded-full ${index < 2 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                            {index + 1}
                        </span>
                        <span className="font-medium text-slate-800">{reg.nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ScoreBadge score={reg.score} />
                        <span className="text-xs text-red-500 font-medium">+{reg.variacaoAnual.toFixed(1)}%</span>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

const DetalhesRegiao = ({ regiao, dados, onClose }) => (
    <motion.div 
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-blue-200 p-6 origin-top"
    >
        <div className="flex justify-between items-start border-b pb-3 mb-4">
            <h3 className="text-xl font-bold text-blue-800">
                Detalhes da Região: {regiao}
            </h3>
            <Button variant="outline" size="sm" onClick={onClose}>
                Fechar
            </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <p className="text-sm text-slate-500">Estado de Maior Risco:</p>
                <p className="text-lg font-semibold text-slate-900">{dados.estadoPrincipal}</p>
            </div>
            <div>
                <p className="text-sm text-slate-500">Volume Total de Fluxos:</p>
                <p className="text-lg font-semibold text-slate-900">{formatarMoeda(dados.volumeTotal)}</p>
            </div>
            <div>
                <p className="text-sm text-slate-500">Score de Risco Atual:</p>
                <ScoreBadge score={dados.score} />
            </div>
            <div>
                <p className="text-sm text-slate-500">Variação Anual:</p>
                <p className="text-lg font-semibold text-red-500">+{dados.variacaoAnual.toFixed(1)}%</p>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100">
             <a href="#" className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1">
                 Ver Relatório Detalhado de {regiao} <ExternalLink className="w-4 h-4" />
             </a>
        </div>
    </motion.div>
);


// =================================================================
// 3. COMPONENTE PRINCIPAL (DASHBOARD) - Corrigido e com Firebase
// =================================================================

export default function Dashboard() { 
  // Estados do Componente
  const [regiaoSelecionada, setRegiaoSelecionada] = useState(null);
  const [filtros, setFiltros] = useState({ 
    ano: 2024, 
    setor: 'Combustíveis', 
    regiao: 'Todas' 
  });
  const [carregando, setCarregando] = useState(false);
  const [visualizacao, setVisualizacao] = useState('mapa');
  const [message, setMessage] = useState(null); // Mensagem de notificação (substitui alert)

  // Estados do Firebase
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Lógica de cálculo (permanece a mesma)
  const rankingRegioes = Object.entries(dadosSimulados.regioes)
    .map(([nome, dados]) => ({ nome, ...dados }))
    .sort((a, b) => b.variacaoAnual - a.variacaoAnual);

  // ----------------------------------------------------------------
  // FUNÇÕES DE PERSISTÊNCIA (FIREBASE/FIRESTORE)
  // ----------------------------------------------------------------

  // 1. Inicialização e Autenticação do Firebase
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
        if (!Object.keys(firebaseConfig).length) {
          console.error("Firebase config not found. Using local data only.");
          setIsAuthReady(true); // Permite que a UI carregue mesmo sem DB
          return;
        }

        const app = initializeApp(firebaseConfig);
        const authInstance = getAuth(app);
        const dbInstance = getFirestore(app);
        
        setDb(dbInstance);

        const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

        onAuthStateChanged(authInstance, (user) => {
          let currentUserId;
          if (user) {
            currentUserId = user.uid;
            console.log("Authenticated user ID:", user.uid);
          } else {
            console.warn("User not authenticated. Attempting anonymous sign-in...");
            // Use signInAnonymously if token is missing
            signInAnonymously(authInstance).then(anonUser => {
              currentUserId = anonUser.user.uid;
              setUserId(currentUserId);
              console.log("Signed in anonymously. User ID:", currentUserId);
            }).catch(e => {
              console.error("Anonymous sign-in failed:", e);
              currentUserId = crypto.randomUUID();
              setUserId(currentUserId);
            });
          }
          if (user) setUserId(user.uid);
          setIsAuthReady(true);
        });

        if (token) {
          await signInWithCustomToken(authInstance, token);
        }

      } catch (error) {
        console.error("Error initializing Firebase:", error);
        setIsAuthReady(true);
      }
    };

    initializeFirebase();
  }, []);

  // 2. Carregar Filtros do Usuário (Private Data)
  useEffect(() => {
    if (!isAuthReady || !userId || !db) return;

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const filterPath = `/artifacts/${appId}/users/${userId}/dashboard_filters/current`;
    const docRef = doc(db, filterPath);

    // Usa onSnapshot para escutar mudanças em tempo real e carregar o estado inicial
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const loadedFilters = docSnap.data().filters;
        setFiltros(loadedFilters);
        setMessage({ type: 'success', text: 'Filtros carregados com sucesso!' });
      }
    }, (error) => {
      console.error("Error fetching filters:", error);
    });

    return () => unsubscribe();
  }, [isAuthReady, userId, db]);


  // ----------------------------------------------------------------
  // HANDLERS (Corrigidos para usar mensagens e Firestore)
  // ----------------------------------------------------------------

  const handleRegiaoClick = (regiao) => {
    setRegiaoSelecionada(regiao === regiaoSelecionada ? null : regiao);
  };

  const handleAplicarFiltros = () => {
    setCarregando(true);

    // 3. Salvar filtros no Firestore quando aplicados
    if (db && userId) {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const filterPath = `/artifacts/${appId}/users/${userId}/dashboard_filters/current`;
      const docRef = doc(db, filterPath);
      
      setDoc(docRef, { filters: filtros, timestamp: new Date() })
        .then(() => {
          setMessage({ type: 'success', text: 'Filtros aplicados e salvos na nuvem!' });
        })
        .catch((error) => {
          console.error("Error saving filters:", error);
          setMessage({ type: 'error', text: 'Erro ao salvar filtros no Firestore.' });
        })
        .finally(() => {
          setTimeout(() => setCarregando(false), 800);
          setTimeout(() => setMessage(null), 3000);
        });
    } else {
       // Apenas simula o carregamento se o DB não estiver pronto
       setTimeout(() => setCarregando(false), 800);
       setMessage({ type: 'info', text: 'Filtros aplicados localmente.' });
       setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleExportarRelatorio = () => {
    // Simulação de exportação (usando MessageBar)
    setMessage({ type: 'info', text: 'Processando exportação do relatório...' });
    setTimeout(() => {
        setMessage({ type: 'success', text: 'Relatório exportado com sucesso!' });
        setTimeout(() => setMessage(null), 3000);
    }, 1500);
  };
  
  // ----------------------------------------------------------------
  // JSX
  // ----------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-inter">
      {/* Barra de Mensagens */}
      <MessageBar message={message} />
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Análise de Fluxos Cambiais
                </h1>
                <p className="text-sm text-slate-500">
                  Monitoramento de Riscos de Evasão de Divisas
                </p>
              </div>
            </div>
            
            {/* User ID e Ações */}
            <div className="flex items-center gap-3">
                {userId && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <User className="w-4 h-4" />
                        <span className="truncate max-w-[150px] sm:max-w-full" title={userId}>
                            {userId}
                        </span>
                    </div>
                )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAplicarFiltros}
                className="gap-2"
                disabled={carregando}
              >
                <RefreshCw className={`w-4 h-4 ${carregando ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button 
                size="sm"
                onClick={handleExportarRelatorio}
                className="gap-2 bg-slate-800 hover:bg-slate-900"
              >
                <Download className="w-4 h-4" />
                Exportar Relatório
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Filtros */}
        <FiltrosAnalise 
          filtros={filtros} 
          setFiltros={setFiltros} 
          onAplicar={handleAplicarFiltros}
        />

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardEstatistica
            titulo="Volume Total Analisado"
            valor={dadosSimulados.resumo.volumeTotal}
            variacao={12.5}
            icone={DollarSign}
            corIcone="bg-blue-500"
            formato="moeda"
            delay={0}
          />
          <CardEstatistica
            titulo="Anomalias Detectadas"
            valor={dadosSimulados.resumo.anomaliasDetectadas}
            variacao={dadosSimulados.resumo.variacaoGeral}
            icone={AlertTriangle}
            corIcone="bg-red-500"
            formato="numero"
            delay={0.1}
          />
          <CardEstatistica
            titulo="Score Médio de Risco"
            valor={dadosSimulados.resumo.mediaScore}
            variacao={8.3}
            icone={Activity}
            corIcone="bg-orange-500"
            formato="percentual"
            delay={0.2}
          />
          <CardEstatistica
            titulo="Setor Analisado"
            valor={filtros.setor}
            icone={Fuel}
            corIcone="bg-purple-500"
            formato="texto"
            delay={0.3}
          />
        </div>

        {/* Seção Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mapa e Gráfico */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs de visualização */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <Tabs value={visualizacao} onValueChange={setVisualizacao}>
                <TabsList className="bg-slate-100">
                  <TabsTrigger value="mapa">Mapa de Risco</TabsTrigger>
                  <TabsTrigger value="tendencia">Tendência Histórica</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {visualizacao === 'mapa' ? (
              <motion.div
                key="mapa"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">
                    Distribuição Geográfica de Riscos - Setor {filtros.setor}
                  </h3>
                  <p className="text-sm text-slate-500">Clique em uma região para ver detalhes</p>
                </div>
                <MapaBrasil
                  dadosRegiao={dadosSimulados.regioes}
                  onRegiaoClick={handleRegiaoClick}
                  regiaoSelecionada={regiaoSelecionada}
                />
              </motion.div>
            ) : (
              <GraficoTendencia
                key="grafico"
                dados={dadosSimulados.tendencia}
                titulo={`Tendência Histórica - ${filtros.setor} (${filtros.ano})`}
              />
            )}

            {/* Detalhes da Região selecionada */}
            {regiaoSelecionada && (
              <DetalhesRegiao
                regiao={regiaoSelecionada}
                dados={dadosSimulados.regioes[regiaoSelecionada]}
                onClose={() => setRegiaoSelecionada(null)}
              />
            )}
          </div>

          {/* Ranking lateral */}
          <div>
            <RankingRegioes 
              regioes={rankingRegioes} 
              onRegiaoClick={handleRegiaoClick}
            />

            {/* Alerta principal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Alerta de Risco Crítico</h4>
                  <p className="text-red-100 text-sm mb-3">
                    A região Norte apresenta o maior índice de anomalias (72.5%) 
                    com aumento de 38.2% em relação ao ano anterior.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      Amazonas lidera com 38.2%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Info ML */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-4 bg-slate-800 rounded-2xl p-5 text-white"
            >
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Modelo de Machine Learning
              </h4>
              <p className="text-slate-300 text-sm mb-3">
                Utilizando Random Forest e Isolation Forest para detecção de anomalias
                em fluxos cambiais.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-700 rounded-lg p-2">
                  <p className="text-slate-400">Precisão</p>
                  <p className="font-bold text-green-400">94.7%</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-2">
                  <p className="text-slate-400">Recall</p>
                  <p className="font-bold text-blue-400">91.2%</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              Dados agregados de Comércio Exterior e Séries Históricas de Fluxos Cambiais
            </p>
            <p className="text-xs text-slate-400">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}