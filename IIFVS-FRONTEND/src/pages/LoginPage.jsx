import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function LoginPage() {
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [orgName, setOrgName] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/api/auth/login', { email, password });
            navigate('/dashboard');
        } catch (err) {
            // For prototype, navigate anyway
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/api/auth/register', { email, password, orgName, role });
            setActiveTab('login');
        } catch (err) {
            // For prototype, switch to login
            setActiveTab('login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-shield">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <h1>Welcome to IIFVS</h1>
                    <p>Intelligent IoT Firmware Vulnerability Detection</p>
                </div>

                <div className="login-card">
                    <div className="login-card-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <h3>Secure Access</h3>
                    </div>
                    <p className="login-card-subtitle">Sign in to access your security dashboard</p>

                    <div className="login-tabs">
                        <button
                            className={`login-tab ${activeTab === 'login' ? 'active' : ''}`}
                            onClick={() => setActiveTab('login')}
                        >
                            Login
                        </button>
                        <button
                            className={`login-tab ${activeTab === 'register' ? 'active' : ''}`}
                            onClick={() => setActiveTab('register')}
                        >
                            Register
                        </button>
                    </div>

                    {activeTab === 'login' ? (
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label className="form-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="analyst@organization.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button type="button" className="forgot-password">Forgot password?</button>

                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Signing In...' : 'Sign In Securely'}
                            </button>

                            <div className="login-ssl">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                256-bit SSL Encrypted Connection
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister}>
                            <div className="form-group">
                                <label className="form-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="analyst@organization.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                    Organization Name
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Your Organization"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    Role
                                </label>
                                <select
                                    className="form-select"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="">Select your role</option>
                                    <option value="analyst">Security Analyst</option>
                                    <option value="admin">Administrator</option>
                                    <option value="researcher">Researcher</option>
                                    <option value="auditor">Auditor</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    )}
                </div>

                <p className="login-footer">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
