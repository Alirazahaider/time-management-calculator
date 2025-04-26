import { Task } from '../types';

interface TaskListProps {
    tasks: Task[];
    onRemoveTask: (id: string) => void;
    onUpdateTask: (id: string, updatedTask: Partial<Task>) => void;
}

export default function TaskList({ tasks, onRemoveTask, onUpdateTask }: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No tasks added yet. Start by adding your first task!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3">
                            <span className="font-medium">{task.name}</span>
                            <span className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {task.priority}
              </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                            {task.duration} {task.duration === 1 ? 'hour' : 'hours'}
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <input
                            type="number"
                            min="0.25"
                            step="0.25"
                            value={task.duration}
                            onChange={(e) => onUpdateTask(task.id, { duration: Number(e.target.value) })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                        />
                        <button
                            onClick={() => onRemoveTask(task.id)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}