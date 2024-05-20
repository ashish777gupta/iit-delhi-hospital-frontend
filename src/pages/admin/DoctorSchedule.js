import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import { useParams } from "react-router-dom";
import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  TimePicker,
  Checkbox,
  Calendar,
  message
} from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const DoctorSchedule = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [doctor, setDoctor] = useState([]);
  const [time, setTime] = useState([""]);
  const [date, setDate] = useState([""]);
  const [recurrence, setRecurrence] = useState("");
  const [duration, setDuration] = useState("");
  const [validTillDate, setValidTillDate] = useState("");

  const [selectedDays, setSelectedDays] = useState([]);
  const filteredOptions = WEEKDAYS.filter((o) => !selectedDays.includes(o));

  const [weekends, setWeekends] = useState([]);
  const weekendsOption = ["Saturday", "Sunday"];
  
  const onChangeRecurrence = (value) => {
    setRecurrence(value);
  };

  // eslint-disable-next-line arrow-body-style
  const disabledDate = (current) => {
    return current && current.startOf("day") < dayjs().startOf("day");
  };

  function validTill(dateString) {
    if(date === "") return "NotSelected"
    let currentDate = dayjs(dateString, 'DD-MM-YYYY');
    currentDate = currentDate.add(30, 'day');
    let newDate = currentDate.format('DD-MM-YYYY');
    return newDate;
  }

  function timeDuration(time1, time2) {
    const toMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const diffMinutes = Math.abs(toMinutes(time1) - toMinutes(time2));

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    setDuration(hours + " Hours, " + minutes + " Minutes");
    return hours + " Hours, " + minutes + " Minutes";
  }

  const handleFinish = async () => {
    dispatch(showLoading());
    const res = await axios.post(
      "/api/v1/admin/schedule",
      { id, date, time, recurrence, selectedDays, weekends, validTillDate },
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
  };

  const getDoctorSchedule = async () => {
    try {
      const res = await axios.post(
        "/api/v1/admin/getSchedule",
        { doctorId: id },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    getDoctorSchedule();
  }, []);

  useEffect(() => {
    setValidTillDate(validTill(date));
  }, [date]);


  return (
    <div>
      <Layout>
        <h1 className="text-xl font-semibold text-center">{`Dr. ${
          doctor.firstName + " " + doctor.lastName
        }`}</h1>
        <Form layout="vertical" className="my-5 p-2">
          {/* <Col xs={24} md={24} lg={4}>
          <Calendar />
          </Col>
          <Col> */}
          <Row gutter={40}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Select Date" name="date">
                <DatePicker
                  className="m-2"
                  format="DD-MM-YYYY"
                  disabledDate={disabledDate}
                  onChange={(value, valueString) => setDate(valueString)}
                />
                { validTill(date) !== "Invalid Date" && (
                <p className="text-blue-500">
                  The schedule will be valid till: {`${validTill(date)}`}
              </p>
              )}
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Availability"
                name="name"
                required
                rules={[{ required: true }]}
              >
                <TimePicker.RangePicker
                  format="HH:mm"
                  className="m-2"
                  use12Hours={true}
                  placeholder={["Available from", "Available to"]}
                  minuteStep={15}
                  onChange={(value, valueString) => {
                    setTime(valueString);
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={4}>
            </Col>
            <Col xs={24} md={24} lg={8}>
              {/* <Form.Item
                label="Recurrence"
                name="name"
              > */}
              <p className="mb-3">Recurrence</p>
              <Select
                onChange={onChangeRecurrence}
                value={recurrence}
                style={{ width: "100%" }}
                // placeholder="Select the recurrence of schedule"
                // required
                options={[
                  {
                    value: "daily",
                    label: "Daily",
                  },
                  {
                    value: "weekly",
                    label: "Weekly",
                  },
                  {
                    value: "monthly",
                    label: "Monthly",
                  },
                ]}
              />
              {/* </Form.Item> */}
              {recurrence === "daily" && (
                <p className="text-blue-500 ">
                  The schedule will be copied onto Monday, Tuesday, Wednesday,
                  Thursday, and Friday.
                </p>
              )}
            </Col>
            {recurrence === "weekly" && (
              <Col xs={24} md={24} lg={8}>
                <p className="mb-3">Select days</p>
                <Select
                  mode="multiple"
                  placeholder="Select the specific days of the week"
                  value={selectedDays}
                  onChange={setSelectedDays}
                  style={{
                    width: "100%",
                  }}
                  options={filteredOptions.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                />
              </Col>
            )}
            <Col xs={24} md={24} lg={8}>
              <p className="mb-3">Weekends</p>
              <Checkbox.Group
                className=""
                options={weekendsOption}
                onChange={setWeekends}
              />
            </Col>
            <Col xs={24} md={24} lg={8}></Col>
            <Col xs={24} md={24} lg={8}>
              <button
                className="btn btn-primary form-btn bg-blue-600 my-4"
                onClick={handleFinish}
              >
                Update Schedule
              </button>
            </Col>
          </Row>
        </Form>
      </Layout>
    </div>
  );
};

export default DoctorSchedule;
