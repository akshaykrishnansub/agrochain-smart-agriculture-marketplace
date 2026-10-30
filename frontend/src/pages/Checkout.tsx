import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

interface Product{
  _id:string;
  name:string;
  description:string;
  category:string;
  price:number;
  images:string[];
  certifications:string[];
  stock:number;
  ownerId:string;
}

const Checkout = () => {
  const location=useLocation();
  const navigate=useNavigate();

  const [searchParams]=useSearchParams();
  const payment=searchParams.get("payment");
  const sessionId=searchParams.get("session_id");
  const [paymentReturnStatus,setPaymentReturnStatus]=useState<"none"|"verifying"|"success"|"cancelled"|"pending"|"failed">("none")

  const {productId:stateProductId,quantity:stateQuantity}=location.state||{};
  const productId=stateProductId||searchParams.get("productId");
  const quantity=Number(stateQuantity||searchParams.get("quantity"));
  const [product,setProduct]=useState<Product|null>(null);
  const [loading,setLoading]=useState<boolean>(true);
  const [error,setError]=useState<string>("");
  const {isAuthenticated}=useAuth();

  //payment states
  const [paymentLoading,setPaymentLoading]=useState<boolean>(false);
  const [paymentError,setPaymentError]=useState<string>("");

  useEffect(()=>{
    //Handle return from stripe after payment
    if(payment==="success" && sessionId){
      const verifyPayment=async()=>{
        setPaymentReturnStatus("verifying");
        setError("");
        setLoading(false);

        try{
          const res=await fetch(`http://localhost:5000/api/orders`,{
            credentials:"include"
          });
          
          const data=await res.json();
          if(!res.ok){
            throw new Error("Unable to verify payment");
          }
          const matchingOrder=data.orders.find((order:{stripeSessionId?:string;paymentStatus?:string})=>order.stripeSessionId===sessionId && order.paymentStatus==="PAID");
          if(matchingOrder){
            setPaymentReturnStatus("success");
          }else{
            setPaymentReturnStatus("pending");
          }
        }catch(err){
          console.error("Payment verification failed",err);
          setPaymentReturnStatus("failed");
        }
      }
      verifyPayment();
      return;
    }

    //Handle a cancelled stripe checkout session
    if(payment==="cancelled"){
      setPaymentReturnStatus("cancelled");
      setLoading(false);
      return;
    }

    //Checkout flow
    if(!productId || !quantity || quantity<1){
      setError("Checkout details are missing...Please select a product again");
      setLoading(false);
      return;
    }
    const fetchProduct=async()=>{
      try{
        const res=await fetch(`http://localhost:5000/api/products/${productId}`);
        const data=await res.json();
        if(!res.ok){
          console.error(data.error);
        }
        setProduct(data.product);
      }catch(err){
        console.error(err);
      }finally{
        setLoading(false);
      }
    }
    fetchProduct();
  },[productId,quantity,payment,sessionId])

  const handlePayNow=async()=>{
    console.log("Checkout values:", { productId, quantity });
    if(!productId||!quantity||quantity<1){
      setPaymentError("Checkout details are missing. Please select a product again");
      return;
    }

    setPaymentLoading(true);
    setPaymentError("");

    try{
      const res=await fetch(`http://localhost:5000/api/orders/checkout-session`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        credentials:"include",
        body:JSON.stringify({productId,quantity})
      });

      const data=await res.json();
      if(!res.ok){
        throw new Error(data.message ||"Unable to start payment");
      }

      if(!data.url){
        throw new Error("Stripe Checkout URL was not returned");
      }

      window.location.href=data.url;
    }catch(err){
      console.error("Something went wrong",err)
    }finally{
      setPaymentLoading(false);
    }
  }


  return (
    <>
    <title>AgroChain | Checkout</title>
    <Navbar/>
    <main className="min-h-screen bg-green-50 pt-16">
      <h1 className="text-center mt-4 text-3xl font-bold">Payment Summary</h1>

      {paymentReturnStatus==="verifying" && (
        <p className="mt-6 text-center">Verifying your payment...</p>
      )}

      {paymentReturnStatus==="success" && (
        <div className="bg-white mx-auto mt-8 max-w-lg rounded-lg p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-green-900">Payment Successful</h2>
          <p className="mt-4 font-semibold">Your payment has been verified and your order has been confirmed</p>
          <button onClick={()=>navigate("/my-orders")} className="mt-4 rounded bg-blue-950 p-2 text-white hover:bg-blue-800 cursor-pointer">View My Orders</button>
        </div>
      )}

      {paymentReturnStatus==="pending" && (
        <div className="mt-8 text-center">
          <p>Your payment was completed, but your order was not confirmed.</p>
          <p className="mt-2">Please check My Orders in a moment</p>
          <button onClick={()=>navigate("/my-orders")} className="mt-4 rounded bg-blue-950 p-2 text-white hover:bg-blue-800 cursor-pointer">View My Orders</button>
        </div>
      )}

      {paymentReturnStatus==="cancelled" && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold">Payment Cancelled</h2>
          <p className="mt-2">Your checkout was cancelled.</p>
          <button onClick={()=>navigate("/orders",{state:{productId,quantity}})} className="mt-4 rounded bg-blue-950 p-2 text-white hover:bg-blue-800 cursor-pointer">Back to Orders</button>
        </div>
      )}

      {paymentReturnStatus==="failed" && (
        <div className="mt-8 text-center">
          <p>We couldn't verify your payment right now.</p>
          <button onClick={()=>navigate("/my-orders")} className="mt-4 rounded bg-blue-950 text-white hover:bg-blue-800 cursor-pointer">View My Orders</button>
        </div>
      )}
      
      {loading && (
        <p>Loading checkout details...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {!loading && !error && product && (
        <div className="grid lg:grid-cols-2">
          <div className="p-12">
            {product.images[0]?(
              <div>
                <img src={product.images[0]} alt={product.name} className="w-200 h-150 rounded-lg" />
              </div>
            ):(<div>
              <p>No Image Available...</p>
            </div>)}
          </div>
          <div className="p-12 bg-white m-12 border rounded-lg">
            <h2 className="text-center text-2xl font-bold">Payment Details</h2>
            <div className="text-center">
              <p className="mt-4 text-xl"><span className="font-semibold text-2xl">Product Name:{" "}</span>{product.name}</p>
              <p className="mt-4 text-xl"><span className="font-semibold text-2xl">Product Category:{" "}</span>{product.category}</p>
              <p className="mt-4 text-xl"><span className="font-semibold text-2xl">Price of a single unit:{" "}</span>₹ {product.price}</p>
              <p className="mt-4 text-xl"><span className="font-semibold text-2xl">Quantity:{" "}</span>{quantity}</p>
              <p className="mt-4 text-xl"><span className="font-semibold text-2xl">Total Price:{" "}</span>₹ {product.price*quantity}</p>
            </div>
            <div className="flex justify-center mt-4 gap-3">
              <button className="bg-blue-950 text-white p-2" onClick={()=>navigate("/orders",{state:{productId,quantity}})}>Back to Orders Page</button>
              <button className="bg-green-950 text-white p-2" onClick={handlePayNow} disabled={paymentLoading}>Pay Now</button>
            </div>
            {paymentError && (
              <p className="mt-4 text-center text-red-600">{paymentError}</p>
            )}
          </div>
        </div>
      )}

      {isAuthenticated ?(
        <Navbar showLogin={false} showSignup={false}/>
      ):(
        <Navbar />
      )}
    </main>
    </>
  )
}

export default Checkout