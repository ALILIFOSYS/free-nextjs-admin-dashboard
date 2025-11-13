const ProgressBar = ({ progress }) => {
    // Convert progress to percentage (if it's not already)
    const percentage = Math.min(Math.max(parseFloat(progress) || 0, 0), 100);
    
    // Determine color based on progress
    const getColor = (value) => {
        if (value < 30) return 'bg-red-500';
        if (value < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="relative w-full">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                    className={`h-2.5 rounded-full ${getColor(percentage)} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="absolute -right-1 -top-6 text-xs text-gray-500 dark:text-gray-400">
                {percentage.toFixed(1)}%
            </span>
        </div>
    );
};

export default ProgressBar;