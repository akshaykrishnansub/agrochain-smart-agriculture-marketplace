import React from "react";

interface NavbarProps{
    leftSlot?:React.ReactNode;
    showLogin?:boolean;
    showSignup?:boolean;
    rightSlot?:React.ReactNode;
    title?:string;
}
const Navbar = ({leftSlot,showLogin=true,showSignup=true,rightSlot}:NavbarProps) => {
  return (
    <nav className="flex justify-center items-center bg-green-900 p-4 top-0 h-16 left-0 w-full">
      {/*LEFT SLOT */}
        <h1 className="text-2xl font-bold text-white">
            Agro<span className="text-green-300">Chain</span>
        </h1>
        <div className="gap-4 mr-auto">
            {leftSlot}
        </div>
      {/*RIGHT SLOT */}
      <div className="flex items-center gap-2">
        {showLogin && (
          <p className="text-white font-semibold text-sm">Login</p>
        )}
        {showSignup && (
          <button className="bg-blue-800 font-semibold p-2 rounded text-white cursor-pointer hover:bg-blue-600">Register</button>
        )}
        {rightSlot?rightSlot:null}
      </div>
    </nav>
  )
}

export default Navbar