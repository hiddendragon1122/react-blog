import { Navigate } from "react-router-dom";
import { getToken } from "../utils/token";

//if token exist ? render : redirect to login
function AuthComponent ({ children }){
    const isToken = getToken
    if(isToken){
        return <>{children}</>
    }else{
        return <Navigate to='/login' replace/>
    }
}

export {
    AuthComponent
}