import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProvider from './contexts/UserContext';
import { VillaProvider } from './contexts/VillaContext';
import CustomerLayout from './pages/CustomerLayout';
import AdminLayout from './pages/AdminLayout';
import ScrollToTop from './components/wrapper/ScrollToTop';
import './index.css';

function App() {
    return (
        <UserProvider>
            <VillaProvider>
                <Router>
                    <Routes>
                        {/* Customer routes */}
                        <Route path="/*" element={<CustomerLayout />} />
                        {/* Admin routes */}
                        <Route path="/admin/*" element={<AdminLayout />} />
                    </Routes>
                    <ScrollToTop />
                </Router>
            </VillaProvider>
        </UserProvider>
    );
}

export default App;
