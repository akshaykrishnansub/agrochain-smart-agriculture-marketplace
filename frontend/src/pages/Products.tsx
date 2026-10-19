import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom";
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



const Products = () => {
  const [products,setProducts]=useState<Product[]>([]);
  const [loading,setLoading]=useState<boolean>(true);
  const [error,setError]=useState<string>("");

  const {isAuthenticated}=useAuth();
  const navigate=useNavigate();
  
  useEffect(()=>{
  const fetchProducts=async()=>{
    try{
      const res=await fetch(`http://localhost:5000/api/products`);
      const data=await res.json();
      if(!res.ok){
        console.error(data.error);
      }
      setProducts(data.products);
    }catch(err){
      console.error(err);
      setError("Unable to load products.. Try again")
    }finally{
      setLoading(false);
    }
  }
  fetchProducts();
},[])

  return (
    <>
    <title>AgroChain | Products</title>
    <Navbar/>
    <main className="min-h-screen bg-green-50 px-6 py-8 mt-16">
      <h1 className="text-3xl font-bold text-center text-green-950">AgroChain Marketplace</h1>
      <p className="text-center text-green-900 mt-2">Discover fresh agricultural products from farmers and suppliers</p>
      {loading && (
        <p className="text-center mt-10 text-red-900">Loading Products....</p>
      )}

      {error && (
        <p className="text-center mt-10 text-red-600">{error}</p>
      )}

      {!loading && !error && products.length===0 &&(
        <p className="text-center mt-10 text-gray-600">No Products are available yet.</p>
      )}

      {!loading && !error && products.length>0 && (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 mt-4 gap-2">
          {products.map((product)=>(
            <div key={product._id} className="bg-white rounded-lg border border-green-200 shadow-sm">
              <div>
                {product.images[0]?(
                  <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
                ):(<div className="w-full h-48 flex justify-center items-center text-green-800">No Images available...</div>)}
                <div className="p-4">
                  <h2 className="text-xl font-bold text-green-950 mt-1">{product.name}</h2>
                  <p className="text-2xl font-bold text-green-800 mt-4">₹ {product.price}</p>
                </div>
              </div>
              <div className="flex justify-center">
                <button onClick={()=>navigate(`/products/${product._id}`)} className="p-2 m-2 w-full rounded-lg bg-blue-900 hover:bg-blue-800 cursor-pointer text-white">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {isAuthenticated ? (
        <Navbar showLogin={false} showSignup={false}/>
      ):(<Navbar />)}
    </main>
    </>
  )
}

export default Products