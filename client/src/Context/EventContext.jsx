import { createContext, useState, useEffect } from "react";
import axios from "axios"
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addEvent = async (eventData) => {
        try {
            const response = await axios.post("http://localhost:5000/event/", eventData, {
                headers: {
                    "Content-Type": "multipart/form-data", 
                },
            });
    
            toast.success("Event created successfully!");
            return response.data;
        } catch (error) {
            console.error("Error adding event:", error);
            toast.error(error.response?.data?.message || "Failed to create event");
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
    const getAvailableSeats = async (eventId) => {
        try {
            const response = await axios.get(`http://localhost:5000/event/${eventId}/seats`);
            return response.data.remainingSeats;
        } catch (error) {
            console.error("Error fetching available seats:", error);
            toast.error("Could not fetch seat availability");
            return null;
        }
    };
    useEffect(() => {
        getEvents(); 
    }, []);

    return (
        <EventContext.Provider value={{ events, loading, error, searchEvents ,getEvents,addEvent,getAvailableSeats}}>
            {children}
            <ToastContainer position="top-right" autoClose={5000} />
        </EventContext.Provider>
    );
};
