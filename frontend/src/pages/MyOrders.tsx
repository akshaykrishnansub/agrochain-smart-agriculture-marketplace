
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

interface Product{
   _id:string;
   name:string;
   images:string[];
   category:string;
}

interface BuyerOrder{
   _id:string;
   productId:Product|null;
   quantity:number;
   totalPrice:number;
  status:"PENDING"|"CONFIRMED"|"PROCESSING"|"SHIPPED"|"DELIVERED"|"CANCELLED";
   paymentStatus:"PAID"|"PENDING"|"FAILED"|"REFUNDED";
   createdAt:string;
}

const MyOrders = () => {
  const [orders,setOrders]=useState<BuyerOrder[]>([]);
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

  return (
    <>
    <title>AgroChain | My Orders</title>
    <Navbar/>
    <main className="bg-green-50 min-h-screen pt-16 overflow-y-hidden">
      <h1 className="mt-4 text-center text-3xl font-bold">My Orders</h1>
      {loading && (
        <p>Loading Orders...</p>
      )}

      {!loading && error && (
        <p>{error}</p>
      )}

      {!loading && !error && orders.length===0 && (
        <p className="text-gray-900">You haven't placed any orders yet</p>
      )}

      {!loading && !error && orders.length>0 && (
        <div className="space-y-5">
          {orders.map((order)=>(
            <div key={order._id} className="p-8 bg-white m-10 shadow-lg rounded-lg">
              <div className="mb-4 flex flex-wrap justify-between items-center">
                <p className="text-green-950"><span className="font-bold text-xl">Order ID:{" "}</span>{order._id}</p>
                <span className="rounded-full bg-green-200 px-3 py-1 text-green-950">{order.status}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {order.productId?.images?.[0] && (
                  <img src={order.productId.images[0]} alt={order.productId.name} className="h-32 w-32 rounded-lg object-cover" />
                )}
                <div className="flex-1">
                  <h2 className="font-semibold">{order.productId?.name||"Product Unavailable"}</h2>
                  <p><span className="font-bold text-sm">Category:{" "}</span>{order.productId?.category||"Product category unknown"}</p>
                  <p><span className="font-bold text-sm">Quantity:{" "}</span>{order.quantity}</p>
                  <p><span className="font-bold text-sm">Total Price:{" "}</span>₹ {order.totalPrice.toFixed(2)}</p>
                  <p><span className="font-bold text-sm">Payment Status:{" "}</span><span className={`${order.paymentStatus==="PAID"?"text-green-400":"text-black"}`}>{order.paymentStatus}</span></p>
                  <p><span className="font-bold text-sm">Created At:{" "}</span>{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAuthenticated ? (
        <Navbar showLogin={false} showSignup={false}/>
      ):(
        <Navbar/>
      )}
   </main>
   <Footer/>
    </>
  )
}

export default MyOrders