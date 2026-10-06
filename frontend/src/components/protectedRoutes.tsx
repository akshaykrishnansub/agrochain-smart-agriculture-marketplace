import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';

const protectedRoutes = () => {
  const {isAuthenticated,loading}=useAuth();
  const navigate=useNavigate();

  useEffect(()=>{
    if(!loading && !isAuthenticated){
      navigate("/login",{replace:true});
    }
  },[loading,isAuthenticated,navigate])

  if(loading){
    return <div>Loading...</div>
  }

  if(!isAuthenticated){
    return null;
  }

  return <Outlet />
}

export default protectedRoutes