
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CapsulePage from './pages/CapsulePage';
import Header from './components/Header';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-cosmic-bg bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] font-sans">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-[url('https://picsum.photos/1200/800?grayscale&blur=10')] bg-cover bg-center opacity-10"></div>
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/capsule/:id" element={<CapsulePage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
