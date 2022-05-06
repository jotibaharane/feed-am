import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import ReCAPTCHA from "react-google-recaptcha";
import GoogleLogin from "react-google-login";
import Snackbar from "@mui/material/Snackbar";
import {
  FormLabel,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SignIn() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });
  const googleData = {
    idToken: "",
    reCaptchaToken: "",
  };
  const reRef = useRef();
  const signIn = async (e) => {
    e.preventDefault();
    await axios(`http://localhost:8000/users/login`, {
      method: "POST",
      data: signInForm,
    })
      .then((res) => {
        console.log(res);
        setOpen(true);
        localStorage.setItem("token", JSON.stringify(res.data));
        // localStorage.setItem("user", JSON.stringify(res));
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((err) => {
        setOpen1(true);
      });

    setSignInForm({
      email: "",
      password: "",
    });
  };

  const responseGoogle = async (response) => {
    const token = await reRef.current.executeAsync();
    googleData.reCaptchaToken = token;
    googleData.idToken = response.tokenId;
    axios
      .post("http://localhost:8000/users/auth/google", googleData, {
        headers: { Accept: "application/json" },
      })
      .then((response) => {
        localStorage.setItem("token", JSON.stringify(response));
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
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
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src="https://colorlib.com/etc/regform/colorlib-regform-7/images/signin-image.jpg"
                alt="log"
                style={{
                  width: "90%",
                  height: "90%",
                  objectFit: "none",
                  objectPosition: "100px 80px",
                }}
              />
              <Typography
                onClick={() => navigate("/signup")}
                sx={{ cursor: "pointer" }}
              >
                Create an account
              </Typography>
            </Grid>
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
              <form onSubmit={(e) => signIn(e)}>
                <Grid container direction="column">
                  <Grid item>
                    <FormControl sx={{ width: "100%" }}>
                      <FormLabel sx={{ float: "left" }}>
                        <Typography
                          component="h1"
                          sx={{ fontSize: "25px", fontWeight: "bold" }}
                        >
                          Sign In
                        </Typography>
                      </FormLabel>
                    </FormControl>
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
                      value={signInForm.email}
                      onChange={(value) =>
                        setSignInForm({
                          ...signInForm,
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
                      value={signInForm.password}
                      onChange={(value) =>
                        setSignInForm({
                          ...signInForm,
                          password: value.target.value,
                        })
                      }
                      autoComplete="none"
                    />
                  </Grid>
                  <ReCAPTCHA
                    sitekey="6Ld3COIZAAAAAC3A_RbO1waRz6QhrhdObYOk7b_5"
                    size="invisible"
                    ref={reRef}
                  />
                  <Grid item sx={{ marginTop: "15px" }}>
                    <Button type="submit" variant="outlined" color="success">
                      Sign In
                    </Button>
                  </Grid>
                  <Grid item sx={{ marginTop: "15px" }}>
                    <FormControl sx={{ width: "100%" }}>
                      <FormLabel sx={{ textAlign: "center" }}>
                        <Typography
                          component="h1"
                          sx={{ fontSize: "15px", color: "black" }}
                        >
                          OR
                        </Typography>
                      </FormLabel>
                    </FormControl>
                  </Grid>

                  <Grid item sx={{ textAlign: "center", marginTop: "15px" }}>
                    <GoogleLogin
                      clientId="692565184932-h9dv74rig6sccdqctvg7npbp5q8rrlj6.apps.googleusercontent.com"
                      buttonText="Log in with google"
                      onSuccess={responseGoogle}
                      onFailure={responseGoogle}
                      cookiePolicy={"single_host_origin"}
                      style={{ color: "black" }}
                    />
                  </Grid>
                </Grid>
              </form>
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
          Login Succesfully!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open1}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          invalid credential please try again
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default SignIn;
