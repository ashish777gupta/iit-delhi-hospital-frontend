import {React} from 'react';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
    if(localStorage.getItem('token')){
        if(children.type.name === "Login")
            return <Navigate to="/" />
        else return <Navigate to="/doctor-dashboard" />
    } else {
        return children;
    }
}