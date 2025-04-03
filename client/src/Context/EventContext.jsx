import { createContext, useState, useEffect } from "react";
import axios from "axios"
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addEvent = async (newEvent) => {
        try {
            const response = await axios.post("http://localhost:5000/event/", newEvent, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 201) {
                const addedEvent = response.data;

                setEvents((prevEvents) => [...prevEvents, addedEvent]);

                toast.success("Event Created Successfully");
                // setEventData({
                //     title: "",
                //     category: "",
                //     description: "",
                //     tags: [],
                //     dateTime: "",
                //     duration: { hours: 0, minutes: 0 },
                //     location: { type: "", address: "", link: "" },
                //     organizer: { name: "", contactEmail: "", contactPhone: "" },
                //     price: "",
                //     capacity: "",
                //     image: null,
                //     status: "",
                // });
            }
        } catch (error) {
            console.error("Error creating event:", error);
            toast.error(error.response?.data?.message || "An error occurred while creating the event.");
        }
    };
    const getEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/event/allEvents");
            console.log("Fetched events from API:", response.data);
            setEvents(response.data);
        } catch (err) {
            setError("Error fetching events");
        }
        setLoading(false);
    };

 
    const searchEvents = async (query) => {
        if (!query) {
            await getEvents(); 
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/event/getEvents?query=${query}`);
            setEvents(response.data.events || []);
        } catch (err) {
            setError("Error searching events");
        }
        setLoading(false);
    };

    useEffect(() => {
        getEvents(); 
    }, []);

    return (
        <EventContext.Provider value={{ events, loading, error, searchEvents ,getEvents,addEvent}}>
            {children}
            <ToastContainer position="top-right" autoClose={5000} />
        </EventContext.Provider>
    );
};
