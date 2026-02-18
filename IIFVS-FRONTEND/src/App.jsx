import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DeviceManagementPage from './pages/DeviceManagementPage';
import SBOMAnalysisPage from './pages/SBOMAnalysisPage';
import FirmwareUploadPage from './pages/FirmwareUploadPage';

function AppLayout({ children }) {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
                <Route path="/devices" element={<AppLayout><DeviceManagementPage /></AppLayout>} />
                <Route path="/sbom" element={<AppLayout><SBOMAnalysisPage /></AppLayout>} />
                <Route path="/vulnerabilities" element={<AppLayout><FirmwareUploadPage /></AppLayout>} />
                <Route path="/firmware" element={<AppLayout><FirmwareUploadPage /></AppLayout>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
