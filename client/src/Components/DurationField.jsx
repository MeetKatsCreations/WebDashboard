const DurationField = ({ hours, minutes, onChange }) => (
    <div className="mb-4">
        <label htmlFor="duration" className="block font-medium text-gray-500 text-sm mb-1">Duration</label>
        <div className="flex gap-4">
            <input
                type="number"
                name="duration.hours"
                id="hours"
                value={hours}
                onChange={onChange}
                placeholder="Hours"
                className="border border-gray-300 p-2 w-1/2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
            />
            <input
                type="number"
                name="duration.minutes"
                id="minutes"
                value={minutes}
                onChange={onChange}
                placeholder="Minutes"
                className="border border-gray-300 p-2 w-1/2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
            />
        </div>
    </div>
);

export default DurationField;
