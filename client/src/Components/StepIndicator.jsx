const StepIndicator = ({ currentStep }) => (
    <div className="flex justify-between mb-4 mt-10 rounded-md">
        {[1, 2, 3].map((num) => (
            <div key={num} className={`w-1/3 h-2 rounded-full m-2 ${currentStep >= num ? "bg-orange-500" : "bg-gray-300"}`}></div>
        ))}
    </div>
);

export default StepIndicator;
