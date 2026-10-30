import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps{
  children:React.ReactNode;
  allowedRoles?:("buyer"|"supplier"|"farmer"|"admin")[];
}

const ProtectedRoute = ({children,allowedRoles}:ProtectedRouteProps) => {
  const {user,isAuthenticated,loading}=useAuth();
  const navigate=useNavigate();

  useEffect(()=>{
    if(loading){
      return;
    }

    if(!isAuthenticated){
      navigate("/login",{replace:true});
      return;
    }

    if(allowedRoles && (!user || !allowedRoles.includes(user.role))){
      navigate("/",{replace:true});
    }
  },[loading,isAuthenticated,navigate,user,allowedRoles])

  if(loading){
    return <div>Loading...</div>
  }

  if(!isAuthenticated){
    return null;
  }

  if(allowedRoles && (!user || !allowedRoles.includes(user.role))){
    return null;
  }

  return children
}

export default ProtectedRoute