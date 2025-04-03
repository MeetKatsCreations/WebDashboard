import InputField from "./InputField";
const LocationField = ({ locationType, onChange }) => (
    <div>
        {locationType === "Physical" && (
            <InputField
                label="Event Address"
                name="location.address"
                type="text"
                onChange={onChange}
                required
            />
        )}
        {locationType === "Virtual" && (
            <InputField
                label="Event Link"
                name="location.link"
                type="text"
                onChange={onChange}
                required
            />
        )}
    </div>
);

export default LocationField;
