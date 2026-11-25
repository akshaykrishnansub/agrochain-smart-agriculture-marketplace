import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

interface GuestRouteProps{
    children:React.ReactNode;
}

const GuestRoute=({children}:GuestRouteProps)=>{
    const {isAuthenticated,loading}=useAuth();
    const navigate=useNavigate();

    useEffect(()=>{
        if(loading){
            return;
        }

        if(isAuthenticated){
            navigate("/",{replace:true});
        }
    },[loading,isAuthenticated,navigate]);

    if(loading){
        return <div>Loading...</div>
    }

    if(isAuthenticated){
        return null;
    }

    return children;
}

export default GuestRoute