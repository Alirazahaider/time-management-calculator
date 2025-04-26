import { useState } from 'react';
import { Priority } from '../types';

interface TaskInputProps {
    onAddTask: (task: { name: string; duration: number; priority?: Priority }) => void;
}

export default function TaskInput({ onAddTask }: TaskInputProps) {
    const [name, setName] = useState('');
    const [duration, setDuration] = useState<number>(1);
    const [priority, setPriority] = useState<Priority>('Medium');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        onAddTask({
            name: name.trim(),
            duration,
            priority
        });

        setName('');
        setDuration(1);
        setPriority('Medium');
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Work, Exercise"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d5256]"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (hours)
                    </label>
                    <input
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d5256]"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                    </label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d5256]"
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#0d5256] text-white py-2 px-4 rounded-md hover:bg-[#0b474a] transition-colors duration-200"
                >
                    Add Task
                </button>
            </form>
        </div>
    );
}