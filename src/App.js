import React from "react";
import Box from "@mui/material/Box";
import SignUp from "./Component/SignUp";
import SignIn from "./Component/SignIn";
import Feed from "./Component/Pages/Feed";
import Edit from "./Component/Pages/Edit";
import PasswordChange from "./Component/Pages/PasswordChange";

import "./App.css";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <Box>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/" element={<Feed />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/password" element={<PasswordChange />} />
      </Routes>
    </Box>
  );
}

export default App;
