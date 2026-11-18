import { Outlet } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import { useEffect, useState } from "react";
import socket from "./socket";

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
  console.log("Auth User",user);
  console.log("Auth Loading",loading);

  const markAsRead=async(notificationId:string)=>{
    try{
      const res=await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`,{
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
        const res=await fetch(`http://localhost:5000/api/notifications`,{
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
      <Outlet context={{notifications,markAsRead}} />
    </>
  )
}

export default App
