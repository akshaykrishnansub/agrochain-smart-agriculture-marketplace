import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"


const Login = () => {
  return (
    <>
    <title>AgroChain | Login</title>
    <Navbar showLogin={false} showSignup={false}/>
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="border py-8 px-8 w-96 bg-white shadow-lg rounded-lg">
        <h1 className="text-center font-bold text-3xl">Agro<span className="text-green-300">Chain</span></h1>
        <p className="text-center font-semibold mt-2">Sign in to your AgroChain Account</p>
        <form action="">
          <div className="mt-2">
            <label htmlFor="email" className="font-semibold">Email</label>
            <input type="text" placeholder="Enter your email here" className="w-full p-2 border rounded-lg" />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="font-semibold">Password</label>
            <input type="password" placeholder="Enter your password here" className="w-full p-2 border rounded-lg" />
          </div>
          <div className="mt-4">
            <button className="w-full bg-green-900 p-2 rounded text-white hover:bg-green-800 cursor-pointer">Login</button>
          </div>
        </form>
        <p className="text-center mt-2">Don't have an account yet? <Link to="/register" className="text-green-600 underline">Click here to Sign Up</Link></p>
      </div>
    </div>
    </>

  )
}

export default Login