import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import { IoHomeOutline, IoTicketOutline, IoAddCircleOutline } from "react-icons/io5";
import { PiCrownSimple } from "react-icons/pi";
import logo from "../assets/logo.jpg";
import { FaUser } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";
const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const getInitial = (user) => {
        if (user?.name) return user.name.charAt(0).toUpperCase();
        if (user?.email) return user.email.charAt(0).toUpperCase();
        return "?";
    };
    const handleLogin = () => {
        navigate("/login"); 
    };

    return (
        <div className={`bg-white shadow-xl border-r-2 fixed border-r-orange-300 flex flex-col justify-between h-screen p-5 transition-all duration-300 ${isOpen ? "w-60" : "w-20"}`}>
            <div>
                <div className="flex gap-5 items-center">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-orange-500 text-2xl focus:outline-none">
                        <img src={logo} alt="MeetKats" className="h-10 w-auto" />
                    </button>
                    {isOpen && <span className="text-2xl font-bold">Meet<span className="text-orange-500 font-bold">Kats</span></span>}
                </div>
                <hr className="border-t-2 border-orange-300 my-4 w-full" />

                <ul className="flex-1 mt-10 space-y-8">
                    <li>
                        <Link to="/" className="flex items-center text-2xl space-x-4 hover:text-gray-300">
                            <IoHomeOutline />
                            {isOpen && <span className="text-lg">Home</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/pro" className="flex items-center text-2xl space-x-4 hover:text-gray-300">
                            <PiCrownSimple />
                            {isOpen && <span className="text-lg">Pro Version</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/book-tickets" className="flex text-2xl items-center space-x-4 hover:text-gray-300">
                            <IoTicketOutline />
                            {isOpen && <span className="text-lg">Book Tickets</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/add-events" className="flex text-2xl items-center space-x-4 hover:text-gray-300">
                            <IoAddCircleOutline />
                            {isOpen && <span className="text-lg">Add Events</span>}
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="relative">
            {user ? (
                <div className="absolute bottom-5">
                    <div className="flex items-center space-x-4 cursor-pointer">
                        <div className="w-10 h-10 flex items-center justify-center bg-orange-500 text-white text-lg font-bold rounded-full" onClick={toggleDropdown}>
                            {getInitial(user)}
                        </div>
                        {isOpen && <span className="text-lg font-semibold">{user.name || user.email}</span>}
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute top-full mt-2 w-20 bg-orange-500 shadow-md">
                            <button
                                onClick={logout}
                                className="block w-full text-white px-4 py-2 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="absolute bottom-5">
                    <div className="flex items-center space-x-4 cursor-pointer" onClick={toggleDropdown}>
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-300 text-white text-lg font-bold rounded-full">
                            <FaUser className="text-black" />
                        </div>
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute top-full mt-2 w-20 bg-orange-500 shadow-md">
                            <button
                                onClick={handleLogin}
                                className="block w-full text-white px-4 py-2 hover:bg-gray-100"
                            >
                                Login
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
        </div>
    );
};

export default Navbar;
