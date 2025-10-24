import { CompletionData } from '@/types/Speaking/Profile';

interface ProfileCompletionProps {
  completionData: CompletionData;
}

export default function ProfileCompletion({ completionData }: ProfileCompletionProps) {
  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 75) return 'text-blue-600 bg-blue-100';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 25) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getCompletionMessage = (percentage: number) => {
    if (percentage >= 90) return 'Your profile is complete and looks great!';
    if (percentage >= 75) return 'Your profile is well-developed. Add a few more details to make it perfect.';
    if (percentage >= 50) return 'Your profile has good basic information. Consider adding more details.';
    if (percentage >= 25) return 'Your profile needs more information to help others connect with you.';
    return 'Please complete your profile to get started.';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 bg-red-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Profile Completion</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCompletionColor(completionData.percentage)}`}>
          {completionData.percentage}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              completionData.percentage >= 90 ? 'bg-green-500' :
              completionData.percentage >= 75 ? 'bg-blue-500' :
              completionData.percentage >= 50 ? 'bg-yellow-500' :
              completionData.percentage >= 25 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${completionData.percentage}%` }}
          />
        </div>
      </div>

      {/* Completion Message */}
      <p className="text-sm text-gray-600 mb-4">
        {getCompletionMessage(completionData.percentage)}
      </p>

      {/* Points Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Points Earned:</span>
          <span className="ml-2 font-medium text-gray-900">{completionData.points_earned}</span>
        </div>
        <div>
          <span className="text-gray-500">Total Points:</span>
          <span className="ml-2 font-medium text-gray-900">{completionData.points_total}</span>
        </div>
      </div>

      {/* Missing Fields */}
      {completionData.missing_fields.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Still Missing:</h4>
          <div className="flex flex-wrap gap-2">
            {completionData.missing_fields.map((field) => (
              <span
                key={field}
                className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md"
              >
                {field.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Completed Fields */}
      {completionData.completed_fields.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Completed:</h4>
          <div className="flex flex-wrap gap-2">
            {completionData.completed_fields.map((field) => (
              <span
                key={field}
                className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md"
              >
                {field.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
