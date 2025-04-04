import React, { useState, useContext } from "react";
import { TicketContext } from "../Context/TicketContext";
import { QrReader } from "react-qr-reader";

const TicketBooking = () => {
  const { ticket, qrCode, ticketId, scanResult, bookTicket, downloadTicket, verifyTicket } = useContext(TicketContext);
  const [userName, setUserName] = useState("");
  const [eventName, setEventName] = useState("");
  const [timing, setTiming] = useState("");

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Book a Ticket</h2>
      <input type="text" placeholder="Your Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
      <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
      <input type="text" placeholder="Timing" value={timing} onChange={(e) => setTiming(e.target.value)} />
      <button onClick={() => bookTicket(userName, eventName, timing)}>Book Now</button>

      {qrCode && (
        <div>
          <h3>Your QR Code</h3>
          <img src={qrCode} alt="QR Code" />
          <button onClick={downloadTicket}>Download Ticket</button>
        </div>
      )}

      <h2>Verify Ticket</h2>
      <QrReader
        onResult={(result, error) => {
          if (result) verifyTicket(result.text);
        }}
        style={{ width: "300px" }}
      />
      <h3>{scanResult}</h3>
    </div>
  );
};

export default TicketBooking;
