import React, { useState } from "react";
import {
  Button,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
  message
} from "antd";
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { UseDispatch, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const Register = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [category, setCategory] = useState("");

  const dobValue = (date, dateString) => {
    setDob(dateString);
  };

  const getGender = (e) => {
    setGender(e.target.value);
  }

  const onChangeCategory = (value) => {
    setCategory(value);
  }

  const onFinishHandle = async (values) => {
    values.dob = dob;
    values.gender = gender;
    values.userType = category;
    try {
      dispatch(showLoading())
      const res = await axios.post('/api/v1/user/register', values)
      dispatch(hideLoading())
      if(res.data.success){
        message.success("Register Successfully!")
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading())
      console.log(error);
      message.error("Something went wrong");
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

            <div class="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div class="text-gray-600">
                  <p class="font-medium text-lg">Personal Details</p>
                  <p>Please fill out all the fields.</p>
                  <p className="my-4">
                    <Link to="/login" className="text-indigo-600 underline ">Already have an account (login)</Link>
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
                        
                        <Form.Item  label="Full Name" name="name" required>
                          <Input type="text" required />
                        </Form.Item>
                        
                        {/* <Form.Item label="Email" name="email" required>
                          <Input type="email" required />
                        </Form.Item> */}

                        <Form.Item label="Phone Number" name="phoneNumber" required>
                          <Input type="number" required />
                        </Form.Item>

                        <Form.Item label="Password" name="password" required>
                          <Input type="password" required />
                        </Form.Item>

                        <Form.Item label="Confirm Password" name="confirmPassword" required>
                          <Input type="password" required />
                        </Form.Item>

                        {/* <Form.Item label="Date of Birth" required>
                          <DatePicker required 
                            onChange={dobValue}
                          />
                        </Form.Item>

                        
                        <Form.Item label="Gender" required >
                          <Radio.Group onChange={getGender} value={gender} required>
                            <Radio value={"male"}> Male </Radio>
                            <Radio value={"female"}> Female </Radio>
                            <Radio value={"trans"}> Prefered not say </Radio>
                          </Radio.Group>
                        </Form.Item>

                        <Form.Item label="Select the User Type" required>
                          <Select onChange={onChangeCategory} value={category} required 
                          options ={[
                            {
                              value: 'student',
                              label: 'IIT Delhi Student'
                            },
                            {
                              value: 'professor',
                              label: 'IIT Delhi Professor'
                            },
                            {
                              value: 'visitor',
                              label: 'Visitor (Non IIT Delhi User)'
                            },
                          ]}
                          />
                            
                        </Form.Item>

                        {category === "visitor" && (
                        <p className="text-red-400 -mt-6 mb-4 mx-2">
                          You have to pay ₹50 INR for the appointment
                        </p>
                        )}


                        <Form.Item label="Blood Group" name="bloogGroup" >
                          <Input type="text" />
                        </Form.Item> */}

                        <button className="btn btn-primary text-indigo-600" type="submit">Register</button>
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
export default Register;
