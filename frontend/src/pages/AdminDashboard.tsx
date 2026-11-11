import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";


interface UserStatistics{
    _id:string;
    totalUsers:number;
}

interface ProductStatistics{
    totalProducts:number;
    totalStock:number;
    averagePrice:number;
    minimumPrice:number;
    maximumPrice:number;
}

interface OrderStatistics{
    totalOrders:number;
    totalRevenue:number;
    averageOrderValue:number;
}

interface DashboardData{
    users:UserStatistics[];
    products:ProductStatistics[];
    orders:OrderStatistics[];
}

const AdminDashboard = () => {
    const [dashboardData,setDashboardData]=useState<DashboardData|null>(null);
    const [loading,setLoading]=useState<boolean>(true);
    const [error,setError]=useState<string>("");

    const {isAuthenticated}=useAuth()

    useEffect(()=>{
        const fetchDashboardData=async()=>{
            try{
                const res=await fetch(`http://localhost:5000/api/admin/dashboard`,{
                    method:"GET",
                    credentials:"include"
                })

                const data=await res.json();
                if(!res.ok){
                    throw new Error(data.message||"Failed to fetch dashboard data");
                }

                setDashboardData(data);
            }catch(err){
                setError("Unable to load dashboard data");
            }finally{
                setLoading(false);
            }
        }

        fetchDashboardData();
    },[]);

  return (
    <>
    <title>AgroChain | Admin Dashboard</title>
    <Navbar />
    <main className="min-h-screen pt-16 bg-green-50">
        <h1 className="text-center text-3xl mt-4 font-bold">Admin Dashboard</h1>
        
        {loading && (
            <p>Loading Admin Dashobard...</p>
        )}

        {!loading && error && (
            <p>{error}</p>
        )}

        {!loading && !error && dashboardData &&(
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
                <div className="bg-white p-8 m-8 shadow-lg rounded">
                    <h2 className="text-center font-semibold text-2xl">User Statistics</h2>
                    {dashboardData.users.map((user)=>(
                        <p className="mt-4"><span className="text-xl font-bold">{user._id}{" "}</span>:<span className="text-xl">{" "}{user.totalUsers}</span></p>
                    ))}
                </div>
                <div className="bg-white p-8 m-8 shadow-lg rounded">
                    <h2 className="text-center font-semibold text-2xl">Product Statistics</h2>
                    <p className="mt-4"><span className="text-xl font-bold">Total Products:{" "}</span>{dashboardData.products[0]?.totalProducts || 0}</p>
                    <p className="mt-2"><span className="text-xl font-bold">Average Price:{" "}</span>{dashboardData.products[0]?.averagePrice || 0}</p>
                    <p className="mt-2"><span className="text-xl font-bold">Total Stock:{" "}</span>{dashboardData.products[0]?.totalStock || 0}</p>
                    <p className="mt-2"><span className="text-xl font-bold">Maximum Price:{" "}</span>{dashboardData.products[0]?.maximumPrice || 0}</p>
                    <p className="mt-2"><span className="text-xl font-bold">Average Price:{" "}</span>{dashboardData.products[0]?.minimumPrice || 0}</p>
                </div>
                <div className="bg-white p-8 m-8 shadow-lg rounded">
                    <h2 className="text-center font-semibold text-2xl">Order Statistics</h2>
                    <p className="mt-4"><span className="text-xl font-bold">Average Order Value:{" "}</span>{dashboardData.orders[0]?.averageOrderValue || 0}</p>
                    <p className="mt-2"><span className="text-xl font-bold">Total Orders:{" "}</span>{dashboardData.orders[0]?.totalOrders || 0}</p>
                    <p className="mt-2"><span className="text-xl font-bold">Total Stock:{" "}</span>{dashboardData.orders[0]?.totalRevenue || 0}</p>
                </div>
            </div>
        )}

        {isAuthenticated ? (
            <Navbar showLogin={false} showSignup={false}/>
        ):(
            <Navbar/>
        )}
        
    </main>
    </>
  )
}

export default AdminDashboard