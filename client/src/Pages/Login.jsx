import React from 'react'
import { useState, useRef } from 'react';
import logo from "../assets/logo.jpg"
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        recaptchaToken: null,
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const recaptchaRef = useRef(null);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleRecaptchaVerify = async (token) => {
        if (!token) {
            toast.error("reCAPTCHA verification failed. Please try again.");
            return;
        }
    
        try {
            const response = await axios.post("http://localhost:5000/login", { 
                ...formData, 
                recaptchaToken: token 
            });
    
            toast.success("User successfully registered");
           
            navigate("/");
        } catch (error) {
            
            const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
           
            toast.error(errorMessage);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
    
        if (!recaptchaRef.current) {
            toast.error("reCAPTCHA not loaded.");
            setLoading(false);
            return;
        }
    
        recaptchaRef.current.execute();
    };



    return (
        <>
            <div className='min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center py-12 am:px-6 lg:px-8'>
                 <ToastContainer position="top-right" autoClose={3000} />
                <div className='flex flex-col  items-center w-full h-50'>
                    <div className='h-24 w-24 rounded-full bg-white p-2 shadow-md  '>
                        <img src={logo} alt="logo" className='h-full w-full object-contain rounded-full' />
                    </div>
                    <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-800'>Meet
                        <span className='text-orange-500'>Kats</span>

                    </h2>
                    <p className='mt-2 text-gray-600 text-center text-sm'>Connect with professionals and grow your network</p>
                </div>
                <div className=' mt-8  sm:mx-auto sm:w-full sm:max-w-md relative z-10 '>
                    <div className='bg-white rounded-md shadow-lg sm:rounded-lg sm:px-10 border border-orange-100 py-8 px-4 '>
                        <div className='w-full max-w-md'>
                            <div className='bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4'>
                                <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Sign In</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className='mb-4'>

                                        <label htmlFor="email" className='block text-gray-700 text-sm font-bold mb-2'>Email</label>
                                        <input required type="text" onChange={handleChange} value={formData.email} name="email" placeholder=' Enter your email address' id="email" className='shadow appearance-none border rounded w-full py-2 px-3  text-gray-700 focus:outline-none focus:shadow-outline' />
                                    </div>
                                    <div className='mb-4'>
                                        <label htmlFor="password" className='block text-gray-700 text-sm font-bold mb-2'>Password</label>
                                        <div className="relative">
                                            <input
                                                required
                                                type={showPassword ? "text" : "password"}
                                                placeholder="*********"
                                                id="password"
                                                name='password'
                                                value={formData.password}
                                                onChange={handleChange}
                                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline pr-10'
                                            />
                                            <button
                                                type="button"
                                                className="absolute cursor-pointer inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-between mb-6'>
                                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer focus:outline-none focus:shadow-outline w-full' type="submit">Sign In</button>
                                    </div>
                                    <div className="flex items-center my-4">

                                        <hr className="flex-grow border-t border-gray-300" />
                                        <span className="px-3 text-gray-500 text-sm">OR</span>
                                        <hr className="flex-grow border-t border-gray-300" />

                                    </div>
                                    <div className="flex flex-col space-y-3">
                                        <button type="button" className="flex items-center justify-center cursor-pointer bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                            <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1">
                                                <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)">
                                                    <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path>
                                                    <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path>
                                                    <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path>
                                                    <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path>
                                                </g>
                                                </g>
                                                </g>
                                            </svg>
                                            Continue with Google
                                        </button>

                                    </div>
                                    <div className="text-center mt-6">
                                        <p className="text-sm text-gray-600">
                                            Don't have an account?{" "}
                                            <button
                                                onClick={() => navigate("/signup")}
                                                className="text-blue-500 hover:text-blue-700 font-medium cursor-pointer"
                                            >
                                                Sign up
                                            </button>
                                        </p>
                                    </div>
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey={RECAPTCHA_SITE_KEY}
                                        size="invisible" 
                                        onChange={handleRecaptchaVerify}
                                    />

                                </form>
                            </div>
                        </div>

                    </div>

                </div>
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-4 mb-4">
                            <a href=" https://www.instagram.com/meetkats/" className="text-gray-500 hover:text-orange-500">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd">
                                    </path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-orange-500">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84">
                                    </path>
                                </svg>
                            </a>
                            <a href=" https://www.linkedin.com/company/meetkats/?viewAsMember=true" className="text-gray-500 hover:text-orange-500">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z">
                                    </path>
                                </svg>
                            </a>
                        </div>
                        <div className="text-sm text-gray-500">
                            <p>© 2025 MeetKats. All rights reserved.</p>
                            <div className="mt-1 flex justify-center space-x-4">
                                <a href="#" className="text-orange-500 hover:text-orange-600">Privacy Policy</a>
                                <span className="text-gray-300">|</span>
                                <a href="#" className="text-orange-500 hover:text-orange-600">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Login