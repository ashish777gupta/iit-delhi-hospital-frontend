import React from 'react'
import {useSelector, useDispatch} from "react-redux"
import LayoutHome from '../../components/Layout';
import DoctorLayoutHome from '../../components/DoctorLayout';

const DoctorDashboard = () => {
    const {doctor} = useSelector(state => state.doctor);


    return (
        <DoctorLayoutHome>
        <div>DoctorDashboard</div>
        </DoctorLayoutHome>
    )
}

export default DoctorDashboard;