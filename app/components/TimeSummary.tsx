import { TimeFrame } from '../types';

interface TimeSummaryProps {
    totalAllocatedTime: number;
    availableTime: number;
    remainingTime: number;
    isOverbooked: boolean;
    timeFrame: TimeFrame;
}

export default function TimeSummary({
                                        totalAllocatedTime,
                                        availableTime,
                                        remainingTime,
                                        isOverbooked,
                                        timeFrame
                                    }: TimeSummaryProps) {
    const percentageAllocated = Math.min(100, (totalAllocatedTime / availableTime) * 100);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Time Summary</h2>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              Allocated Time
            </span>
                        <span className="text-sm font-medium">
              {totalAllocatedTime.toFixed(1)} / {availableTime} hours
            </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full ${isOverbooked ? 'bg-red-500' : 'bg-[#0d5256]'}`}
                            style={{ width: `${percentageAllocated}%` }}
                        ></div>
                    </div>
                </div>

                <div className={`p-3 rounded-md ${isOverbooked ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d={isOverbooked ?
                                    "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" :
                                    "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"}
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>
              {isOverbooked
                  ? `You're overbooked by ${Math.abs(remainingTime).toFixed(1)} hours`
                  : `${remainingTime.toFixed(1)} hours remaining`}
            </span>
                    </div>
                </div>

                <div className="text-sm text-gray-600">
                    <p>Time frame: {timeFrame === 'daily' ? 'Daily (24 hours)' : 'Weekly (168 hours)'}</p>
                    <p className="mt-1">
                        {isOverbooked
                            ? 'Consider reducing time on some tasks'
                            : `${((remainingTime / availableTime) * 100).toFixed(0)}% of your ${timeFrame} time is unallocated`}
                    </p>
                </div>
            </div>
        </div>
    );
}