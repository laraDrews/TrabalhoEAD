import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { 
  LayoutDashboard, 
  FileText, 
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Layout({ children, currentPageName }) {
  const [menuAberto, setMenuAberto] = React.useState(false);

  const navegacao = [
    { nome: 'Dashboard', pagina: 'Dashboard', icone: LayoutDashboard },
    { nome: 'Relatório', pagina: 'Relatorio', icone: FileText }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra lateral móvel */}
      <div className={`fixed inset-0 z-50 lg:hidden ${menuAberto ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-slate-900/50" onClick={() => setMenuAberto(false)} />
        <div className="fixed left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-800">Fiscal Monitor</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMenuAberto(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-1">
            {navegacao.map((item) => (
              <Link
                key={item.pagina}
                to={createPageUrl(item.pagina)}
                onClick={() => setMenuAberto(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  currentPageName === item.pagina
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icone className="w-5 h-5" />
                {item.nome}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Botão do menu móvel */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-40 lg:hidden bg-white shadow-lg"
        onClick={() => setMenuAberto(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Barra lateral desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-slate-200">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg shadow-red-500/20">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800">Fiscal Monitor</h1>
              <p className="text-xs text-slate-500">Análise de Riscos</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navegacao.map((item) => (
            <Link
              key={item.pagina}
              to={createPageUrl(item.pagina)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentPageName === item.pagina
                  ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <item.icone className="w-5 h-5" />
              {item.nome}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 text-white">
            <p className="text-xs text-slate-300 mb-1">Modelo ML</p>
            <p className="font-semibold text-sm">Random Forest</p>
            <p className="text-xs text-green-400 mt-1">● Ativo - 94.7% precisão</p>
          </div>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="lg:pl-64">
        {children}
      </main>
    </div>
  );
}