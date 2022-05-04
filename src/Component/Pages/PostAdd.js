import FormLabel from "@mui/material/FormLabel";
import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

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

function PostAdd({ setOpen1, fetchData, setOpen, open }) {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token")) || "";
  //   const [open, setOpen] = useState(false);
  const [addPost, setAddPost] = useState({
    caption: "",
    likes: [],
  });

  const [picture, setPicture] = React.useState({
    picturePreview: "task.jpeg",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const post = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("image", picture.pictureAsFile);
    formData.append("caption", addPost.caption);
    await axios(`http://localhost:8000/posts/add`, {
      method: "POST",
      data: formData,
      headers: {
        "auth-token": token.data,
      },
    })
      .then((res) => {
        fetchData();
        setOpen1({ open: true, severity: "success" });
        setOpen(false);
        navigate("/");
      })
      .catch((err) => {
        setOpen1({ open: true, severity: "error" });
      });

    formData.delete("image");
    formData.delete("caption");
    setPicture({
      picturePreview: "task.jpeg",
    });
  };

  function handleChange(e) {
    setPicture({
      picturePreview: URL.createObjectURL(e.target.files[0]),
      pictureAsFile: e.target.files[0],
    });
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <form onSubmit={post}>
          <Paper
            elevation={3}
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#1A2027" : "#fff",
            }}
          >
            <Card sx={{ backgroundColor: "#f5f5f5" }}>
              <CardContent>
                <CardMedia
                  component="img"
                  height="180"
                  image={picture.picturePreview}
                  sx={{ objectFit: "fill" }}
                  alt="post img"
                />
              </CardContent>
              <CardContent>
                <FormLabel>Photo *</FormLabel>
                <Input
                  type="file"
                  label="Upload Profile Picture"
                  onChange={handleChange}
                />
              </CardContent>
              <CardContent>
                <TextField
                  type="text"
                  placeholder="Add Caption *"
                  variant="standard"
                  sx={{ width: "95%" }}
                  fullWidth
                  value={addPost.caption}
                  onChange={(e) =>
                    setAddPost({ ...addPost, caption: e.target.value })
                  }
                />
              </CardContent>
              <CardContent sx={{ textAlign: "center" }}>
                <Button type="submit" variant="outlined" color="success">
                  Submit
                </Button>
              </CardContent>
            </Card>
          </Paper>
        </form>
      </Box>
    </Modal>
  );
}

export default PostAdd;
