import React, { useState } from "react";
import {
  Form,
  Input,
  message
} from "antd";
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";


const DoctorLogin = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinishHandle = async (values) => {
    // console.log(values);
    try {
      dispatch(showLoading())
      const res = await axios.post("/api/v1/doctor/doctor-login", values);
      window.location.reload();
      dispatch(hideLoading())
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");
        navigate("/doctor-dashboard");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading())
      console.log(error);
      message.error("something went wrong");
    }
  }

  return (
    <>
      <div class="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div class="container max-w-screen-lg mx-auto">
          <div>
            <h2 class="font-semibold text-xl text-gray-600">
              IIT Delhi | Hospital
            </h2>
            <p class="text-gray-500 mb-6">भारतीय प्रौद्योगिकी संस्थान दिल्ली</p>

            <div class="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 border-t-8 border-indigo-700">
              <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div class="text-gray-600">
                  <p class="font-medium text-lg">Doctor Login</p>
                  <p>Please fill out all the fields correctly.</p>
                  <p className="mt-4">
                    <Link to="/register" className="text-indigo-600 underline ">Not a user? (Register)</Link>
                  </p>
                  <p className="mt-2">
                    <Link to="/login" className="text-indigo-600 underline ">Are you a User? (Login)</Link>
                  </p>
                  <p className="mt-2">
                    <Link to="/doctor-login" className="text-indigo-600 underline ">Are you a Doctor? (Doctor Login)</Link>
                  </p>
                </div>
                <div class="lg:col-span-2">
                  <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5 content-start">
                    <div class="md:col-span-5 content-start">
                      <Form
                        labelRow={{
                          span: 4,
                        }}
                        wrapperCol={{
                          span: 14,
                        }}
                        layout="vertical"
                        style={{
                          maxWidth: 600,
                        }} 
                        onFinish={onFinishHandle}
                      >

                        <Form.Item label="Phone Number" name="phoneNumber" >
                          <Input type="number" required />
                        </Form.Item>

                        <Form.Item label="Password" name="password" >
                          <Input type="password" required />
                        </Form.Item>

                        <button className="btn btn-primary text-indigo-600" type="submit">Login</button>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DoctorLogin;
