import React, { useEffect, useState } from "react";
import {
  Col,
  Form,
  Input,
  Row,
  DatePicker,
  Radio,
  Select,
  message,
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

import Layout from "../components/Layout";

const Profile = () => {
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [category, setCategory] = useState("");

  const dobValue = (date, dateString) => {
    setDob(dateString);
  };

  const getGender = (e) => {
    setGender(e.target.value);
  };

  const onChangeCategory = (value) => {
    setCategory(value);
  };

  const onFinishHandle = async (values) => {
    values.dob = dob;
    values.gender = gender;
    values.userType = category;
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/register", values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Register Successfully!");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/admin/add-doctor",
        { ...values },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/admin/doctors");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Somthing Went Wrrong ");
    }
  };

  const getUserProfile = async () => {
    try {
      const res = await axios.post(
        "/api/v1/user/profile",
        {userId: user},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        const userProfile = res.data.data;
        setName(userProfile.name);
        setPhoneNumber(userProfile.phoneNumber)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);
  return (
    <Layout>
      <h1 className="text-center text-xl font-bold">Update Profile</h1>
      <Form layout="vertical" onFinish={handleFinish} className="m-3">
        <h4 className="text-lg font-medium mt-4 mb-2">Personal Details : </h4>
        <Row gutter={20}>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Full Name"
              name="name"
              value={name}
              required
              rules={[{ required: true }]}
            >
              <Input type="text"  value={name}/>
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item label="Email Id" name="emailId">
              <Input type="text" placeholder="Enter email address" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Phone Number"
              name="phone"
              defaultValue={phoneNumber}
            //   required
            //   rules={[{ required: true }]}
            >
                {/* <label className="my-2"><span className="text-red-500 text-l">*</span>Phone Number</label> */}
              <Input type="text" readOnly placeholder="Contact number" defaultValue={phoneNumber}/>
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Address"
              name="address"
              required
              rules={[{ required: true }]}
            >
              <Input type="text" placeholder="Enter address" />
            </Form.Item>
          </Col>

          <Col xs={24} md={24} lg={8}>
            <Form.Item label="Select the User Type" required>
              <Select
                onChange={onChangeCategory}
                value={category}
                required
                options={[
                  {
                    value: "student",
                    label: "IIT Delhi Student",
                  },
                  {
                    value: "professor",
                    label: "IIT Delhi Professor",
                  },
                  {
                    value: "staff",
                    label: "IIT Delhi Staff",
                  },
                  {
                    value: "visitor",
                    label: "Visitor (Non IIT Delhi User)",
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col xs={24} md={24} lg={8}>
            <Form.Item label="Gender" required>
              <Radio.Group onChange={getGender} value={gender} required>
                <Radio value={"male"}> Male </Radio>
                <Radio value={"female"}> Female </Radio>
                <Radio value={"trans"}> Prefered not say </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col xs={24} md={24} lg={8}>
            <Form.Item label="Date of Birth">
              <DatePicker
              // required
              // onChange={dobValue}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={24} lg={12}></Col>
          <Col xs={24} md={24} lg={12}></Col>
          <Col xs={24} md={12} lg={8}>
            <button
              className="btn btn-primary form-btn bg-blue-600"
              type="submit"
            >
              Update
            </button>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default Profile;
