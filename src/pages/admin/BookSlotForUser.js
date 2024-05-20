import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Button, message, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import Layout from "../../components/Layout";

const BookSlotForUser = () => {
  const navigate = useNavigate();

  const { userId, doctorId, scheduleId, date } = useParams();
  const [doctor, setDoctor] = useState([]);
  const [user, setUser] = useState([]);
  const [availabilityTime, setAvailabilityTime] = useState([]);
  const [bookedSlotTimes, setBookedSlotTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [confirmBooking, setConfirmBooking] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("FullDay");
  const [noSlotAvailable, setNoSlotAvailable] = useState(false);
  const [bookedAppointmentSlot, setBookedAppointmentSlot] = useState([]);

  const getUser = async () => {
    try {
      const res = await axios.post(
        "/api/v1/admin/getUser",
        { userId: userId },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      setUser(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  const getScheduleById = async () => {
    try {
      const res = await axios.post(
        "/api/v1/user/getScheduleById",
        { scheduleId: scheduleId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        const startTime = dayjs(res.data.data[0].time[0], "HH:mm");
        const endTime = dayjs(res.data.data[0].time[1], "HH:mm");

        const morningStart = dayjs("08:00", "HH:mm");
        const afternoonStart = dayjs("12:00", "HH:mm");
        const eveningStart = dayjs("16:00", "HH:mm");
        const nightStart = dayjs("20:00", "HH:mm");

        const times = {
          FullDay: [],
          Morning: [],
          Afternoon: [],
          Evening: [],
          Night: [],
        };

        let currentTime = startTime;

        while (currentTime.isBefore(endTime)) {
          if (date === dayjs().format("DD-MM-YYYY")) {
            if (currentTime.isAfter(dayjs())) {
              times.FullDay.push(currentTime.format("h:mm A"));
              if (currentTime.isBefore(afternoonStart)) {
                times.Morning.push(currentTime.format("h:mm A"));
              } else if (currentTime.isBefore(eveningStart)) {
                times.Afternoon.push(currentTime.format("h:mm A"));
              } else if (currentTime.isBefore(nightStart)) {
                times.Evening.push(currentTime.format("h:mm A"));
              } else {
                times.Night.push(currentTime.format("h:mm A"));
              }
            }
          } else {
            times.FullDay.push(currentTime.format("h:mm A"));
            if (currentTime.isBefore(afternoonStart)) {
              times.Morning.push(currentTime.format("h:mm A"));
            } else if (currentTime.isBefore(eveningStart)) {
              times.Afternoon.push(currentTime.format("h:mm A"));
            } else if (currentTime.isBefore(nightStart)) {
              times.Evening.push(currentTime.format("h:mm A"));
            } else {
              times.Night.push(currentTime.format("h:mm A"));
            }
          }
          currentTime = currentTime.add(15, "minutes");
        }
        setAvailabilityTime(times);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDoctor = async () => {
    try {
      const res = await axios.post(
        "/api/v1/user/getDoctor",
        { doctorId: doctorId },
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

  const getBookedAppointmentsByDate = async () => {
    try {
      const res = await axios.post(
        "/api/v1/user/bookedAppointmentsByDate",
        {
          doctorId: doctorId,
          date,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        const appointments = res.data.data;
        const slotTimes = appointments
          .filter((appointment) => appointment.queueNumber === 2)
          .map((appointment) => appointment.slotTime);
        console.log(slotTimes);
        setBookedSlotTimes(slotTimes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookAppointment = async () => {
    try {
      const res = await axios.post(
        "/api/v1/user/bookAppointment",
        {
          doctorId: doctorId,
          patientId: user._id,
          scheduleId: scheduleId,
          date,
          slotTime: selectedTime,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        message.success("Appointment Booked Successfully");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBookedAppointmentsBySchedule = async () => {
    try {
      const res = await axios.post(
        "/api/v1/user/getBookedAppointmentsBySchedule",
        {
          scheduleId,
          date,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setBookedAppointmentSlot(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
    getDoctor();
    getBookedAppointmentsByDate();
    getScheduleById();
    getBookedAppointmentsBySchedule();
  }, []);

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    setConfirmBooking(true);
  };

  const handleConfirmBooking = () => {
    handleBookAppointment();
  };

  const handlePeriodSelection = ({ key }) => {
    setSelectedPeriod(key);
  };

  const handleBack = () => {
    setSelectedTime(null);
    setConfirmBooking(false);
  };

  const renderTimeButtons = (times) => {
    return times.map((time) => {
      const bookedSlotCount = bookedAppointmentSlot.filter(
        (slot) => slot.slotTime === time
      ).length;
      return (
        <Button
          className={`relative mx-2 my-3 h-8 w-28 ${
            selectedTime === time ? "bg-blue-500 text-white" : "text-gray-700"
          }`}
          key={time}
          disabled={user.isAdmin ? false : bookedSlotTimes.includes(time)}
          onClick={() => handleTimeSelection(time)}
        >
          {time}
          {user.isAdmin && bookedSlotCount > 0 && (
            <span className="absolute top-0 right-0 bg-blue-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center mt-1 mr-1">
              {bookedSlotCount}
            </span>
          )}
        </Button>
      );
    });
  };

  const renderTimeButtonRows = () => {
    const times = availabilityTime[selectedPeriod];
    const rows = [];
    let currentRow = [];

    times.forEach((time, index) => {
      if (
        index > 0 &&
        dayjs(times[index - 1], "h:mm A").hour() !==
          dayjs(time, "h:mm A").hour()
      ) {
        rows.push(currentRow);
        currentRow = [];
      }
      currentRow.push(time);
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return (
      <div className="overflow-y-auto max-h-80">
        {rows.map((row, index) => (
          <div key={index} className="flex">
            {renderTimeButtons(row)}
          </div>
        ))}
      </div>
    );
  };

  const checkNoSlotsAvailable = () => {
    if (
      availabilityTime[selectedPeriod] &&
      availabilityTime[selectedPeriod].length === 0
    ) {
      setNoSlotAvailable(true);
    } else {
      setNoSlotAvailable(false);
    }
  };

  useEffect(() => {
    checkNoSlotsAvailable();
  }, [selectedPeriod, availabilityTime]);

  return (
    <div>
      <Layout>
        <h1 className="text-xl font-semibold text-center">{`Dr. ${
          doctor.firstName + " " + doctor.lastName
        }`}</h1>
        <h1 className="text-l text-gray-600 font-medium text-center">
          {doctor.specialization}
        </h1>
        <h1 className="text-l">Date: {date}</h1>
        <h1 className="text-l">Availability:</h1>
        {!selectedTime && (
          <div className="flex">
            <Dropdown
              overlay={
                <Menu onClick={handlePeriodSelection}>
                  {Object.entries(availabilityTime).map(([period, times]) => (
                    <Menu.Item key={period}>
                      <div className="flex justify-between">
                        <span>{period}</span>
                        <span>
                          &nbsp;&nbsp;&nbsp;&nbsp;{times[0]} -{" "}
                          {times[times.length - 1]}
                        </span>
                      </div>
                    </Menu.Item>
                  ))}
                </Menu>
              }
              trigger={["click"]}
            >
              <Button>
                {selectedPeriod} <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        )}

        {!selectedTime && !noSlotAvailable ? (
          availabilityTime[selectedPeriod] && renderTimeButtonRows()
        ) : (
          <p className="text-red-400 text-center">No slot is available.</p>
        )}
        {confirmBooking && (
          <div>
            <p>
              Are you sure you want to book the appointment for {selectedTime}?
            </p>
            <Button className="mr-3" type="dashed" onClick={handleBack}>
              Back
            </Button>
            <Button
              className="m-3 bg-blue-500 text-white"
              onClick={handleConfirmBooking}
            >
              Confirm & Book
            </Button>
          </div>
        )}
      </Layout>
    </div>
  );
};

export default BookSlotForUser;
