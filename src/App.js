import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AddDoctor from "./pages/admin/AddDoctor";
import Doctors from "./pages/admin/Doctors";
import Users from "./pages/admin/Users";
import DoctorSchedule from "./pages/admin/DoctorSchedule";
import Profile from "./pages/Profile";
import DoctorLogin from "./pages/doctor/DoctorLogin";
import ScheduleAppointment from "./pages/ScheduleAppointment";
import SelectDoctorForUser from "./pages/admin/SelectDoctorForUser";
import BookSlotForUser from "./pages/admin/BookSlotForUser";
import DoctorProtectedRoute from "./components/DoctorProtectedRoute";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import ViewSchedulePage from "./pages/ViewSchedulePage";
import TodaysAppointment from "./pages/doctor/TodaysAppointment";
import UserAppointments from "./pages/UserAppointments";


function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <>
      <BrowserRouter>
        {loading ? (
          <Spinner />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-schedule"
              element={
                <ProtectedRoute>
                  <ViewSchedulePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/appointment"
              element={
                <ProtectedRoute>
                  <UserAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/:doctorId/:scheduleId/:date/scheduleAppointment"
              element={
                <ProtectedRoute>
                  <ScheduleAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-doctor"
              element={
                <ProtectedRoute>
                  <AddDoctor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute>
                  <Doctors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/:id/schedule"
              element={
                <ProtectedRoute>
                  <DoctorSchedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/:id/select-doctor-for-user"
              element={
                <ProtectedRoute>
                  <SelectDoctorForUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/:userId/:doctorId/:scheduleId/:date/book-slot-for-user"
              element={
                <ProtectedRoute>
                  <BookSlotForUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/doctor-login"
              element={
                <PublicRoute>
                  <DoctorLogin />
                </PublicRoute>
              }
            />
            <Route
              path="/doctor-dashboard"
              element={
                <DoctorProtectedRoute>
                  <DoctorDashboard />
                </DoctorProtectedRoute>
              }
            />
            <Route
              path="/doctor/today-appointment"
              element={
                <DoctorProtectedRoute>
                  <TodaysAppointment />
                </DoctorProtectedRoute>
              }
            />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
