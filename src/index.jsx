import React from 'react';
  import ReactDOM from 'react-dom/client';
  // CORRIGIDO: Se a pasta for 'Pages' (maiúsculo)
  import Dashboard from '../Pages/Dashboard.jsx'; 

  // Cria o ponto de montagem (root) e renderiza a aplicação
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <Dashboard />
    </React.StrictMode>
  );