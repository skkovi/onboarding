export default function ProgressIndicator({ currentStep }) {
  return (
    <div className="max-w-md w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-md text-gray-600">{`Step ${currentStep} of 4`}</span>
        <span className="text-sm text-gray-600">
          {Math.round((currentStep / 4) * 100)}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${Math.round((currentStep / 4) * 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
