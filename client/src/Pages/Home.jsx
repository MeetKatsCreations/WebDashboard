import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EventContext } from "../Context/EventContext";
import Navbar from "../Components/Navbar";
import { motion } from "framer-motion";
import { TicketContext } from "../Context/TicketContext";
import TicketModal from "../Components/TicketModal";
import AuthContext from "../Context/AuthContext";
const Home = () => {
    const { events, loading, error, searchEvents, getEvents, getAvailableSeats } = useContext(EventContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [seatsLeftMap, setSeatsLeftMap] = useState({});
    const navigate = useNavigate();

    const [selectedEvent, setSelectedEvent] = useState(null);
    const { user } = useContext(AuthContext);
    const { bookTicket, ticket, qrCode, ticketId, clearTicket } = useContext(TicketContext);
    const handleSearch = () => {
        console.log("Searching for:", searchQuery);
        searchEvents(searchQuery);
    };
    useEffect(() => {
        getEvents();

    }, []);
    useEffect(() => {
        const fetchSeatsForEvents = async () => {
            const map = {};
            for (const event of events) {
                const remaining = await getAvailableSeats(event._id);
                map[event._id] = remaining;
            }
            setSeatsLeftMap(map);
        };

        if (events.length > 0) {
            fetchSeatsForEvents();
        }
    }, [events]);
    const resetModal = () => {
        setShowModal(false);
        setSelectedEvent(null);
        clearTicket();
    };
    const handleBookNow = async (event) => {
        if (!user) {
            alert("Please log in to book a ticket.");
            return;
        }

        setSelectedEvent(event);

        await bookTicket({
            userName: user.name,
            eventId: event._id,
            timing: event.dateTime,
            startTime: event.startTime,
        });

       
        setShowModal(true);

        
        setSeatsLeftMap((prevMap) => ({
            ...prevMap,
            [event._id]: (prevMap[event._id] || 1) - 1,
        }));
    };


    const formatTimeTo12Hour = (time24) => {
        if (!time24 || typeof time24 !== "string" || !time24.includes(":")) {
            return "Invalid Time";
        }

        const [hourStr, minute] = time24.split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    };
    return (
        <div className="flex flex-col bg-orange-50 min-h-screen">
            <Navbar />
            <div className="text-orange-500 text-center h-auto ml-20 flex flex-col gap-8">
                <h1 className="text-xl md:text-3xl font-bold py-4">Welcome to MeetKats</h1>
                <h2 className="text-3xl md:text-5xl">Grow Your Network & Skills with Our Events</h2>

                <div className="flex items-center gap-4 mb-6 px-12 text-gray-500">
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="border px-3 py-2 rounded-lg w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch} className="bg-orange-500 text-white px-2 py-2 rounded-lg hover:bg-orange-600">
                        Search
                    </button>
                </div>
            </div>

            <div className="flex-1 p-6 ml-20">
                {loading && <p>Loading events...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {Array.isArray(events) && events.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event, index) => (
                            <motion.div
                                key={event._id}
                                className="bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col cursor-pointer"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                viewport={{ once: false, amount: 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <img
                                    src={event.image || "https://via.placeholder.com/150"}
                                    alt={event.title}
                                    className="w-full h-40 object-cover rounded-t-xl"
                                />

                                <div className="p-4">
                                    <h2 className="text-2xl font-semibold text-black mb-2">{event.title}</h2>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {event.tags?.map((tag, idx) => (
                                            <span key={idx} className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-black font-medium">
                                                🎟️ Ticket Price: <span className="font-bold">₹{event.price ?? "N/A"}</span>
                                            </p>

                                            <p className="text-black">
                                                ⏳ Duration: {event.duration ? `${event.duration.hours}h ${event.duration.minutes}m` : "N/A"}
                                            </p>

                                            <p className="text-black">
                                                📅 Date: <span className="font-semibold">{new Date(event.dateTime).toDateString()}</span>
                                            </p>
                                            <p className="text-black">
                                                📅 Time: <span className="font-semibold">{formatTimeTo12Hour(event.startTime)}</span>
                                            </p>
                                           
                                            <p className="text-black">
                                                💺 Seats Left:{" "}
                                                <span className="font-semibold">
                                                    {seatsLeftMap[event._id] !== undefined ? seatsLeftMap[event._id] : "Loading..."}
                                                </span>
                                            </p>
                                        </div>
                                        {seatsLeftMap[event._id] > 0 ? (
                                            <button
                                                className="bg-orange-500 text-white px-2 py-1 mt-2 rounded-lg hover:bg-orange-600"
                                                onClick={() => handleBookNow(event)}
                                            >
                                                Book Now
                                            </button>
                                        ) : (
                                            <p className="text-red-500 mt-2 font-semibold">Sold Out</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    !loading && <p>No events found.</p>
                )}
            </div>

            {showModal && ticket && (
                <TicketModal
                    event={selectedEvent}
                    ticketId={ticketId}
                    qrCode={qrCode}
                    onClose={() => {
                        resetModal();
                        navigate("/");
                    }}
                />
            )}
        </div>
    );
};

export default Home;
