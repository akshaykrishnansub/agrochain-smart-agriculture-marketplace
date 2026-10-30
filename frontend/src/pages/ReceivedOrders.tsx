import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext";

interface Product{
  _id:string;
  name:string;
  images:string[];
  category:string;
  price:number;
  stock:number;
}

interface ReceivedOrder{
  _id:string;
  productId:Product|null;
  quantity:number;
  totalPrice:number;
  status:"PENDING"|"CONFIRMED"|"PROCESSING"|"SHIPPED"|"DELIVERED"|"CANCELLED";
  paymentStatus:"PENDING"|"PAID"|"FAILED"|"REFUNDED";
  createdAt:string;
}

type OrderStatus="PENDING"|"CONFIRMED"|"PROCESSING"|"SHIPPED"|"DELIVERED"|"CANCELLED";

const getNextStatus=(status:OrderStatus):OrderStatus|null=>{
  if(status==="CONFIRMED"){
    return "PROCESSING";
  }else if(status==="PROCESSING"){
    return "SHIPPED";
  }else if(status==="SHIPPED"){
    return "DELIVERED";
  }else{
    return null;
  }
}

const ReceivedOrders = () => {
  const [orders,setOrders]=useState<ReceivedOrder[]>([]);
  const [loading,setLoading]=useState<boolean>(true);
  const [error,setError]=useState<string>("");
  const {isAuthenticated}=useAuth();

  useEffect(()=>{
    const fetchOrders=async()=>{
      try{
        const res=await fetch(`http://localhost:5000/api/orders`,{
          method:"GET",
          credentials:"include"
        })

        const data=await res.json();
        if(!res.ok){
          console.error(data.message||"Failed to fetch orders");
          return;
        }
        setOrders(data.orders);
      }catch(err){
        setError("Something went wrong");
      }finally{
        setLoading(false);
      }
    }

    fetchOrders();
  },[])

  //function to handle status changes
  const handleStatusChanges=async(orderId:string,newStatus:OrderStatus)=>{
    try{
      const res=await fetch(`http://localhost:5000/api/orders/${orderId}/status`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify({status:newStatus})
      })

      const data=await res.json();
      if(!res.ok){
        console.error(data.message||"Failed to update order status");
        return;
      }

      setOrders((currentOrders)=>currentOrders.map((order)=>order._id===orderId?{...order,status:newStatus}:order))

    }catch(err){
      console.error("Failed to update order status",err);
    }
  }

  return (
    <>
    <title>AgroChain | Received Orders</title>
    <Navbar />
    <main className="bg-green-50 pt-16 min-h-screen overflow-y-hidden">
      <h1 className="mt-4 text-center text-3xl font-bold">Received Orders</h1>
      {loading && (
        <p>Loading Received Orders...</p>
      )}

      {!loading && error && (
        <p>{error}</p>
      )}

      {!loading && !error && orders.length===0 && (
        <p className="text-gray-950"> You haven't received any orders yet.</p>
      )}

      {!loading && !error && orders.length>0 && (
        <div className="space-y-4">
          {orders.map((order)=>(
            <div key={order._id} className="bg-zinc-50 p-8 m-10 shadow-lg rounded-lg">
              <div className="flex flex-col gap-4 sm:flex-row">
                {order.productId?.images?.[0] && (
                  <img src={order.productId.images[0]} alt={order.productId.name} className="h-32 w-32 rounded-md object-cover" />
                )}
                <div className="flex-1">
                  <h2><span className="font-bold">Order ID:{" "}</span>{order._id}</h2>
                  <p><span className="font-bold">Product Name:{" "}</span>{order.productId?.name||"Product Unavailable"}</p>
                  <p><span className="font-bold">Category:{" "}</span>{order.productId?.category||"Product Category Unknown"}</p>
                  <p><span className="font-bold">Price of one Unit:{" "}</span>₹ {order.productId?.price.toFixed(2)}</p>
                  <p><span className="font-bold">Ordered quantity:{" "}</span>{order.quantity}</p>
                  <p><span className="font-bold">Order Total Price:{" "}</span>₹ {order.totalPrice.toFixed(2)}</p>
                  <p><span className="font-bold">Order Status:{" "}</span>{order.status}</p>
                  <p><span className="font-bold">Payment Status:{" "}</span><span className={`${order.paymentStatus==="PAID"?"text-green-600":"text-black"}`}>{order.paymentStatus}</span></p>
                  <p><span className="font-bold">Order Date:{" "}</span>{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                  {order.paymentStatus==="PAID" && getNextStatus(order.status) && (
                    <div className="flex flex-col mt-4 gap-2 sm:flex-row sm:items-center">
                      <label className="font-bold">Update Order Fulfilment Status:</label>
                      <select name="fulfillmentStatus" defaultValue={getNextStatus(order.status)!} className="rounded-lg bg-white border border-green-950">
                        <option value={getNextStatus(order.status)!}>{getNextStatus(order.status)}</option>
                      </select>
                      <div>
                        <button onClick={()=>handleStatusChanges(order._id,getNextStatus(order.status)!)} className="bg-blue-950 p-2 rounded-lg text-white hover:bg-blue-800 cursor-pointer">Update Status</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isAuthenticated?(
        <Navbar showLogin={false} showSignup={false}/>
      ):(<Navbar/>)}
    </main>
    </>
  )
}

export default ReceivedOrders