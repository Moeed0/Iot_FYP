import { Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler
} from 'chart.js';
import StatCard from '../components/StatCard';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

function DashboardPage() {
    const pieData = {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{
            data: [12, 34, 68, 42],
            backgroundColor: ['#e53935', '#f9a825', '#2196f3', '#43a047'],
            borderWidth: 0
        }]
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#7a8ba0',
                    font: { family: 'Inter', size: 12 },
                    padding: 16,
                    usePointStyle: true,
                    pointStyleWidth: 10
                }
            }
        }
    };

    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Detected',
                data: [30, 45, 55, 60, 80, 95, 120],
                borderColor: '#e53935',
                backgroundColor: 'rgba(229, 57, 53, 0.1)',
                tension: 0.4,
                fill: false,
                pointRadius: 4,
                pointBackgroundColor: '#e53935'
            },
            {
                label: 'Resolved',
                data: [10, 20, 35, 50, 55, 70, 90],
                borderColor: '#43a047',
                backgroundColor: 'rgba(67, 160, 71, 0.1)',
                tension: 0.4,
                fill: false,
                pointRadius: 4,
                pointBackgroundColor: '#43a047'
            }
        ]
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { color: 'rgba(26, 37, 64, 0.5)' },
                ticks: { color: '#7a8ba0', font: { family: 'Inter', size: 11 } }
            },
            y: {
                grid: { color: 'rgba(26, 37, 64, 0.5)' },
                ticks: { color: '#7a8ba0', font: { family: 'Inter', size: 11 } }
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#7a8ba0',
                    font: { family: 'Inter', size: 12 },
                    padding: 20,
                    usePointStyle: true,
                    pointStyleWidth: 10
                }
            }
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Security Dashboard</h1>
                <p>Real-time IoT vulnerability monitoring and analysis</p>
            </div>

            <div className="stat-cards">
                <StatCard
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" />
                            <path d="M8 21h8M12 17v4" />
                        </svg>
                    }
                    value="24"
                    label="Total Connected Devices"
                    trend="+3"
                    trendDir="up"
                    colorClass="cyan"
                />
                <StatCard
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    }
                    value="8"
                    label="Firmware Ready to Extract"
                    trend="+2"
                    trendDir="up"
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
                    value="156"
                    label="Total Vulnerabilities"
                    trend="+12"
                    trendDir="up"
                    colorClass="yellow"
                />
                <StatCard
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    }
                    value="12"
                    label="Critical Risk Count"
                    trend="-2"
                    trendDir="down"
                    colorClass="red"
                />
            </div>

            <div className="charts-row">
                <div className="chart-container">
                    <div className="chart-title">Vulnerability Severity Distribution</div>
                    <div className="chart-wrapper">
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </div>
                <div className="chart-container">
                    <div className="chart-title">Risk Trend Analysis</div>
                    <div className="chart-wrapper">
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
