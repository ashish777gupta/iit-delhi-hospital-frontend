import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DoctorLayoutHome from "../../components/DoctorLayout";
import { Table } from "antd";
import axios from "axios";

const TodaysAppointment = () => {
  const { doctor } = useSelector((state) => state.doctor);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientDetailsFetched, setPatientDetailsFetched] = useState(false);

  useEffect(() => {
    const getTodayAppointments = async () => {
      try {
        const res = await axios.post(
          "/api/v1/doctor/getTodayAppointments",
          { appointmentIds: doctor.appointmentId },
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

    getTodayAppointments();
  }, [doctor]);

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Appointment Time",
      dataIndex: "slotTime",
      key: "slotTime",
    },
    {
      title: "Queue Number",
      dataIndex: "queueNumber",
      key: "queueNumber",
    },
    {
      title: "Checked in or not",
      dataIndex: "checkIn",
      key: "checkIn",
      render: (checkedIn) => (checkedIn ? "Checked in" : "Not checked in"),
    },
  ];

  const fetchDataForAppointment = async (appointment) => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getPatientsById",
        { patientId: appointment.patientId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        return {
          ...appointment,
          patientName: res.data.data.name,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPatientDetails = async () => {
      const updatedAppointmentsData = await Promise.all(
        appointmentsData.map(
          async (appointment) => await fetchDataForAppointment(appointment)
        )
      );
      console.log(updatedAppointmentsData);
      setAppointmentsData(updatedAppointmentsData);
      setPatientDetailsFetched(true);
    };

    if (appointmentsData.length > 0 && !patientDetailsFetched) {
      fetchPatientDetails();
    }
  }, [appointmentsData, patientDetailsFetched]);

  return (
    <DoctorLayoutHome>
      <Table
        columns={columns}
        dataSource={appointmentsData}
        loading={loading}
        pagination={false}
      />
    </DoctorLayoutHome>
  );
};

export default TodaysAppointment;
