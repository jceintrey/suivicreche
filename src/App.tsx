import { Routes, Route, NavLink } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { ConfigPage } from './pages/ConfigPage';

export function App() {
  return (
    <div className="app">
      <nav className="app-nav">
        <NavLink to="/" end>Suivi</NavLink>
        <NavLink to="/config">Configuration</NavLink>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/config" element={<ConfigPage />} />
        </Routes>
      </main>
    </div>
  );
}
