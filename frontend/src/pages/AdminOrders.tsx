import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext";

interface Order{
    _id:string;
    buyerId:{
        _id:string;
        name:string;
        email:string;
    };
    productId:{
        _id:string;
        name:string;
        images:string[];
        category:string;
        price:number;
        stock:number;
    };
    quantity:number;
    totalPrice:number;
    status:"PENDING"|"CONFIRMED"|"PROCESSING"|"SHIPPED"|"DELIVERED"|"CANCELLED";
    paymentStatus:"PENDING"|"PAID"|"FAILED"|"REFUNDED";
    paymentInfo?:unknown;
    stripeSessionId?:string;
    createdAt:string;
    updatedAt:string;
}


const AdminOrders = () => {
    const [loading,setLoading]=useState<boolean>(true);
    const [error,setError]=useState<string>("");
    const [orders,setOrders]=useState<Order[]>([]);
    const [showUpdateOrderModal,setShowUpdateOrderModal]=useState<boolean>(false);
    const [editingOrderStatus,setEditingOrderStatus]=useState<Order|null>(null);
    const [status,setStatus]=useState<string>("");
    const {isAuthenticated}=useAuth();

    useEffect(()=>{
        const fetchOrders=async()=>{
            try{
                const res=await fetch(`http://localhost:5000/api/admin/orders`,{
                    method:"GET",
                    credentials:"include"
                })

                const data=await res.json();

                if(!res.ok){
                    throw new Error(data.message||"Failed to fetch orders");
                }

                setOrders(data.orders);
            }catch(err){
                setError("Unable to fetch orders");
            }finally{
                setLoading(false);
            }
        }

        fetchOrders();
    },[])

    const handleUpdateOrderStatus=async(orderId:string)=>{
        try{
            const res=await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify({status})
            })

            const data=await res.json();
            if(!res.ok){
                throw new Error(data.message||"Failed to update order status");
            }

            setOrders(orders.map((order)=>order._id===orderId?{...order,status:status as Order["status"]}:order));
            setShowUpdateOrderModal(false);
            setEditingOrderStatus(null);
        }catch(err){
            setError("Unable to update order status");
        }
    }
  return (
    <>
    <title>AgroChain | Admin Order Management</title>
    <Navbar/>
    <main className="bg-green-50 pt-16 min-h-screen overflow-y-hidden">
        <h1 className="text-center mt-4 text-3xl font-bold">Admin Order Management</h1>
        {loading && (
            <p>Loading Orders...</p>
        )}

        {error && (
            <p>{error}</p>
        )}

        {!loading && !error && orders.length===0 && (
            <div className="flex justify-center items-center min-h-[90vh]">
                <p className="text-center text-green-950">No Orders to display...</p>
            </div>
        )}

        {!loading && !error && orders.length>0 && (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                {orders.map((order)=>(
                    <div key={order._id} className="bg-white p-8 m-8 rounded-lg shadow-lg">
                        <h2 className="text-center text-xl font-semibold border-b border-b-green-950">Order Details</h2>
                        <p className="mt-4"><span className="font-semibold">Order ID:</span>{order._id}</p>
                        <div className="mt-4">
                            <h3 className="font-bold">Buyer Details:</h3>
                            <p className="mt-2"><span className="font-semibold">Name:{" "}</span>{order.buyerId.name}</p>
                            <p className="mt-2"><span className="font-semibold">Email:{" "}</span>{order.buyerId.email}</p>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-bold">Product Details:</h3>
                            <p className="mt-2"><span className="font-semibold">Name:{" "}</span>{order.productId.name}</p>
                            <p className="mt-2"><span className="font-semibold">Category:{" "}</span>{order.productId.category}</p>
                            <p className="mt-2"><span className="font-semibold">Quantity:{" "}</span>{order.quantity}</p>
                            <p className="mt-2"><span className="font-semibold">Unit Price:{" "}</span>₹ {order.productId.price}</p>
                            <p className="mt-2"><span className="font-semibold">Total Price:{" "}</span>₹ {order.totalPrice}</p>
                        </div>
                        <div className="mt-4">
                            <p className="mt-2"><span className="font-semibold">Order Status:{" "}</span>{order.status}</p>
                            <p className="mt-2"><span className="font-semibold">Payment Status:{" "}</span><span className={`${order.paymentStatus==="PAID"?"text-green-700 bg-green-50 px-2 rounded-full":"text-black"}`}>{order.paymentStatus}</span></p>
                            <p className="mt-2"><span className="font-semibold">Order Creation Date:{" "}</span>{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                        </div>
                        <div className="mt-4">
                            <button onClick={()=>{setEditingOrderStatus(order);setStatus(order.status);setShowUpdateOrderModal(true)}} className="w-full bg-green-950 text-white p-2 hover:bg-green-800 cursor-pointer rounded-lg">Update Order Status</button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {isAuthenticated ?(
            <Navbar showLogin={false} showSignup={false} />
        ):(
            <Navbar/>
        )}
        {showUpdateOrderModal && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-white max-h-[90vh] w-96 rounded-lg p-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold">Admin Update Order Status</h1>
                        <button onClick={()=>setShowUpdateOrderModal(false)} className="text-red-950 hover:text-red-800 cursor-pointer">X</button>
                    </div>

                    {editingOrderStatus && (
                        <>
                        <p className="mt-4"><span className="font-semibold">Order ID:{" "}</span>{editingOrderStatus._id}</p>
                        <p className="mt-4"><span className="font-semibold">Current Status:{" "}</span>{editingOrderStatus.status}</p>
                        <select value={status} 
                        onChange={(e)=>setStatus(e.target.value)}
                        className="w-full border rounded-lg mt-4">
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <div className="mt-4">
                            <button onClick={()=>handleUpdateOrderStatus(editingOrderStatus._id)} className="w-full bg-blue-950 text-white p-2 rounded-lg hover:bg-blue-800 cursor-pointer">Save Changes</button>
                        </div>
                        </>
                    )}
                </div>
            </div>
        )}
    </main>
    </>
  )
}

export default AdminOrders