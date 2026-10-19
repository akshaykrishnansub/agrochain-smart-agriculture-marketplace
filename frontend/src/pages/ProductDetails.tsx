import { Link, useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Product{
   _id:string;
   name:string;
   description:string;
   price:number;
   images:string[];
   category:string;
   stock:number;
   certifications:string[];
   ownerId:string;
  }

const ProductDetails = () => {
  const {id}=useParams();

  //Authentication state
  const {isAuthenticated,loading:authLoading}=useAuth();
  const navigate=useNavigate();

  //Product State
  const [product,setProduct]=useState<Product | null>(null);
  const [loading,setLoading]=useState<boolean>(true);
  const [error,setError]=useState<string>("");
  const [quantity,setQuantity]=useState<number>(1);

  useEffect(()=>{
    const fetchProduct=async()=>{
      try{
        const res=await fetch(`http://localhost:5000/api/products/${id}`);
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
    if(id){
      fetchProduct();
    }else{
      setError("Product ID is missing");
      setLoading(false);
    }
  },[id]);

  //function to Place Order
  const handlePlaceOrder=()=>{
    if(authLoading) return;

    if(isAuthenticated){
      navigate("/orders",{
        state:{
          productId:product?._id,
          quantity:quantity
        }
      });
    }else{
      navigate("/login");
    }
  }

  //Increase quantity
  function increaseQuantity(){
    setQuantity(quantity+1);
  }

  //Decrease quantity
  function decreaseQuantity(){
    if(quantity>1){
      setQuantity(quantity-1);
    }
  }
  return (
    <>
    <title>AgroChain | Product Details</title>
    <Navbar/>
    <main className="bg-green-50 pt-20 min-h-screen">
      <Link to='/products' className="flex items-center gap-2 text-xl font-bold hover:text-green-800 underline px-4"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19L5 12L12 5" /></svg>Back to Marketplace</Link>
      {loading && (
        <p>Loading Products....</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {!loading && !error && product && (
        <div className="grid lg:grid-cols-2">
          <div>
            {product.images[0]?(
            <div className="mt-4 p-8">
              <img src={product.images[0]} alt={product.name} className="h-150 w-200"/>
            </div>
          ):(
            <div>
              <p>No Image Available...</p>
            </div>
          )}
          </div>
          <div className="p-12">
            <h1 className="text-3xl font-bold">Product Details</h1>
            <p className="mt-4 text-xl"><span className="text-2xl font-semibold">Product Name:{" "}</span>{product.name}</p>
            <p className="mt-4 text-xl"><span className="text-2xl font-semibold">Product Description:{" "}</span>{product.description}</p>
            <p className="mt-4 text-xl"><span className="text-2xl font-semibold">Product Category:{" "}</span>{product.category}</p>
            <p className="mt-4 text-xl"><span className="text-2xl font-semibold">Product Price: ₹ {" "}</span>{product.price}</p>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-xl font-semibold">
                Quantity:
              </span>
              <button type="button" disabled={quantity<=1} onClick={decreaseQuantity} className="bg-blue-900 text-white font-bold p-2 disabled:opacity-50">-</button>
              <p>{quantity}</p>
              <button type="button" disabled={quantity>=product.stock} onClick={increaseQuantity} className="bg-blue-900 text-white font-bold p-2 disabled:opacity-50">+</button>
            </div>
            <button onClick={handlePlaceOrder} className="bg-blue-950 text-white font-bold p-2 rounded-lg mt-5">Place Order</button>
          </div>
        </div>
      )}
      {isAuthenticated ? (
        <Navbar showLogin={false} showSignup={false}/>
      ):(<Navbar />)}
    </main>
    </>
  )
}

export default ProductDetails