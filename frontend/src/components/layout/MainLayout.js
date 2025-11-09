import React from 'react';
import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen" style={{background: 'var(--bg)'}}>
      <Header />
      <main className="container">
        <div className="card shadow p-6" style={{borderRadius: '12px'}}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
