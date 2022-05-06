import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Nav from "./Nav";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  FormLabel,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
 
} from "@mui/material";

import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
function PasswordChange() {
  const token = 
    JSON.parse(localStorage.getItem("token")) || ""

  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
  });
 
  const [confNewPass, setConfNewPass] = useState("");
 
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const navigate = useNavigate();

  const change = async (e) => {
    e.preventDefault();
    if (password.new_password === confNewPass) {
      await axios(`http://localhost:8000/users/reset`, {
        method: "PUT",
        data: password,
        headers: {
          "auth-token": token.token,
        },
      })
        .then((res) => {
          if (res.data === "password updated successfully") {
            setOpen1(true);
            setTimeout(() => {
              navigate("/");
            }, 1000);
          } else {
            setOpen2(true);
          }
        })
        .catch(() => {
          setOpen2(true);
        });
    } else {
      setOpen2(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen1(false);
    setOpen2(false);
  };

  return (
    <div>
      <Nav />
      <Modal open={true} onClose={() => navigate("/")}>
        <Box sx={style}>
          <form onSubmit={change}>
            <Paper
              elevation={3}
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "#1A2027" : "#fff",
              }}
            >
              <Card sx={{ backgroundColor: "#f5f5f5",textAlign: "center" }}>
                <CardContent>
                  <CardMedia
                    component="img"
                    height="180"
                    image="https://www.formassembly.com/wp-content/uploads/2019/09/428.jpg"
                    sx={{ objectFit: "fill" }}
                    alt="post img"
                  />
                </CardContent>
                <CardContent>
                  <FormLabel
                    component="h1"
                    sx={{ fontSize: "25px", fontWeight: "bold" }}
                  >
                    Change Password
                  </FormLabel>
                </CardContent>
                <CardContent>
                  <TextField
                    type="password"
                    placeholder="Current Password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    value={password.current_password}
                    onChange={(value) =>
                      setPassword({
                        ...password,
                        current_password: value.target.value,
                      })
                    }
                  />
                </CardContent>
                <CardContent>
                  <TextField
                    type="password"
                    placeholder="New Password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    value={password.new_password}
                    onChange={(value) =>
                      setPassword({
                        ...password,
                        new_password: value.target.value,
                      })
                    }
                  />{" "}
                </CardContent>
                <CardContent>
                  <TextField
                    type="password"
                    placeholder="Confirm Password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOpenIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    value={confNewPass}
                    onChange={(value) => setConfNewPass(value.target.value)}
                  />
                </CardContent>
                <CardContent >
                  <Button type="submit" variant="outlined" color="success">
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </Paper>
          </form>
        </Box>
      </Modal>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open1}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          password Updated Succesfully!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open2}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          invalid inpute
        </Alert>
      </Snackbar>
    </div>
  );
}

export default PasswordChange;
