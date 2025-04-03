import { useState, useContext } from "react";
import axios from "axios";
import { EventContext } from "../Context/EventContext";
import Navbar from "../Components/Navbar";
import StepIndicator from "../Components/StepIndicator";
import InputField from "../Components/InputField";
import SelectField from "../Components/SelectField";
import DurationField from "../Components/DurationField";
import LocationField from "../Components/LocationField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Event = () => {
    const { addEvent } = useContext(EventContext);
    const [step, setStep] = useState(1);
    const [eventData, setEventData] = useState({
        title: "",
        category: "",
        description: "",
        tags: [],
        dateTime: "",
        duration: { hours: 0, minutes: 0 },
        location: { type: "", address: "", link: "" },
        organizer: { name: "", contactEmail: "", contactPhone: "" },
        price: "",
        capacity: "",
        image: null,
        status: "",
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (name === "title" && value.length > 60) {
            return;
        }
        else if (name.startsWith("duration.")) {
            const key = name.split(".")[1];

            setEventData((prevData) => ({
                ...prevData,
                duration: {
                    ...prevData.duration,
                    [key]: value.replace(/^0+(?=\d)/, ""),
                },
            }));
        }
        else if (name === "tags") {
            setEventData({
                ...eventData,
                tags: value.split(",").map((tag) => tag.trim()),
            });
        } else if (type === "file") {
            setEventData({ ...eventData, image: files[0] });
        } else if (name.startsWith("location.")) {
            const key = name.split(".")[1];
            setEventData({
                ...eventData,
                location: { ...eventData.location, [key]: value },
            });
        } else if (name.startsWith("organizer.")) {
            const key = name.split(".")[1];
            setEventData({
                ...eventData,
                organizer: { ...eventData.organizer, [key]: value },
            });
        } else if (name === "duration.hours" || name === "duration.minutes") {
            const subKey = name.split(".")[1];
            setEventData({
                ...eventData,
                duration: {
                    ...eventData.duration,
                    [subKey]: parseInt(value, 10) || 0,
                },
            });
        } else {
            setEventData({ ...eventData, [name]: value });
        }
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 1) {
            if (!eventData.title || !eventData.category || !eventData.description || eventData.tags.length === 0 || !eventData.status) {
                toast.error("Please fill in all required fields before proceeding.");
                return;
            }
        } else if (step == 2) {
            if (!eventData.dateTime || !eventData.price || !eventData.capacity || !eventData.duration || !eventData.location.type) {
                toast.error("Please fill in all required fields before proceeding.");
                return;
            }
        }
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const validateForm = () => {
        if (!eventData.title || !eventData.category || !eventData.description || !eventData.dateTime || !eventData.status || !eventData.price || !eventData.capacity || !eventData.organizer.name || !eventData.organizer.contactEmail || !eventData.organizer.contactPhone) {
            toast.error("Please fill in all required fields");
            return false;
        }

        if (!/^\d{10}$/.test(eventData.organizer.contactPhone)) {
            toast.error("Please enter a valid 10-digit phone number");
            return false;
        }

        if (eventData.tags.length === 0) {
            toast.error("Please add at least one tag");
            return false;
        }

        if (eventData.location.type === "Physical" && !eventData.location.address) {
            toast.error("Please provide the address for a Physical event");
            return false;
        }

        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        console.log("Event Data Before Sending:", eventData);

        const formData = new FormData();
        formData.append("title", eventData.title);
        formData.append("category", eventData.category);
        formData.append("description", eventData.description);
        formData.append("dateTime", eventData.dateTime);
        formData.append("price", parseInt(eventData.price, 10) || 0);
        formData.append("capacity", parseInt(eventData.capacity, 10) || 0);
        formData.append("status", eventData.status);

        formData.append("duration", JSON.stringify({
            hours: parseInt(eventData.duration.hours, 10) || 0,
            minutes: parseInt(eventData.duration.minutes, 10) || 0,
        }));

        formData.append("location", JSON.stringify(eventData.location));

        formData.append("organizer", JSON.stringify(eventData.organizer));

        formData.append("tags", JSON.stringify(eventData.tags));

        if (eventData.image) {
            formData.append("image", eventData.image);
        }

        const result=await addEvent(formData);
        if(result.success){
            setEventData({
                title: "",
                category: "",
                description: "",
                tags: [],
                dateTime: "",
                duration: { hours: 0, minutes: 0 },
                location: { type: "", address: "", link: "" },
                organizer: { name: "", contactEmail: "", contactPhone: "" },
                price: "",
                capacity: "",
                image: null,
                status: "",
            })
            setStep(1);
        }
    };



    return (
        <div className="flex min-h-screen bg-orange-50">
            <Navbar />
            <div className="flex-1 p-6 justify-center items-center ml-20">
                <h1 className="font-bold text-3xl text-center mt-4">Event Details</h1>
                <StepIndicator currentStep={step} />
                <div className="flex justify-center items-center mt-10">
                    <form onSubmit={handleSubmit} className="bg-white w-auto md:w-1/2 p-5 rounded shadow-md">
                        {step === 1 && (
                            <>
                                <h2 className="text-lg font-semibold mb-4">What is your event about?</h2>
                                <InputField label="Title" name="title" value={eventData.title} onChange={handleChange} required />
                                <SelectField label="Category" name="category" options={["Technology", "Business", "Health", "Education"]} value={eventData.category} onChange={handleChange} required />
                                <InputField label="Description" name="description" type="textarea" value={eventData.description} onChange={handleChange} required />
                                <InputField label="Tags (comma-separated)" name="tags" value={eventData.tags.join(",")} onChange={handleChange} required />
                                <SelectField label="Event Status" name="status" options={["Upcoming", "Ongoing", "Completed", "Cancelled"]} value={eventData.status} onChange={handleChange} required />
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Event Poster</label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="mt-1 p-2 border rounded w-full"
                                        required
                                    />
                                    {eventData.image && (
                                        <img src={URL.createObjectURL(eventData.image)} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                                    )}
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <h2 className="text-lg font-semibold mb-4">When, Where, and How much?</h2>
                                <InputField label="Date" name="dateTime" type="date" value={eventData.dateTime} onChange={handleChange} required />
                                <DurationField hours={eventData.duration.hours} minutes={eventData.duration.minutes} onChange={handleChange} />
                                <SelectField label="Event Location Type" name="location.type" options={["Physical", "Virtual"]} value={eventData.location.type} onChange={handleChange} required />
                                <LocationField locationType={eventData.location.type} onChange={handleChange} />
                                <InputField label="Price" name="price" type="number" value={eventData.price} onChange={handleChange} required />
                                <InputField label="Capacity" name="capacity" type="number" value={eventData.capacity} onChange={handleChange} required />
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <h2 className="text-lg font-semibold mb-4">Who should attendees contact?</h2>
                                <InputField label="Organizer Name" name="organizer.name" value={eventData.organizer.name} onChange={handleChange} required />
                                <InputField label="Organizer Email" name="organizer.contactEmail" type="email" value={eventData.organizer.contactEmail} onChange={handleChange} required />
                                <InputField label="Organizer Contact" name="organizer.contactPhone" type="tel" value={eventData.organizer.contactPhone} onChange={handleChange} required />
                            </>
                        )}

                        <div className="flex justify-between mt-4">
                            {step > 1 && <button onClick={handleBack} className="bg-gray-600 px-4 py-2 text-white rounded">Back</button>}
                            {step < 3 ? (
                                <button onClick={handleNext} className="bg-orange-500 px-4 py-2 text-white rounded">Next</button>
                            ) : (
                                <button type="submit" className="bg-green-500 px-4 py-2 text-white rounded">Submit</button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default Event;
