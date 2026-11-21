import React, { useState } from "react";
import { Link, useNavigate, useOutletContext} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProductDetails{
  _id:string;
  name:string;
  images:string[];
  category:string;
}

interface OrderDetails{
  _id:string;
  productId:ProductDetails;
  quantity:number;
  totalPrice:number;
  status:string;
}

interface Notification{
  _id:string;
  userId:string;
  message:string;
  event:"ORDER_PLACED"|"ORDER_UPDATED";
  orderId:OrderDetails;
  isRead:boolean;
  createdAt:string;
}

interface NavbarProps{
    leftSlot?:React.ReactNode;
    showLogin?:boolean;
    showSignup?:boolean;
    rightSlot?:React.ReactNode;
    title?:string;
}
const Navbar = ({leftSlot,showLogin=true,showSignup=true,rightSlot}:NavbarProps) => {
  const navigate=useNavigate();
  const [showNotifications,setShowNotifications]=useState<boolean>(false);
  const {notifications,markAsRead}=useOutletContext<{notifications:Notification[];markAsRead:(notificationId:string)=>Promise<void>}>()
  const unreadCount=notifications.filter((notification)=>!notification.isRead).length;
  const {isAuthenticated,setUser}=useAuth();

  const handleLogout=async()=>{
    try{
      const res=await fetch(`http://localhost:5000/api/auth/logout`,{
        method:"POST",
        credentials:"include"
      })

      const data=await res.json();
      if(!res.ok){
        throw new Error(data.message || "Failed to Logout");
      }

      setUser(null);
      setShowNotifications(false);
      navigate("/login");
    }catch(err){
      console.error(err);
    }
  }

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
      <div className="flex items-center gap-4">
        {showLogin && (
          <Link to="/login" className="text-white font-semibold text-sm">Login</Link>
        )}
        {showSignup && (
          <button type="button" onClick={()=>navigate("/register")} className="bg-blue-800 font-semibold p-2 rounded text-white cursor-pointer hover:bg-blue-600">Register</button>
        )}

        {isAuthenticated && (
          <button type="button" className="relative text-white" onClick={()=>setShowNotifications(!showNotifications)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>
          {unreadCount>0 && (
            <span className="absolute -top-2 -right-2 bg-red-900 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
              {unreadCount}
            </span>
          )}
        </button>
        )}

        {isAuthenticated && (
          <button onClick={handleLogout} className="text-white cursor-pointer">Logout</button>
        )}
        
        
        {isAuthenticated && showNotifications && (
          <div className="absolute right-4 sm:right-2 top-16 bg-white text-black w-[calc(100vw-1rem)] rounded-lg shadow-lg p-4 max-h-[70vh] overflow-y-auto sm:max-w-80">
            <h3 className="font-semibold mb-3">Notifications</h3>
            {notifications.length>0?(
              notifications.map((notification)=>(
                <div key={notification._id} className={`border-b py-3 cursor-pointer ${notification.isRead?"bg-white":"bg-green-50"}`}
                onClick={()=>!notification.isRead && markAsRead(notification._id)}>
                  <h4 className="font-semibold">{notification.event==="ORDER_PLACED"?"New Order Received":"Order Status Updated"}</h4>
                  <p>{notification.message}</p>
                  <div className="text-sm mt-2 space-y-1">
                    <p>Product: {notification.orderId.productId.name}</p>
                    <p>Quantity: {notification.orderId.quantity}</p>
                    <p>Amount: {notification.orderId.totalPrice}</p>
                    <p>Status: {notification.orderId.status}</p>
                  </div>
                </div>
              ))
            ):(
              <p>No notifications yet</p>
            )}
          </div>
        )}
        {rightSlot?rightSlot:null}
      </div>
    </nav>
  )
}

export default Navbar