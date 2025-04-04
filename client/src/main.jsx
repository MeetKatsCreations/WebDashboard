import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { EventProvider } from './Context/EventContext.jsx';
import { TicketProvider } from './Context/TicketContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TicketProvider>
        <EventProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </EventProvider>
      </TicketProvider>
    </BrowserRouter>
  </StrictMode>,
)
