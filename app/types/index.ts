export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
    id: string;
    name: string;
    duration: number;
    priority?: Priority;
}

export type TimeFrame = 'daily' | 'weekly';