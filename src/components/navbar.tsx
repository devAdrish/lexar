import React from 'react'
import { useNavigate } from "react-router-dom";


const Navbar = () => {
    const navigate = useNavigate();
    return (
        <div className=" content-end flex justify-end">
            
            <button className="bg-green-500 text-white rounded-md px-4 py-2 m-5" onClick={() => { navigate("/sign-up") }}>
                Sign Up
            </button>
            <button className="bg-blue-500 text-white rounded-md px-4 py-2 m-5" onClick={() => { navigate("/login") }}>
                Login
            </button>
        </div>
    )
}
export default Navbar