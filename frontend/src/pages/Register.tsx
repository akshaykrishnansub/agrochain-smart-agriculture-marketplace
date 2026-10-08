import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"


const Register = () => {
  return (
    <>
    <title>AgroChain | Register</title>
    <Navbar showLogin={false} showSignup={false} />
    <div className="flex justify-center items-center min-h-screen bg-green-50 mt-16">
      <div className="border w-96 px-8 py-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center">Agro<span className="text-green-300">Chain</span></h1>
        <p className="text-center mt-2">Create your Account and start sourcing smarter</p>
        <form action="">
          <div className="mt-2">
          <label htmlFor="name" className="font-semibold">Name</label>
          <input type="text" placeholder="Enter your name here" className="w-full p-2 border rounded-lg" />
        </div>
        <div className="mt-4">
          <label htmlFor="email" className="font-semibold">Email</label>
          <input type="text" placeholder="Enter your email here" className="w-full p-2 border rounded-lg" />
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="font-semibold">Password</label>
          <input type="password" placeholder="Enter your email here" className="w-full p-2 border rounded-lg" />
        </div>
        <div className="mt-4">
          <label htmlFor="confirmPassword" className="font-semibold">Confirm Password</label>
          <input type="password" placeholder="Confirm your password here" className="w-full p-2 border rounded-lg" />
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