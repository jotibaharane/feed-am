import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Nav from "./Nav";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "@mui/material/Alert";
import CardCon from "./CardCon";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import PostAdd from "./PostAdd";
import Skeletons from "./Skeletons";
function Feed() {
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("token")) || "";
  const [data, setData] = useState([]);
  const [open1, setOpen1] = useState({ open: false, severity: "success" });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen1(false);
    setOpen(false);
  };

  const fetchData = () => {
    axios(`http://localhost:8000/posts`, {
      method: "GET",
      headers: {
        "auth-token": token.data,
      },
    }).then((res) => {
      res.data !== "Invalid Token" ? setData(res.data) : navigate("/login");
    });
  };

  return (
    <Container maxWidth="100%" sx={{ backgroundColor: "#fff9c4" }}>
      <Nav setOpen={setOpen} />
      <Modal open={open} onClose={handleClose}>
        <PostAdd
          setOpen1={setOpen1}
          fetchData={fetchData}
          setOpen={setOpen}
          open={open}
        />
      </Modal>
      <Grid
        minHeight="100vh"
        sx={{ flexGrow: 1, marginTop: "60px" }}
        container
        spacing={2}
      >
        <Grid item xs={12}>
          <Grid container spacing={1} sx={{ marginLeft: "22%" }}>
            {data.map((value) => (
              <Grid key={value._id} item>
                <Skeletons />
                <CardCon id={value._id} data={value} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open1.open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={open1.severity}
          sx={{ width: "100%" }}
        >
          Post added Succesfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}
export default Feed;
