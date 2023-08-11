import React from "react";
import Signup from "./SignUp";
import { Route, Routes } from "react-router-dom";
import Login from "./Login.jsx";
import { AuthContextProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Main from "./Main";

const App = () => {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
        {/* <Signup/> */}
      </Routes>
    </AuthContextProvider>
  );
};

export default App;
