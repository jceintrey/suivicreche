import { Routes, Route, NavLink } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { StatsPage } from './pages/StatsPage';
import { ConfigPage } from './pages/ConfigPage';

export function App() {
  return (
    <div className="app">
      <nav className="app-nav">
        <NavLink to="/" end>Suivi</NavLink>
        <NavLink to="/stats">Stats</NavLink>
        <NavLink to="/config">Configuration</NavLink>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/config" element={<ConfigPage />} />
        </Routes>
      </main>
    </div>
  );
}
