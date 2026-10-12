import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useState} from "react"
import { useAuth } from "../context/AuthContext";


const Login = () => {
  const [formData,setFormData]=useState({email:"",password:""});
  const {setUser}=useAuth();

  const navigate=useNavigate();

  const handleChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=event.target;
    setFormData({
      ...formData,
      [name]:value
    })
  }

  const handleSubmit=async(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    try{
      const res=await fetch(`http://localhost:5000/api/auth/login`,{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({email:formData.email,password:formData.password})
      })

      const data=await res.json();
      if(!res.ok){
        console.error(data.error);
      }

      console.log("Login Successful");
      setFormData({email:"",password:""});
      setUser(data.user);
      console.log("isAuthenticated has been set to true");
      navigate('/products')

    }catch(err){
      console.error(err);
    }
  }
  return (
    <>
    <title>AgroChain | Login</title>
    <Navbar showLogin={false} showSignup={false}/>
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="border py-8 px-8 w-96 bg-white shadow-lg rounded-lg">
        <h1 className="text-center font-bold text-3xl">Agro<span className="text-green-300">Chain</span></h1>
        <p className="text-center font-semibold mt-2">Sign in to your AgroChain Account</p>
        <form onSubmit={handleSubmit}>
          <div className="mt-2">
            <label htmlFor="email" className="font-semibold">Email</label>
            <input type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email here" 
            className="w-full p-2 border rounded-lg" required />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="font-semibold">Password</label>
            <input 
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password here" 
            className="w-full p-2 border rounded-lg"  required/>
          </div>
          <div className="mt-4">
            <button type='submit' className="w-full bg-green-900 p-2 rounded text-white hover:bg-green-800 cursor-pointer">Login</button>
          </div>
        </form>
        <p className="text-center mt-2">Don't have an account yet? <Link to="/register" className="text-green-600 underline">Click here to Sign Up</Link></p>
      </div>
    </div>
    </>

  )
}

export default Login