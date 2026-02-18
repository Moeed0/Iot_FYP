import DeviceCard from '../components/DeviceCard';

const mockDevices = [
    {
        id: 1,
        name: 'Smart Camera XYZ-001',
        type: 'IP Camera',
        ip: '192.168.1.101',
        mac: '00:1B:44:11:3A:B7',
        manufacturer: 'SmartCamInc',
        firmwareStatus: 'ready'
    },
    {
        id: 2,
        name: 'IoT Gateway HUB-445',
        type: 'Gateway',
        ip: '192.168.1.102',
        mac: '00:1B:44:22:4C:D8',
        manufacturer: 'SmartHub Corp',
        firmwareStatus: 'ready'
    },
    {
        id: 3,
        name: 'Smart Thermostat TH-002',
        type: 'Thermostat',
        ip: '192.168.1.103',
        mac: '00:1B:44:33:5E:F9',
        manufacturer: 'ClimateControl Ltd',
        firmwareStatus: 'pending'
    },
    {
        id: 4,
        name: 'Security Sensor SS-114',
        type: 'Sensor',
        ip: '192.168.1.104',
        mac: '00:1B:44:44:6A:10',
        manufacturer: 'SecureSense',
        firmwareStatus: 'ready'
    },
    {
        id: 5,
        name: 'Smart Lock SL-776',
        type: 'Lock',
        ip: '192.168.1.105',
        mac: '00:1B:44:55:7B:21',
        manufacturer: 'LockTech',
        firmwareStatus: 'pending'
    },
    {
        id: 6,
        name: 'Smart Doorbell DB-223',
        type: 'Doorbell',
        ip: '192.168.1.106',
        mac: '00:1B:44:66:8C:32',
        manufacturer: 'BellVision',
        firmwareStatus: 'ready'
    }
];

function DeviceManagementPage() {
    const readyCount = mockDevices.filter(d => d.firmwareStatus === 'ready').length;

    return (
        <div>
            <div className="page-header">
                <h1>Device Management</h1>
                <p>Automatic IoT device detection and firmware analysis</p>
            </div>

            <div className="auto-detect-banner">
                <div className="auto-detect-left">
                    <div className="auto-detect-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                    </div>
                    <div>
                        <div className="auto-detect-title">Auto Detection Active</div>
                        <div className="auto-detect-subtitle">System is continuously scanning for IoT devices on the network</div>
                    </div>
                </div>
                <div className="auto-detect-count">
                    <div className="count">{mockDevices.length}</div>
                    <div className="label">Devices Found</div>
                </div>
            </div>

            <div className="device-grid">
                {mockDevices.map(device => (
                    <DeviceCard key={device.id} device={device} />
                ))}
            </div>
        </div>
    );
}

export default DeviceManagementPage;
