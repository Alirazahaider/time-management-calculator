import { Task } from '../types';

const COLORS = [
    '#0d5256', '#168a8f', '#1ec3ca',
    '#2dd4bf', '#34d399', '#6ee7b7',
    '#4d9373', '#858585', '#a5b4fc',
    '#818cf8', '#6366f1', '#4f46e5'
];

interface TimeVisualizationProps {
    tasks: Task[];
    availableTime: number;
}

export default function TimeVisualization({ tasks, availableTime }: TimeVisualizationProps) {
    if (tasks.length === 0) return null;

    const totalAllocated = tasks.reduce((sum, task) => sum + task.duration, 0);
    const remainingTime = availableTime - totalAllocated;

    // Prepare data for visualization
    const chartData = [
        ...tasks.map(task => ({
            name: task.name,
            value: task.duration,
            color: COLORS[Math.floor(Math.random() * COLORS.length)]
        })),
        ...(remainingTime > 0 ? [{
            name: 'Unallocated',
            value: remainingTime,
            color: '#d34545'
        }] : [])
    ];

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Time Distribution</h2>

            <div className="flex flex-col items-center">
                {/* Simple bar chart */}
                <div className="w-full h-full flex flex-col gap-3 justify-between mb-4">
                    {chartData.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <div className="w-full text-sm text-gray-700 ">{item.name}</div>
                            <div className="text-center w-1/3">
                                <div
                                    className="h-6 w-full rounded-md flex items-center justify-center text-xs text-white"
                                    style={{
                                        backgroundColor: item.color,
                                    }}
                                >
                                    {item.value.toFixed(1)}h
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-2 w-full">
                    {chartData.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-xs text-gray-700">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}