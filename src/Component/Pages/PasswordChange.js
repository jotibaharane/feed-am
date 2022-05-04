import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Nav from "./Nav";
import axios from "axios";
import {
  FormLabel,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
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
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("token")) || ""
  );
  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
  });
  const [newPass, setNewPass] = useState("");
  const [confNewPass, setConfNewPass] = useState("");
  const [open, setOpen] = React.useState(true);
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
        "auth-token": token.data,
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
    }else{
      setOpen2(true)
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
      <Modal
        open={open}
        onClose={() => navigate("/")}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid
            container
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <form onSubmit={change}>
              <Grid container direction="column">
                <Grid
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid black",
                    height: "20vh",
                  }}
                >
                  <img
                    src="https://freesvg.org/img/password-reset.png"
                    alt="log"
                    style={{
                      width: "50%",
                      height: "50%",
                      objectFit: "contain",
                    }}
                  />
                </Grid>
                <Grid item sx={{ marginTop: "15px" }}>
                  <FormControl sx={{ width: "100%" }}>
                    <FormLabel sx={{ float: "left" }}>
                      <Typography
                        component="h1"
                        sx={{ fontSize: "25px", fontWeight: "bold" }}
                      >
                        Change Password
                      </Typography>
                    </FormLabel>
                  </FormControl>
                </Grid>
                <Grid item sx={{ marginTop: "15px" }}>
                  <TextField
                    type="password"
                    id="input-with-icon-textfield"
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
                </Grid>
                <Grid item sx={{ marginTop: "14px" }}>
                  <TextField
                    type="password"
                    id="input-with-icon-textfield"
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
                  />
                </Grid>
                <Grid item sx={{ marginTop: "14px" }}>
                  <TextField
                    type="password"
                    id="input-with-icon-textfield"
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
                </Grid>
                <Grid
                  item
                  sx={{
                    marginTop: "15px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button type="submit" variant="outlined" color="success">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
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
