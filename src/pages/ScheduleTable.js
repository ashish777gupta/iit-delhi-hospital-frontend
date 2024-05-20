import React from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const ScheduleTable = ({ schedules }) => {
  return (
    <>
      {schedules.length > 0 ? (
        <Table
          columns={[
            { title: "Doctor Name", dataIndex: "name" },
            { title: "Room Number", dataIndex: "roomNo" },
            { title: "Availability", dataIndex: "time" },
            { title: "On Date", dataIndex: "date" },
            {
              title: "",
              dataIndex: "date",
              render: (text, record) => {
                const today = dayjs().format("MM-DD-YYYY");
                const appointmentDate = dayjs(record.date, "DD-MM-YYYY").format(
                  "MM-DD-YYYY"
                );
                const isFutureDate = today <= appointmentDate;
                return (
                  <div>
                    <span>
                      {isFutureDate ? (
                        <Link
                          className="text-blue-600 underline"
                          to={`/user/${record.doctorId}/${record.date}/scheduleAppointment`}
                        >
                          {" "}
                          Schedule Appointment
                        </Link>
                      ) : (
                        <span>Appointment Date has Passed</span>
                      )}
                    </span>
                  </div>
                );
              },
            },
          ]}
          dataSource={schedules}
          pagination={false}
        />
      ) : (
        <h1>No Doctor Available</h1>
      )}
    </>
  );
};

export default ScheduleTable;
