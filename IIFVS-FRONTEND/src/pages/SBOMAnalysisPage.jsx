import { useState } from 'react';
import StatCard from '../components/StatCard';

const softwareBOM = [
    { name: 'openssl', version: '1.1.1k', supplier: 'OpenSSL Software Foundation', license: 'Apache 2.0', cveCount: 8, severity: 'critical', color: 'teal' },
    { name: 'busybox', version: '1.33.0', supplier: 'BusyBox Contributors', license: 'GPL v2', cveCount: 5, severity: 'high', color: 'blue' },
    { name: 'libcurl', version: '7.76.1', supplier: 'curl Project', license: 'MIT', cveCount: 3, severity: 'high', color: 'red' },
    { name: 'dropbear', version: '2020.81', supplier: 'Matt Johnston', license: 'MIT', cveCount: 2, severity: 'medium', color: 'purple' },
    { name: 'mosquitto', version: '2.0.11', supplier: 'Eclipse IoT', license: 'EPL 2.0', cveCount: 1, severity: 'low', color: 'orange' },
    { name: 'lighttpd', version: '1.4.59', supplier: 'Jan Kneschke', license: 'BSD', cveCount: 4, severity: 'high', color: 'green' }
];

const hardwareBOM = [
    { name: 'ESP32-WROOM', version: 'Rev 1', supplier: 'Espressif Systems', license: 'N/A', cveCount: 2, severity: 'medium', color: 'teal' },
    { name: 'ATECC608A', version: 'B', supplier: 'Microchip', license: 'N/A', cveCount: 0, severity: 'low', color: 'blue' },
    { name: 'SX1276', version: '1.0', supplier: 'Semtech', license: 'N/A', cveCount: 1, severity: 'low', color: 'purple' }
];

function SBOMAnalysisPage() {
    const [activeTab, setActiveTab] = useState('software');
    const [searchTerm, setSearchTerm] = useState('');

    const currentData = activeTab === 'software' ? softwareBOM : hardwareBOM;
    const filteredData = currentData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCVEs = softwareBOM.reduce((sum, item) => sum + item.cveCount, 0) +
        hardwareBOM.reduce((sum, item) => sum + item.cveCount, 0);

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>SBOM & HBOM Analysis</h1>
                    <p>Software and Hardware Bill of Materials</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary">Export SBOM (SPDX)</button>
                    <button className="btn-outline">Export HBOM (JSON)</button>
                </div>
            </div>

            <div className="stat-cards">
                <StatCard
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                    }
                    value={softwareBOM.length.toString()}
                    label="Software Components"
                    colorClass="cyan"
                />
                <StatCard
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                            <rect x="9" y="9" width="6" height="6" />
                            <line x1="9" y1="1" x2="9" y2="4" />
                            <line x1="15" y1="1" x2="15" y2="4" />
                            <line x1="9" y1="20" x2="9" y2="23" />
                            <line x1="15" y1="20" x2="15" y2="23" />
                            <line x1="20" y1="9" x2="23" y2="9" />
                            <line x1="20" y1="14" x2="23" y2="14" />
                            <line x1="1" y1="9" x2="4" y2="9" />
                            <line x1="1" y1="14" x2="4" y2="14" />
                        </svg>
                    }
                    value={hardwareBOM.length.toString()}
                    label="Hardware Components"
                    colorClass="green"
                />
                <StatCard
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    }
                    value={totalCVEs.toString()}
                    label="Total CVEs Found"
                    colorClass="yellow"
                />
                <StatCard
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                        </svg>
                    }
                    value="12"
                    label="Updates Available"
                    colorClass="red"
                />
            </div>

            <div className="data-table-container">
                <div className="data-table-header">
                    <div className="data-table-tabs">
                        <button
                            className={`data-table-tab ${activeTab === 'software' ? 'active' : ''}`}
                            onClick={() => setActiveTab('software')}
                        >
                            Software BOM
                        </button>
                        <button
                            className={`data-table-tab ${activeTab === 'hardware' ? 'active' : ''}`}
                            onClick={() => setActiveTab('hardware')}
                        >
                            Hardware BOM
                        </button>
                    </div>
                    <input
                        type="text"
                        className="data-table-search"
                        placeholder="Search components..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Package Name</th>
                            <th>Version</th>
                            <th>Supplier</th>
                            <th>License</th>
                            <th>CVE Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <div className={`pkg-icon ${item.color}`}>
                                        {item.name.charAt(0).toUpperCase()}
                                    </div>
                                </td>
                                <td style={{ fontWeight: 600 }}>{item.name}</td>
                                <td style={{ color: '#7a8ba0' }}>{item.version}</td>
                                <td style={{ color: '#7a8ba0' }}>{item.supplier}</td>
                                <td style={{ color: '#7a8ba0' }}>{item.license}</td>
                                <td>
                                    <span className={`cve-badge ${item.severity}`}>
                                        {item.cveCount}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SBOMAnalysisPage;
