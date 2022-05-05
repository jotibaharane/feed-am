import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import {
  FormLabel,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import AccountCircle from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SignUp() {
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const navigate = useNavigate();
  const [signUpForm, setSignUpForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  });

  const signUp = async (e) => {
    e.preventDefault();

    await axios(`http://localhost:8000/users/register`, {
      method: "POST",
      data:signUpForm,
    })
      .then((res) => {
        setOpen(true);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        
      })
      .catch((err) => {
        setOpen1(true);
      });

    setSignUpForm({
      firstname: "",
      lastname: "",
      email: "",
      password: ""
    });
  };


  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen1(false);
    setOpen(false);
  };

  
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
    <Box
      maxWidth="100%"
      sx={{
        height: "100vh",
        backgroundColor: "#fafafa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper elevation={1} sx={{ width: "70%", height: "90vh" }}>
        <Grid container xs={12} sx={{ height: "90vh" }}>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff8e1",
            }}
          >
            <form onSubmit={(e) => signUp(e)}>
              <Grid container direction="column">
                <Grid item>
                  <FormControl sx={{ width: "100%" }}>
                    <FormLabel sx={{ float: "left" }}>
                      <Typography
                        component="h1"
                        sx={{ fontSize: "25px", fontWeight: "bold" }}
                      >
                        Sign Up
                      </Typography>
                    </FormLabel>
                  </FormControl>
                </Grid>
                <Grid item sx={{ marginTop: "10px" }}>
                  <TextField
                    type="text"
                    required
                    id="input-with-icon-textfield"
                    placeholder="First Name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    value={signUpForm.firstname}
                    onChange={(value) =>
                      setSignUpForm({
                        ...signUpForm,
                        firstname: value.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item sx={{ marginTop: "10px" }}>
                  <TextField
                    type="text"
                    required
                    id="input-with-icon-textfield"
                    placeholder="Last Name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    value={signUpForm.lastname}
                    onChange={(value) =>
                      setSignUpForm({
                        ...signUpForm,
                        lastname: value.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item sx={{ marginTop: "10px" }}>
                  <TextField
                    type="email"
                    required
                    id="input-with-icon-textfield"
                    placeholder="Email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    value={signUpForm.email}
                    onChange={(value) =>
                      setSignUpForm({
                        ...signUpForm,
                        email: value.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item sx={{ marginTop: "10px" }}>
                  <TextField
                    type="password"
                    id="input-with-icon-textfield"
                    placeholder="Password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    value={signUpForm.password}
                    onChange={(value) =>
                      setSignUpForm({
                        ...signUpForm,
                        password: value.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item sx={{ marginTop: "15px" }}>
                  <Button type="submit" variant="outlined" color="success">
                    Sign Up
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src="https://colorlib.com/etc/regform/colorlib-regform-7/images/signup-image.jpg"
              alt="log"
              style={{
                width: "90%",
                height: "90%",
                objectFit: "none",
                objectPosition: "100px 80px",
              }}
            />
            <Typography
              onClick={() => navigate("/login")}
              autoFocus
              sx={{ cursor: "pointer" }}
            >
              i am already member
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
    <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Sign up Succesfully!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open1}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          "you have enterd invalid details"
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default SignUp;
