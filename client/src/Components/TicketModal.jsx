import React, { useContext } from "react";
import { TicketContext } from "../Context/TicketContext";
import { useNavigate } from "react-router-dom";
const TicketModal = ({ event, ticketId, qrCode, onClose }) => {
    const { downloadTicket } = useContext(TicketContext);
 const navigate=useNavigate();
    if (!ticketId) return null;

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50"
            onClick={onClose}
        >
            <div 
                className="bg-orange-50 p-6 rounded-2xl shadow-2xl text-center w-96 relative border-2 border-orange-200"
                onClick={(e) => e.stopPropagation()}
            >
               
                <button 
                    onClick={() => navigate("/")}
                    className="absolute top-2 right-2 text-orange-500 hover:text-red-500 text-lg font-bold"
                >
                    ✖
                </button>

                <h2 className="text-2xl font-bold text-orange-600 mb-4">Your Ticket for</h2>
                <p className="text-xl font-semibold text-orange-800 mb-2">{event?.title}</p>

                <img 
                    src={qrCode} 
                    alt="QR Code" 
                    className="w-36 h-36 mx-auto my-4 border-4 border-orange-300 rounded-lg"
                />

                <div className="flex flex-col space-y-3 mt-4">
                    <button 
                        onClick={() => downloadTicket(ticketId)} 
                        className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                    >
                        Download Ticket
                    </button>

                   
                 <button 
                 onClick={() => {
                   onClose();                    
                   setTimeout(() => navigate("/"), 100);  
                 }}
                 className="text-orange-600 underline hover:text-orange-800">
               
                 Go Back
               </button>
                </div>
            </div>
        </div>
    );
};

export default TicketModal;
