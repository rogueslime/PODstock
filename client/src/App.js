import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ItemManager from './components/ItemManager';
import LocationManager from './components/LocationManager';
import LocationItemManager from './components/LocationItemManager';

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: '1rem' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Item Manager</Link>
          <Link to="/lm" style={{ marginRight: '1rem' }}>Location Manager</Link>
          <Link to="/lim">Location Inventory</Link>
        </nav>

        <Routes>
          <Route path="/" element={<ItemManager />} />
          <Route path="/lm" element={<LocationManager />} />
          <Route path="/lim" element={<LocationItemManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;