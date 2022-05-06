import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import ThumbUpTwoToneIcon from "@mui/icons-material/ThumbUpTwoTone";
import ChatBubbleTwoToneIcon from "@mui/icons-material/ChatBubbleTwoTone";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import axios from "axios";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Collapse from "@mui/material/Collapse";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

function stringToColor(string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name) {
  if (name) {
    let children = name.split();
    children =
      children[1] !== undefined
        ? children[0][0] + children[1][0]
        : children[0][0] + children[0][1];
    return {
      sx: {
        bgcolor: stringToColor(name),
        height: "40px",
        width: "40px",
      },
      children: children,
    };
  }
}

function CardCon({ data }) {
  const token = JSON.parse(localStorage.getItem("token")) || "";
  const [allComment, setAllComment] = useState([]);
  const [comment, setComment] = useState({ text: "" });
  const [colorlike, setcolorlike] = useState(true);
  const [colorlike1, setcolorlike1] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [noOfLikes, setNoOfLikes] = React.useState({
    id: "",
    no: 0,
  });
  const [noOfLikes1, setNoOfLikes1] = React.useState({
    id: "",
    no: 0,
  });

  const getComm = async (postId) => {
    await axios(`http://localhost:8000/posts/comments/${postId}`, {
      method: "GET",
      headers: {
        "auth-token": token.token,
      },
    }).then((res) => {
      setAllComment(res.data);
    });
  };

  const comm = async (postId) => {
    if (comment.text !== "") {
      await axios(`http://localhost:8000/posts/comments/add/${postId}`, {
        method: "POST",
        data: comment,
        headers: {
          "auth-token": token.token,
        },
      }).then((res) => {
        getComm(postId);
      });
    }
    setComment({ text: "" });
  };

  const handleExpandClick = async (postId) => {
    setExpanded(expanded ? false : postId);
    getComm(postId);
  };

  useEffect(() => {
    getComm(data._id);
  }, []);

  const handleLikes = (postId) => {
    setcolorlike(!colorlike);
    axios
      .put(
        `http://localhost:8000/posts/${postId}`,
        {},
        {
          headers: {
            "auth-token": token.token,
          },
        }
      )
      .then((res) => {
        setNoOfLikes({ id: postId, no: res.data.likes.length });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLikes1 = (postId) => {
    setcolorlike1(!colorlike1);

    axios
      .put(
        `http://localhost:8000/posts/comments/${postId}`,
        {},
        {
          headers: {
            "auth-token": token.token,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setNoOfLikes1({ id: postId, no: res.data.likes.length });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (data) {
    return (
      <Paper
        elevation={3}
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}
      >
        <Card
          sx={{ width: 700, backgroundColor: "#f5f5f5", maxHeight: "150vh" }}
        >
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {data.post_created_by}
            </Typography>
            <CardMedia
              component="img"
              height="300"
              image={data.image}
              sx={{ objectFit: "fill" }}
              alt="post img"
            />
            <Typography gutterBottom variant="h5" component="div">
              {data.caption}
            </Typography>

            <Typography gutterBottom variant="p" component="p">
              <ThumbUpTwoToneIcon
                // onClick={(e) => setcolorlike(!colorlike)}
                onClick={() => handleLikes(data._id)}
                style={{ color: colorlike ? "red" : "grey" }}
              />
              {noOfLikes.no === 0
                ? data.likes.length
                : noOfLikes.id == data._id
                ? noOfLikes.no
                : data.likes.length}{" "}
              Likes
              <ChatBubbleTwoToneIcon
                sx={{ marginLeft: "10px" }}
                onClick={() => handleExpandClick(data._id)}
              />
              {allComment.length} Comments
            </Typography>
            <TextField
              type="text"
              placeholder="Add comment"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start" sx={{ cursor: "pointer" }}>
                    <ArrowCircleRightOutlinedIcon
                      onClick={() => comm(data._id)}
                    />
                  </InputAdornment>
                ),
              }}
              value={comment.text}
              variant="standard"
              sx={{ width: "95%" }}
              fullWidth
              onChange={(e) => setComment({ text: e.target.value })}
            />
          </CardContent>

          <Collapse in={expanded === data._id} timeout="auto" unmountOnExit>
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: 100,
              }}
            >
              {allComment.map((com) => {
                console.log(com);
                return (
                  <CardContent key={com._id}>
                    <Divider variant="inset" component="li" />
                    <ListItem alignItems="flex-start" key={com._id}>
                      <ListItemAvatar>
                        <Avatar {...stringAvatar("jotiba harane")} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="h5"
                              variant="p"
                              color="text.primary"
                            >
                              {com.createdBy}
                              {" - "}
                            </Typography>
                            <Typography
                              sx={{ display: "inline" }}
                              component="h5"
                              variant="body2"
                              color="text.primary"
                            >
                              {com.text}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <ListItem
                      sx={{ justifyContent: "right", marginRight: "10%" }}
                    >
                      <FavoriteBorderOutlinedIcon
                        onClick={() => handleLikes1(com._id)}
                        style={{ color: colorlike1 ? "red" : "grey" }}
                      />
                      {noOfLikes1.no === 0
                        ? com.likes.length
                        : noOfLikes1.id == com._id
                        ? noOfLikes1.no
                        : com.likes.length}{" "}
                      Likes
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </CardContent>
                );
              })}
            </List>
          </Collapse>
        </Card>
      </Paper>
    );
  }
}

export default CardCon;
