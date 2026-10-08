import React from "react";
import { Link, useNavigate } from "react-router";

interface NavbarProps{
    leftSlot?:React.ReactNode;
    showLogin?:boolean;
    showSignup?:boolean;
    rightSlot?:React.ReactNode;
    title?:string;
}
const Navbar = ({leftSlot,showLogin=true,showSignup=true,rightSlot}:NavbarProps) => {
  const navigate=useNavigate();
  return (
    <nav className="flex justify-center items-center bg-green-900 p-4 top-0 h-16 left-0 w-full fixed">
      {/*LEFT SLOT */}
        <h1 className="text-2xl font-bold text-white">
            Agro<span className="text-green-300">Chain</span>
        </h1>
        <div className="flex gap-4 mr-auto">
            {leftSlot}
        </div>
      {/*RIGHT SLOT */}
      <div className="flex items-center gap-2">
        {showLogin && (
          <Link to="/login" className="text-white font-semibold text-sm">Login</Link>
        )}
        {showSignup && (
          <button type="button" onClick={()=>navigate("/register")} className="bg-blue-800 font-semibold p-2 rounded text-white cursor-pointer hover:bg-blue-600">Register</button>
        )}
        {rightSlot?rightSlot:null}
      </div>
    </nav>
  )
}

export default Navbar