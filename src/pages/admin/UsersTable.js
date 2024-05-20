import React, { useRef, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { message, Button, Input, Space, Table, Select } from "antd"; // Import Select component
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

const UsersTable = ({ users }) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});
  const [appointmentsData, setAppointmentsData] = useState({});
  const [doctorsData, setDoctorsData] = useState({});
  const [selectedSlotTimeAppId, setSelectedSlotTimeAppId] = useState();
  const searchInput = useRef(null);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      const todaysDate = dayjs().format("DD-MM-YYYY");
      try {
        const appointmentsData = {};
        for (const user of users) {
          const appointments = user.appointmentId || [];
          const recentAppointments = appointments.slice(-5);

          appointmentsData[user._id] = [];

          for (const appointmentId of recentAppointments) {
            const appointmentDetails = await getAppointmentById(appointmentId);

            if (
              appointmentDetails &&
              appointmentDetails[0].date === todaysDate
            ) {
              appointmentsData[user._id].push(appointmentDetails[0]);
            }
          }
        }
        setAppointmentsData(appointmentsData);
        // console.log(appointmentsData);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchDoctorDetails = async () => {
      try {
        const res = await axios.get("/api/v1/admin/getAllDoctors", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          const doctors = res.data.data;
          const doctorsMap = {};
          doctors.forEach((doctor) => {
            doctorsMap[doctor._id] =
              "Dr. " + doctor.firstName + " " + doctor.lastName;
          });
          setDoctorsData(doctorsMap);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAppointmentDetails();
    fetchDoctorDetails();
  }, [users]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = () => {
    setSearchText("");
    setSearchedColumn("");
    setFilteredInfo({});
  };

  const getAppointmentById = async (appointmentIds) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/getAppointmentById",
        { appointmentIds },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        return res.data.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckInAndOut = async (appointmentId) => {
    try {
      console.log(appointmentId);
      const res = await axios.post(
        "/api/v1/admin/handleCheckInAndOutUser",
        { appointmentId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        
        message.success(res.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSlotTimeChange = (value) => {
    setSelectedSlotTimeAppId(value);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            className="bg-blue-500 text-white border-blue-400 hover:bg-blue-400"
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset()}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    filteredValue: filteredInfo[dataIndex] || null,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const filteredUsers = users.filter(
    (user) => !user.isAdmin && !user.isRootAdmin
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Contact Number",
      dataIndex: "phoneNumber",
      ...getColumnSearchProps("phoneNumber"),
    },
    {
      title: "User Type",
      dataIndex: "userType",
      render: (text, record) => (
        <div>
          {record.userType === "" ? (
            <span>No Data available</span>
          ) : (
            <span>{record.userType}</span>
          )}
        </div>
      ),
    },
    {
      title: "",
      dataIndex: "",
      render: (text, record) => (
        <div>
          <Link
            className="text-blue-600 underline"
            to={`/admin/${record._id}/select-doctor-for-user`}
          >
            Schedule appointment
          </Link>
        </div>
      ),
    },
    {
      title: "Slot Time",
      dataIndex: "appointmentId",
      render: (text, record) => {
        const uniqueSlotTimes = Array.from(
          new Set(
            appointmentsData[record._id]?.map(
              (appointment) => appointment.slotTime
            )
          )
        );
        if (!uniqueSlotTimes || uniqueSlotTimes.length === 0) {
          return null;
        }
        return (
          <div>
            <Select
              style={{ width: 200 }}
              onChange={handleSlotTimeChange}
            >
              {uniqueSlotTimes.map((slotTime) => {
                const appointment = appointmentsData[record._id]?.find(
                  (appointment) => appointment.slotTime === slotTime
                );
                const doctorName = appointment?.doctorId;
                const appointmentId = appointment?._id;
                return (
                  <Option key={appointmentId} value={appointmentId}>
                    {slotTime} - {doctorsData[doctorName]}
                  </Option>
                );
              })}
            </Select>
    
            {selectedSlotTimeAppId && (
              <Button
              className={`mx-2 text-white ${
                appointmentsData[record._id]?.find(
                  (appointment) => appointment._id === selectedSlotTimeAppId
                )?.checkIn ? 'bg-red-400' : 'bg-blue-600' 
              }`}
              onClick={() => handleCheckInAndOut(selectedSlotTimeAppId)}
            >
              {appointmentsData[record._id]?.find(
                (appointment) => appointment._id === selectedSlotTimeAppId
              )?.checkIn
                ? "Check Out"
                : "Check In"}
            </Button>
            )}
          </div>
        );
      },
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredUsers}
      onChange={(pagination, filters, sorter) => setFilteredInfo(filters)}
    />
  );
};

export default UsersTable;
