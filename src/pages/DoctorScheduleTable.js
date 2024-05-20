import React from "react";
import { Table } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const DoctorScheduleTable = ({ doctors, schedules, selectedDate, user }) => {
  const disabledDates = [];
  const filteredDoctors = doctors.filter((doctor) =>
    schedules.find((schedule) => {
      const scheduleDate = dayjs(schedule.date, "DD-MM-YYYY");
      const validTillDate = dayjs(schedule.validTillDate, "DD-MM-YYYY");
      const selectedDateFormat = selectedDate.format("MM-DD-YYYY");
      
      if (
        schedule.doctorId === doctor._id &&
        scheduleDate.format("MM-DD-YYYY") <= selectedDateFormat &&
        validTillDate.format("MM-DD-YYYY") >= selectedDateFormat
      ) {
        // console.log("schedule");
        // console.log(selectedDateFormat);
        // console.log(schedule);
        // Check for recurrence type
        if (schedule.recurrence === "daily") {
          // Check if selected date is from Monday to Friday
          if (selectedDate.day() >= 1 && selectedDate.day() <= 5) {
            return true;
          }
        } else if (schedule.recurrence === "weekly") {
          // Check if selected day is included in selectedDays array
          if (schedule.selectedDays.includes(selectedDate.format("dddd"))) {
            return true;
          }
        } if (
          (selectedDate.day() === 0 || selectedDate.day() === 6)
        ) {
          // Check for weekends array if the day is Saturday or Sunday
          if (schedule.weekends.includes(selectedDate.format("dddd"))) {
            return true;
          }
        }
      }
      
      return false;
    })
  );

  const dataSource = filteredDoctors.map((doctor) => {
    const selectedDateFormat = selectedDate.format("MM-DD-YYYY");
    const schedule = schedules.find(
      (schedule) => 
      schedule.doctorId === doctor._id && 
      dayjs(schedule.date, "DD-MM-YYYY").format("MM-DD-YYYY") <= selectedDateFormat &&
      dayjs(schedule.validTillDate, "DD-MM-YYYY").format("MM-DD-YYYY") >= selectedDateFormat
    );

    if (!schedule) return null;

    return {
      key: doctor._id,
      doctorId : doctor._id,
      doctorName: "Dr. " + doctor.firstName + " " + doctor.lastName,
      roomNo: doctor.roomNo,
      availability: `${dayjs(schedule.time[0], "HH:mm").format("h:mm A")} - ${dayjs(
        schedule.time[1],
        "HH:mm"
      ).format("h:mm A")}`,
      onDate: selectedDate.format("DD-MM-YYYY"),
      scheduleId: schedule._id
    };
  });

  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "doctorName",
      key: "doctorName",
    },
    {
      title: "Room Number",
      dataIndex: "roomNo",
      key: "roomNo",
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
    },
    {
      title: "On Date",
      dataIndex: "onDate",
      key: "onDate",
    },
    {
      title: "",
      dataIndex: "date",
      render: (text, record) => {
        const today = dayjs().format("MM-DD-YYYY");
        const appointmentDate = dayjs(
          record.onDate,
          "DD-MM-YYYY"
        ).format("MM-DD-YYYY");
        const isFutureDate = today <= appointmentDate;
        if (user != null) {
          return (
            <Link
              to={`/admin/${user._id}/${record.doctorId}/${record.scheduleId}/${record.onDate}/book-slot-for-user`}
              className="text-blue-600 underline"
            >
              Book Slot for User
            </Link>
          );
        } else {
          return (
            <div>
              <span>
                {isFutureDate ? (
                  <Link
                    className="text-blue-600 underline"
                    to={`/user/${record.doctorId}/${record.scheduleId}/${record.onDate}/scheduleAppointment`}
                  >
                    Schedule Appointment
                  </Link>
                ) : (
                  <span>Appointment Date has Passed</span>
                )}
              </span>
            </div>
          );
        }

      },
    },
  ];

  return (
    <div>
      <h2 className="text-center p-3">
        On Date:{" "}
        <span className="font-semibold">{selectedDate.format("DD-MM-YYYY")}</span> (
        {dayjs(selectedDate, "DD-MM-YYYY").format("dddd")})
      </h2>
      <Table dataSource={dataSource.filter(Boolean)} columns={columns} />
    </div>
  );
};

export default DoctorScheduleTable;
