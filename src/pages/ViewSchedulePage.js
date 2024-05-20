import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Calendar,
} from "antd";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import LayoutHome from "./../components/Layout";
import dayjs from "dayjs";
import DoctorScheduleTable from "./DoctorScheduleTable";

const ViewSchedulePage = () => {
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [doctorsData, setDoctorData] = useState([]);
  const [schedulesData, setScheduleData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());


  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/user/getUserData",
        {},
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getAllDoctors = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        setDoctorData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAllSchedules = async () => {
    try {
      const res = await axios.get("/api/v1/user/getAllSchedule", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        setScheduleData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSelect = (value) => {
    setSelectedDate(value);
  };

const disabledDate = (current) => {
  const currentDate = dayjs(current).startOf('day');
  const hasSchedule = schedulesData.some((schedule) => {
    const scheduleStartDate = dayjs(schedule.date, "DD-MM-YYYY").startOf('day');
    const scheduleEndDate = dayjs(schedule.validTillDate, "DD-MM-YYYY").endOf('day');
    return currentDate >= scheduleStartDate && currentDate <= scheduleEndDate;
  });
  return !hasSchedule;
};


  useEffect(() => {
    getUserData();
    getAllDoctors();
    getAllSchedules();
  }, [selectedDate]);

  return (
    <LayoutHome>
      <h1>Doctor Schedule</h1>
      <div className="flex flex-row">
        <div>
        <DoctorScheduleTable doctors={doctorsData} schedules={schedulesData} selectedDate={selectedDate} />
        </div>
        <div className="ml-auto">
          <Calendar
            className="border w-72"
            fullscreen={false}
            onSelect={handleSelect}
            disabledDate={disabledDate}
          />
        </div>
      </div>
    </LayoutHome>
  );
};

export default ViewSchedulePage;
