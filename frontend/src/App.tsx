import { Outlet } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import { useEffect, useState } from "react";
import socket from "./socket";
import Sidebar from "./components/Sidebar";
import { API_URL } from "./config";

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

function App() {
  const {user,loading}=useAuth();
  const [notifications,setNotifications]=useState<Notification[]>([]);
  const [collapsed,setCollapsed]=useState<boolean>(false);
  const [mobileOpen,setMobileOpen]=useState<boolean>(false);
  console.log("Auth User",user);
  console.log("Auth Loading",loading);

  const markAsRead=async(notificationId:string)=>{
    try{
      const res=await fetch(`${API_URL}/api/notifications/${notificationId}/read`,{
        method:"PATCH",
        credentials:"include"
      })

      const data=await res.json();

      if(!res.ok){
        throw new Error(data.message||"Failed to update notification")
      }

      setNotifications((prev)=>
      prev.map((notification)=>notification._id===notificationId?{...notification,isRead:true}:notification))
    }catch(err){
      console.error(err);
    }
  }

  useEffect(()=>{
    if(loading || !user)
      return;

    if(socket.connected){
      socket.emit("join-room",user.id);
    }else{
      socket.on("connect",()=>{
        socket.emit("join-room",user.id);
      })
    }

  },[user,loading]);

  useEffect(()=>{
    if(loading || !user)
      return;
    socket.on("receive-notification",(notification)=>{
      console.error("buyer notification:",notification);
      setNotifications((prev)=>[notification,...prev]);
    })

  },[user,loading])

  useEffect(()=>{
    if(loading||!user){
      return;
    }
    const fetchNotifications=async()=>{
      try{
        const res=await fetch(`${API_URL}/api/notifications`,{
          credentials:"include"
        })

        const data=await res.json();

        if(!res.ok){
          throw new Error(data.message||"Failed to fetch notificiations");
        }

        setNotifications(data.notifications);
      }catch(err){
        console.error(err);
      }
    }
    fetchNotifications();
  },[user,loading]);

  return (
    <>
    {
      user && !loading && (
        <Sidebar collapsed={collapsed} onToggle={()=>setCollapsed(!collapsed)} mobileOpen={mobileOpen} onClose={()=>setMobileOpen(false)} />
      )
    }
    <div className={user && !loading ?(collapsed?"md:ml-20":"md:ml-64"):""}>
      <Outlet context={{notifications,markAsRead,setMobileOpen}} />
    </div>
    </>
  )
}

export default App
