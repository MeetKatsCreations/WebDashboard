import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { EventProvider } from './Context/EventContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <EventProvider>
    <AuthProvider>
    <App />
    </AuthProvider>
    </EventProvider>
    </BrowserRouter>
  </StrictMode>,
)
