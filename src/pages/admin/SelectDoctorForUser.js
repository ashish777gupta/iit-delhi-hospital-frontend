import React, { useEffect, useState } from "react";
import LayoutHome from "../../components/Layout";
import axios from "axios";
import { Table, Calendar } from "antd";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import DoctorScheduleTable from "../DoctorScheduleTable";

const SelectDoctorForUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [doctorsData, setDoctorData] = useState([]);
  const [schedulesData, setScheduleData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const getUser = async () => {
    try {
      const res = await axios.post(
        "/api/v1/admin/getUser",
        { userId: id },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      setUser(res.data.data);
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
  };

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
  };

  const handleSelect = (value) => {
    setSelectedDate(value);
  };

  const disabledDate = (current) => {
    const currentDate = dayjs(current).startOf("day");
    const hasSchedule = schedulesData.some((schedule) => {
      const scheduleStartDate = dayjs(schedule.date, "DD-MM-YYYY").startOf(
        "day"
      );
      const scheduleEndDate = dayjs(schedule.validTillDate, "DD-MM-YYYY").endOf(
        "day"
      );
      return currentDate >= scheduleStartDate && currentDate <= scheduleEndDate;
    });
    return !hasSchedule;
  };

  useEffect(() => {
    getUser();
    getAllDoctors();
    getAllSchedules();
  }, [selectedDate]);

  return (
    <LayoutHome>
      <h1 className="text-center font-semibold text-lg">Select Doctor</h1>
      <h1>Selected user: {`${user.name}`}</h1>
      <div className="flex flex-row">
        <div>
          <DoctorScheduleTable
            doctors={doctorsData}
            schedules={schedulesData}
            selectedDate={selectedDate}
            user={user}
          />
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

export default SelectDoctorForUser;
