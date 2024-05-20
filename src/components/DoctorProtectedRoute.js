/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom"; 
import {useSelector, useDispatch} from "react-redux"
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { setDoctor } from "../redux/features/doctorSlice";

export default function DoctorProtectedRoute({children}) {
    const dispatch = useDispatch();
    console.log(useSelector(state => state));
    const {doctor} = useSelector(state => state.doctor);
    // console.log("doctor");
    // console.log(doctor);

    const getDoctor = async() => {
        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/doctor/getDoctorData', {
                token : localStorage.getItem('token')
            }, {
                headers : {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            }
            )
            dispatch(hideLoading())
            if (res.data.success) {
                dispatch(setDoctor(res.data.data));
              } else {
                localStorage.clear();
                <Navigate to="/doctor-login" />;
              }
        } catch (error) {
            localStorage.clear();
            dispatch(hideLoading());
            console.log(error);
        }
    };

    useEffect(() => {
    if (!doctor) {
      getDoctor();
    }
  }, [doctor, getDoctor]);

    if(localStorage.getItem("token")) {
        return children;
    } else {
        return <Navigate to ="/doctor-login" />
    }
}