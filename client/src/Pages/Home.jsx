import { useContext, useEffect, useState } from "react";
import { EventContext } from "../Context/EventContext";
import Navbar from "../Components/Navbar";
import { motion } from "framer-motion";

const Home = () => {
    const { events, loading, error, searchEvents, getEvents } = useContext(EventContext);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        console.log("Searching for:", searchQuery);
        searchEvents(searchQuery);
    };
    useEffect(() => {
        getEvents();
    }, []);
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
                                    <div className="flex justify-between items-end ">
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
                                        </div>
                                        <div>
                                            <button className="bg-orange-500 text-white px-2 py-1 mt-2 rounded-lg hover:bg-orange-600">Book Now</button>

                                        </div>

                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    !loading && <p>No events found.</p>
                )}
            </div>
        </div>
    );
};

export default Home;
