import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Table, Button, message, InputNumber, Input, Space } from "antd";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import { EditFilled } from "@ant-design/icons";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [room, setRoom] = useState([]);

  const dispatch = useDispatch();

  const getDoctors = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateRoomNumber = async (record, roomNo) => {
    try {
      console.log(record);
        dispatch(showLoading());
        const res = await axios.post("/api/v1/admin/updateRoomNumber",
        { doctorId: record._id,  roomNo: roomNo},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        dispatch(hideLoading());
        if (res.data.success) {
          message.success(res.data.message);
        }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    getDoctors();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          Dr. {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Contact Number",
      dataIndex: "phone",
    },
    {
      title: "Email Address",
      dataIndex: "email",
    },
    {
      title: "Available",
      dataIndex: "available",
      render: (text, record) => (
        <div>{record.available ? <span> Yes </span> : <span> No </span>}</div>
      ),
    },
    {
      title: "Schedule",
      dataIndex: "schedule",
      render: (text, record) => (
        <>
        {!record.schedule && (
          <Link className="text-blue-600 underline" to={`/admin/${record._id}/schedule`}> Add Schedule</Link>
        )}
        {record.schedule && (
          <Link className="text-blue-600 underline" to={`/admin/${record._id}/schedule`}> Update Schedule</Link>
        )}
        </>
      ),
    },
    {
      title: "Room Number",
      dataIndex: "roomNo",
      render: (text, record) => (
        <div>
          <span>
          <Space.Compact style={{width: '90%'}}>
            <InputNumber
              placeholder={`${record.roomNo}`}
              value={`${record.roomNo}`}
              onChange={setRoom}
            />
            <Button
              type="primary"
              className="text-indigo-600"
              onClick={() => updateRoomNumber(record, room)}
            >
              Update 
            </Button>
            </Space.Compact>
          </span>
        </div>
      ),
    }
  ];

  return (
    <Layout>
      <h1 className="text-center m-3">All Doctors</h1>
      <Link
        to="/admin/add-doctor"
        className="text-right duration-200 text-blue-600 underline"
      >
        Add Doctor
      </Link>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  );
};

export default Doctors;
