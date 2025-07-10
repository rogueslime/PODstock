import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InventoryView from './components/InventoryView';
import LoginPortal from './components/LoginPortal';
import axios from 'axios';

axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: '1rem' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Inventory View</Link>>
          <Link to="/loginportal/">Login Portal</Link>
        </nav>

        <Routes>
          <Route path="/" element={<InventoryView />} />
          <Route path="/loginportal" element = {<LoginPortal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;