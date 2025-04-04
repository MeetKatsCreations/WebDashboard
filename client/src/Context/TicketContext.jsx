import React, { createContext, useState } from "react";
import axios from "axios";

export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [ticket, setTicket] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const [scanResult, setScanResult] = useState("");
  const clearTicket = () => {
    setTicket(null);
    setQrCode(null);
    setTicketId(null);
  };
  const bookTicket = async (userName, eventName, timing) => {
    try {
      const response = await axios.post("http://localhost:5000/ticket/book", {
        userName,
        eventName,
        timing,
      });

      setTicket({ userName, eventName, timing });
      setQrCode(response.data.qrCode);
      setTicketId(response.data.ticketId);
    } catch (error) {
      console.error("Error booking ticket:", error);
    }
  };

  const downloadTicket = async (ticketId) => {
    try {
        if (!ticketId || typeof ticketId !== "string") {
            alert("No ticket ID provided.");
            return;
        }

        const response = await axios.get(`http://localhost:5000/ticket/download/${ticketId}`, {
            responseType: "blob", 
        });

        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `ticket-${ticketId}.pdf`); 
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error downloading ticket:", error);
        alert("Failed to download the ticket.");
    }
};

  const verifyTicket = async (qrData) => {
    try {
      const response = await axios.post("http://localhost:5000/ticket/verify", {
        qrCode: qrData,
      });

      setScanResult(response.data.message);
    } catch (error) {
      setScanResult("Invalid Ticket");
      console.error("Verification failed:", error);
    }
  };

  return (
    <TicketContext.Provider value={{ ticket, qrCode,clearTicket, ticketId, scanResult, bookTicket, downloadTicket, verifyTicket }}>
      {children}
    </TicketContext.Provider>
  );
};
