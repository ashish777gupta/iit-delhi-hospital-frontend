import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import UsersTable from "./UsersTable";

const Users = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Layout>
      <h1 className="text-center m-2">Users List</h1>
      <UsersTable users={users} />
    </Layout>
  );
};

export default Users;
