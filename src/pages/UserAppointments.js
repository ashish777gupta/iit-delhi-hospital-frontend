import React, { useEffect, useState } from "react";
import LayoutHome from "../components/Layout";
import { useSelector } from "react-redux";
import { Table } from "antd";
import axios from "axios";

const UserAppointments = () => {
  const { user } = useSelector((state) => state.user);

  const [appointmentsData, setAppointmentsData] = useState([]);
  const [doctorDetailsFetched, setDoctorDetailsFetched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserAppointments = async () => {
      try {
        const res = await axios.post(
          "/api/v1/user/getUserAppointments",
          { appointmentIds: user.appointmentId },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        if (res.data.success) {
          setAppointmentsData(res.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUserAppointments();
  }, [user]);

  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "doctorName",
      key: "doctorName",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Appointment Time",
      dataIndex: "slotTime",
      key: "slotTime",
      sorter: (a, b) => {
        const timeA = convertTo24HourFormat(a.slotTime);
        const timeB = convertTo24HourFormat(b.slotTime);
        return timeA.localeCompare(timeB);
      },
    },
    {
      title: "Checked in or not",
      dataIndex: "checkIn",
      key: "checkIn",
      render: (checkedIn) => (checkedIn ? "Checked in" : "Not checked in"),
    },
  ];

  const convertTo24HourFormat = (time) => {
    const [timePart, ampm] = time.split(" ");
    const [hours, minutes] = timePart.split(":").map(Number);
    const hours24 = (ampm === "PM" && hours < 12 ? hours + 12 : hours) % 24;
    return `${hours24.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const fetchDataForAppointment = async (appointment) => {
    try {
      const res = await axios.post(
        "/api/v1/user/getDoctorsById",
        { doctorId: appointment.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        console.log(res.data);
        return {
          ...appointment,
          doctorName:
            "Dr. " + res.data.data.firstName + " " + res.data.data.lastName,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPatientDetails = async () => {
      const reversedAppointmentsData = appointmentsData.reverse();
      const updatedAppointmentsData = await Promise.all(
        reversedAppointmentsData.map(
          async (appointment) => await fetchDataForAppointment(appointment)
        )
      );
      console.log(updatedAppointmentsData);
      setAppointmentsData(updatedAppointmentsData);
      setDoctorDetailsFetched(true);
    };

    if (appointmentsData.length > 0 && !doctorDetailsFetched) {
      fetchPatientDetails();
    }
  }, [appointmentsData, doctorDetailsFetched]);

  return (
    <LayoutHome>
      <h1 className="text-center text-xl font-bold m-4">Booked appointments</h1>
      <Table
        columns={columns}
        dataSource={appointmentsData}
        loading={loading}
        pagination={false}
      />
    </LayoutHome>
  );
};

export default UserAppointments;
