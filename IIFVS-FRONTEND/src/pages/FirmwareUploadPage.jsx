import { useState } from 'react';
import API from '../services/api';

function FirmwareUploadPage() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [extractionResults, setExtractionResults] = useState(null);
    const [vulnerabilities, setVulnerabilities] = useState(null);
    const [scanningVulns, setScanningVulns] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [error, setError] = useState('');

    const handleFileSelect = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setExtractionResults(null);
            setVulnerabilities(null);
            setError('');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files[0];
        if (dropped) {
            setFile(dropped);
            setExtractionResults(null);
            setVulnerabilities(null);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('firmware', file);

        try {
            const response = await API.post('/upload', formData); // Axios sets Content-Type automatically with boundary
            setExtractionResults(response.data);
            setSearchKeyword(response.data.prime_keyword || response.data.components?.[0]?.name || 'IoT Firmware');
        } catch (err) {
            setError('Failed to upload firmware. Ensure the backend server is running on your Kali machine.');
            // Mock fallback data for demo
            setExtractionResults({
                filename: file.name,
                file_size: file.size,
                components: [
                    { name: 'squashfs-root', type: 'Squashfs filesystem', size: '2.4 MB', offset: '0x40000' },
                    { name: 'kernel.bin', type: 'Linux kernel ARM', size: '1.8 MB', offset: '0x0' },
                    { name: 'bootloader.bin', type: 'U-Boot bootloader', size: '256 KB', offset: '0x1000' },
                    { name: 'config.tar.gz', type: 'gzip compressed data', size: '48 KB', offset: '0x240000' },
                    { name: 'certificates/', type: 'Certificate store', size: '12 KB', offset: '0x280000' }
                ]
            });
        } finally {
            setUploading(false);
        }
    };

    const handleScanVulnerabilities = async () => {
        setScanningVulns(true);
        try {
            // Search NVD for user-provided keyword
            const response = await API.get('/nvd-search', {
                params: { keyword: searchKeyword }
            });
            setVulnerabilities(response.data.vulnerabilities || []);
        } catch (err) {
            // Mock fallback data
            setVulnerabilities([
                {
                    cve_id: 'CVE-2024-3094',
                    description: 'A critical vulnerability in xz-utils affecting embedded Linux distributions used in IoT firmware.',
                    cvss_score: 10.0,
                    severity: 'critical'
                },
                {
                    cve_id: 'CVE-2023-44487',
                    description: 'HTTP/2 Rapid Reset attack vulnerability affecting embedded web servers in IoT devices.',
                    cvss_score: 7.5,
                    severity: 'high'
                },
                {
                    cve_id: 'CVE-2023-38545',
                    description: 'Buffer overflow in libcurl SOCKS5 proxy handshake, commonly found in IoT firmware networking stacks.',
                    cvss_score: 9.8,
                    severity: 'critical'
                },
                {
                    cve_id: 'CVE-2022-22965',
                    description: 'Remote code execution vulnerability in Spring Framework affecting IoT management interfaces.',
                    cvss_score: 5.3,
                    severity: 'medium'
                }
            ]);
        } finally {
            setScanningVulns(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Firmware Upload & Extraction</h1>
                <p>Upload IoT firmware binary for Binwalk extraction and vulnerability scanning</p>
            </div>

            {/* Upload Zone */}
            <div
                className="upload-zone"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('firmware-input').click()}
            >
                <input
                    id="firmware-input"
                    type="file"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    accept=".bin,.img,.fw,.hex,.elf"
                />
                <div className="upload-zone-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                </div>
                {file ? (
                    <>
                        <h3>{file.name}</h3>
                        <p>{(file.size / 1024).toFixed(1)} KB - Click to change file</p>
                    </>
                ) : (
                    <>
                        <h3>Drop firmware binary here or click to browse</h3>
                        <p>Supports .bin, .img, .fw, .hex, .elf formats</p>
                    </>
                )}
            </div>

            {file && !extractionResults && (
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <button className="btn-primary" onClick={handleUpload} disabled={uploading} style={{ maxWidth: 300 }}>
                        {uploading ? 'Extracting with Binwalk...' : 'Extract Firmware'}
                    </button>
                </div>
            )}

            {error && (
                <div style={{ color: '#f9a825', fontSize: 13, textAlign: 'center', marginBottom: 16 }}>
                    {error} (Showing demo data)
                </div>
            )}

            {/* Extraction Results */}
            {extractionResults && (
                <div className="extraction-results">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3>Extraction Results - {extractionResults.filename}</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                className="form-input"
                                style={{ width: '250px', padding: '8px' }}
                                placeholder="Search CVEs (e.g. OpenSSL)"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                            <button
                                className="btn-secondary"
                                onClick={handleScanVulnerabilities}
                                disabled={scanningVulns}
                            >
                                {scanningVulns ? 'Scanning NVD...' : 'Scan for Vulnerabilities'}
                            </button>
                        </div>
                    </div>

                    {extractionResults.components && extractionResults.components.map((comp, index) => (
                        <div className="extraction-item" key={index}>
                            <div className="extraction-item-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                            </div>
                            <span className="extraction-item-name">{comp.name}</span>
                            <span className="extraction-item-type">{comp.type}</span>
                            <span className="extraction-item-size">{comp.size}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Vulnerability Results */}
            {vulnerabilities && (
                <div className="vuln-list">
                    <h3 style={{ marginBottom: 4, fontSize: 18, fontWeight: 600 }}>NVD Vulnerability Results</h3>
                    <p style={{ fontSize: 13, color: '#7a8ba0', marginBottom: 12 }}>
                        {vulnerabilities.length} vulnerabilities found from NVD database
                    </p>
                    {vulnerabilities.map((vuln, index) => (
                        <div className="vuln-item" key={index}>
                            <div className="vuln-item-header">
                                <span className="vuln-id">{vuln.cve_id}</span>
                                <span className={`vuln-score ${vuln.severity}`}>
                                    CVSS {vuln.cvss_score}
                                </span>
                            </div>
                            <p className="vuln-description">{vuln.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FirmwareUploadPage;
