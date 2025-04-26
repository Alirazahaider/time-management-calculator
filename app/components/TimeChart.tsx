import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Task } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface TimeChartProps {
    tasks: Task[];
    availableTime: number;
}

const COLORS = [
    '#0d5256', '#168a8f', '#1ec3ca',
    '#2dd4bf', '#34d399', '#6ee7b7',
    '#a7f3d0', '#d1fae5', '#a5b4fc',
    '#818cf8', '#6366f1', '#4f46e5'
];

export default function TimeChart({ tasks, availableTime }: TimeChartProps) {
    const totalAllocated = tasks.reduce((sum, task) => sum + task.duration, 0);
    const remainingTime = availableTime - totalAllocated;

    // Prepare data for charts
    const chartData = {
        labels: [...tasks.map(task => task.name), ...(remainingTime > 0 ? ['Unallocated'] : [])],
        datasets: [
            {
                label: 'Hours',
                data: [...tasks.map(task => task.duration), ...(remainingTime > 0 ? [remainingTime] : [])],
                backgroundColor: [
                    ...tasks.map((_, index) => COLORS[index % COLORS.length]),
                    ...(remainingTime > 0 ? ['#e5e7eb'] : [])
                ],
                borderColor: '#fff',
                borderWidth: 1,
            },
        ],
    };

    const barData = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Hours Allocated',
                data: chartData.datasets[0].data,
                backgroundColor: chartData.datasets[0].backgroundColor,
                borderColor: '#fff',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const percentage = ((value / availableTime) * 100).toFixed(1);
                        return `${label}: ${value} hrs (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Time Distribution</h2>

            <div className="space-y-6 flex flex-row justify-between">
                <div className="h-64 w-2/5">
                    <Pie
                        data={chartData}
                        options={options}
                    />
                </div>

                <div className="h-64 w-3/5">
                    <Bar
                        data={barData}
                        options={{
                            ...options,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: availableTime,
                                    title: {
                                        display: true,
                                        text: 'Hours'
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}