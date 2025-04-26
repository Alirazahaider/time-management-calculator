"use client";
import {useState} from 'react';
import TaskInput from '@/app/components/TaskInput';
import TaskList from '@/app/components/TaskList';
import TimeSummary from '@/app/components/TimeSummary';
import TimeVisualization from '@/app/components/TimeVisualization';
import {Task, TimeFrame} from '@/app/types';
import {useRef} from 'react';
import ExportControls from '@/app/components/ExportControls';
import TimeChart from "@/app/components/TimeChart";

export default function TimeManagementCalculator() {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily');
    const [availableTime, setAvailableTime] = useState<number>(24);
    const [tasks, setTasks] = useState<Task[]>([]);
    const exportRef = useRef<HTMLDivElement>(null);
    const totalAllocatedTime = tasks.reduce((sum, task) => sum + task.duration, 0);
    const remainingTime = availableTime - totalAllocatedTime;
    const isOverbooked = remainingTime < 0;

    const addTask = (task: Omit<Task, 'id'>) => {
        setTasks([...tasks, {...task, id: Date.now().toString()}]);
    };

    const removeTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const updateTask = (id: string, updatedTask: Partial<Task>) => {
        setTasks(tasks.map(task => task.id === id ? {...task, ...updatedTask} : task));
    };

    return (
        <div className="min-h-screen bg-[#172227] py-8" ref={exportRef}>

            <div className="max-w-5xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center text-white mb-8">
                    Time Management Calculator
                </h1>

                <div className="col-span-2 bg-white rounded-lg shadow-md my-5 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Settings</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Time Frame
                                    </label>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => setTimeFrame('daily')}
                                            className={`px-4 py-2 rounded-md ${timeFrame === 'daily' ? 'bg-[#0d5256] text-white' : 'bg-gray-200 text-gray-700'}`}
                                        >
                                            Daily
                                        </button>
                                        <button
                                            onClick={() => setTimeFrame('weekly')}
                                            className={`px-4 py-2 rounded-md ${timeFrame === 'weekly' ? 'bg-[#0d5256] text-white' : 'bg-gray-200 text-gray-700'}`}
                                        >
                                            Weekly
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Available Time (hours)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={availableTime}
                                        onChange={(e) => setAvailableTime(Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d5256]"
                                    />
                                </div>
                            </div>
                        </div>

                        <TaskInput onAddTask={addTask}/>
                    </div>
                </div>
                {/*<div className="my-5">*/}
                {/*    <TimeChart tasks={tasks} availableTime={availableTime}/>*/}
                {/*</div>*/}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Tasks</h2>
                            <TaskList
                                tasks={tasks}
                                onRemoveTask={removeTask}
                                onUpdateTask={updateTask}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <TimeSummary
                                totalAllocatedTime={totalAllocatedTime}
                                availableTime={availableTime}
                                remainingTime={remainingTime}
                                isOverbooked={isOverbooked}
                                timeFrame={timeFrame}
                            />
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <TimeVisualization tasks={tasks} availableTime={availableTime}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Export Summary</h2>
                    <ExportControls
                        targetRef={exportRef}
                        tasks={tasks}
                        totalAllocatedTime={totalAllocatedTime}
                        availableTime={availableTime}
                        remainingTime={remainingTime}
                        isOverbooked={isOverbooked}
                        timeFrame={timeFrame}
                    />
                </div>
            </div>
        </div>
    );
}