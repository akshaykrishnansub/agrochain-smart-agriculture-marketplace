import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useState } from "react"


const Register = () => {
  const [formData,setFormData]=useState({name:"",email:"",password:"",confirmPassword:""});

  const handleChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=event.target;
    setFormData({
      ...formData,
      [name]:value
    })
  }

  const handleSubmit=async(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    if(formData.password!==formData.confirmPassword){
      return;
    }
    console.log(formData);
    try{
      const res=await fetch(`http://localhost:5000/api/auth/register`,{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({name:formData.name,email:formData.email,password:formData.password})
      })

      const data=await res.json();
      if(!res.ok){
        console.log(data.error);
        return;
      }
      console.log("Registration Successful");
      setFormData({
        name:"",
        email:"",
        password:"",
        confirmPassword:""
      })
    }catch(err){
      console.error(err);
    }
  }

  return (
    <>
    <title>AgroChain | Register</title>
    <Navbar showLogin={false} showSignup={false} />
    <div className="flex justify-center items-center min-h-screen bg-green-50 mt-16">
      <div className="border w-96 px-8 py-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center">Agro<span className="text-green-300">Chain</span></h1>
        <p className="text-center mt-2">Create your Account and start sourcing smarter</p>
        <form onSubmit={handleSubmit}>
          <div className="mt-2">
          <label htmlFor="name" className="font-semibold">Name</label>
          <input name="name"
           type="text" 
           onChange={handleChange}
           value={formData.name}
           placeholder="Enter your name here" 
           className="w-full p-2 border rounded-lg" />
        </div>
        <div className="mt-4">
          <label htmlFor="email" className="font-semibold">Email</label>
          <input 
          name="email"
          type="email"
          onChange={handleChange}
          value={formData.email}
          placeholder="Enter your email here" 
          className="w-full p-2 border rounded-lg" />
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="font-semibold">Password</label>
          <input 
          type="password" 
          name="password"
          placeholder="Enter your email here" 
          onChange={handleChange}
          value={formData.password}
          className="w-full p-2 border rounded-lg" />
        </div>
        <div className="mt-4">
          <label htmlFor="confirmPassword" className="font-semibold">Confirm Password</label>
          <input 
          type="password" 
          name="confirmPassword"
          onChange={handleChange}
          value={formData.confirmPassword}
          placeholder="Confirm your password here" 
          className="w-full p-2 border rounded-lg" />
        </div>
        <div className="mt-4">
          <button className="w-full bg-green-900 p-2 rounded text-white hover:bg-green-800 cursor-pointer">Click here to Register</button>
        </div>
        </form>
        <p className="text-center mt-4">Already have an account? <Link to="/login" className="text-green-600 underline">Click here to Login</Link></p>
      </div>
    </div>
    </>
  )
}

export default Register