import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import MuiPhoneNumber from "material-ui-phone-number";
import DateFnsUtils from "@date-io/date-fns";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Nav from "./Nav";
import {
  CardMedia,
  FormControlLabel,
  FormLabel,
  Input,
  InputAdornment,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import AccountCircle from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Edit = () => {
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [picture, setPicture] = React.useState("user.png");
  const token =JSON.parse(localStorage.getItem("token")) || "";

  const navigate = useNavigate();
  const [editForm, setEditForm] = useState({
    image: "user.png",
    username: "",
    email: "",
    bio: "",
    gender: "",
    DOB: "",
    mobile: "",
  });

  const add = async () => {
    await axios(`http://localhost:8000/users/getuser`, {
      method: "GET",
      headers: {
        "auth-token": token.data,
      },
    })
      .then((res) => {
        console.log(res);
        console.log(res.data);
        if (res.data !== "") {
          setEditForm({
            image:
              res.data.image ||
              "https://gogetfunding.com/wp-content/uploads/2020/06/6707938/img/mimg_6707938_1592357701.png",
            username: res.data.firstname + " " + res.data.lastname || " ",
            bio: res.data.bio || "",
            gender: res.data.gender || "",
            DOB: res.data.DOB || "",
            mobile: res.data.mobile || "",
            email: res.data.email || "",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    add();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen1(false);
    setOpen2(false);
  };

  const signUp = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", picture);
    formData.append("username", editForm.username);
    formData.append("bio", editForm.bio);
    formData.append("DOB", editForm.DOB);
    formData.append("mobile", editForm.mobile);
    formData.append("email", editForm.email);
    formData.append("gender", editForm.gender);
    console.log(formData.values);

    await axios(`http://localhost:8000/profile/update`, {
      method: "PUT",
      data: formData,
      headers: {
        "auth-token": token.data,
      },
    })
      .then((res) => {
        setOpen1(true);
      })
      .catch((err) => {
        setOpen2(true);
      });

    formData.delete("image");
    formData.delete("username");
    formData.delete("bio");
    formData.delete("DOB");
    formData.delete("mobile");
    formData.delete("email");
    formData.delete("gender");
  };

  function handleChange(e) {
    setPicture(e.target.files[0]);
    setEditForm({
      ...editForm,
      image: URL.createObjectURL(e.target.files[0]),
    });
  }

  return (
    <div>
      <Nav />
      <Box
        maxWidth="100%"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "40px",
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
              }}
            >
              <form onSubmit={signUp}>
                <Grid container direction="column">
                  <Grid item>
                    <FormControl sx={{ width: "100%" }}>
                      <FormLabel sx={{ float: "left" }}>
                        <Typography
                          component="h1"
                          sx={{ fontSize: "25px", fontWeight: "bold" }}
                        >
                          Edit Profile
                        </Typography>
                      </FormLabel>
                    </FormControl>
                  </Grid>
                  <Grid item sx={{ marginTop: "10px" }}>
                    <FormControl>
                      <FormLabel>Change Profile Picture</FormLabel>
                      <Input
                        type="file"
                        label="Upload Profile Picture"
                        src
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item sx={{ marginTop: "10px" }}>
                    <TextField
                      type="text"
                      required
                      id="input-with-icon-textfield"
                      placeholder="Name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                        ),
                      }}
                      variant="standard"
                      value={editForm.username}
                      onChange={(value) =>
                        setEditForm({
                          ...editForm,
                          username: value.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item sx={{ marginTop: "10px" }}>
                    <TextField
                      type="text"
                      required
                      id="input-with-icon-textfield"
                      placeholder="Bio"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <WbIncandescentIcon />
                          </InputAdornment>
                        ),
                      }}
                      variant="standard"
                      value={editForm.bio}
                      onChange={(value) =>
                        setEditForm({
                          ...editForm,
                          bio: value.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item sx={{ marginTop: "10px" }}>
                    <FormControl>
                      <FormLabel>Gender</FormLabel>
                      <RadioGroup
                        row
                        value={editForm.gender}
                        onChange={(value) =>
                          setEditForm({
                            ...editForm,
                            gender: value.target.value,
                          })
                        }
                      >
                        <FormControlLabel
                          value="female"
                          control={<Radio />}
                          label="Female"
                        />
                        <FormControlLabel
                          value="male"
                          control={<Radio />}
                          label="Male"
                        />
                        <FormControlLabel
                          value="other"
                          control={<Radio />}
                          label="Other"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item sx={{ marginTop: "10px" }}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <FormControl>
                        <FormLabel>DOB</FormLabel>
                        <TextField
                          id="date"
                          type="date"
                          value={editForm.DOB}
                          onChange={(value) =>
                            setEditForm({
                              ...editForm,
                              DOB: value.target.value,
                            })
                          }
                          required
                        />
                      </FormControl>
                    </MuiPickersUtilsProvider>
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
                      value={editForm.email}
                      onChange={(value) =>
                        setEditForm({
                          ...editForm,
                          email: value.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item sx={{ marginTop: "10px" }}>
                    <MuiPhoneNumber
                      defaultCountry={"in"}
                      name="mobile"
                      value={editForm.mobile}
                      onChange={(value) =>
                        setEditForm({
                          ...editForm,
                          mobile: value,
                        })
                      }
                      InputLabelProps={{ style: { fontSize: 18 } }}
                    />
                  </Grid>

                  <Grid item sx={{ marginTop: "15px", display: "flex" }}>
                    <Button type="submit" variant="outlined" color="success">
                      Update
                    </Button>
                    <Button
                      variant="outlined"
                      color="success"
                      sx={{ marginLeft: "10px" }}
                      onClick={() => navigate("/feed")}
                    >
                      Cancel
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
                alignItems: "center",
                border: "1px solid grey",
              }}
            >
              <CardMedia
                component="img"
                height="300"
                width="100%"
                image={editForm.image}
                alt="green iguana"
                sx={{ objectFit: "fill" }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open1}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Profile Updated Succesfully!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open2}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Invalid Data
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Edit;
