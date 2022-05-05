import React, { useEffect, useState } from "react";
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
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
function Feed() {
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("token")) || "";
  const [data, setData] = useState([]);
  const [open1, setOpen1] = useState({ open: false, severity: "success" });
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(2);
  const [page, setPage] = useState(1);
  const [end, setEnd] = useState(false);
  useEffect(() => {
    fetchData(3);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen1(false);
    setOpen(false);
  };

  const fetchData = () => {
    axios(`http://localhost:8000/posts/params?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "auth-token": token.data,
      },
    }).then((res) => {
      console.log(res.data.page);
      res.data !== "Invalid Token"
        ? setData(res.data.post)
        : navigate("/login");
      setPage(res.data.page);
    });
  };

  const loadFunc = () => {
    console.log(page);
    setTimeout(() => {
      axios
        .get(`http://localhost:8000/posts/params?page=${page}&limit=${limit}`, {
          headers: {
            "auth-token": token.data,
          },
        })
        .then((response) => {
          console.log(response);
          setPage(response.data.page);
          setEnd(response.data.end);
          const arr = [...data];
          response.data.post?.map((i) => {
            arr.push(i);
          });
          setData(arr);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1000);
  };
  return (
    <Table stickyHeader aria-label="sticky table">
      <TableHead>
        <TableRow>
          <TableCell>
            <Nav setOpen={setOpen} open={open} />
            <Button
              type="submit"
              onClick={() => setOpen(true)}
              variant="outlined"
              style={{ marginRight: "10px" }}
            >
              create post
            </Button>
          </TableCell>
        </TableRow>
      </TableHead>

      {open && (
        <TableBody sx={{ display: "flex", justifyContent: "center" }}>
          <TableRow>
            <TableCell>
              <PostAdd
                setOpen1={setOpen1}
                fetchData={fetchData}
                setOpen={setOpen}
                open={open}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      )}
      <TableBody sx={{ display: "flex", justifyContent: "center" }}>
        <InfiniteScroll
          dataLength={data.length}
          next={loadFunc}
          hasMore={true}
          loader={
            <div className="loader" key={0}>
              {end == true ? (
                "End of the post"
              ) : (
                <>
                  <TableRow>
                    <TableCell>
                      <Skeletons />
                    </TableCell>
                  </TableRow>
                </>
              )}
            </div>
          }
        >
          {data &&
            data.map((value) => (
              <TableRow key={value._id}>
                <TableCell>
                  <CardCon id={value._id} data={value} />
                </TableCell>
              </TableRow>
            ))}
        </InfiniteScroll>
      </TableBody>
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
    </Table>
  );
}
export default Feed;
