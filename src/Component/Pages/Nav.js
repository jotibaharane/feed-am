import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const settings = [
  { title: "Edit Profile", path: "/edit" },
  { title: "Change Password", path: "/password" },
  { title: "Logout", path: "/" },
];

const Nav = ({ setOpen}) => {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const token = JSON.parse(localStorage.getItem("token")) || "";
  const [name, setName] = useState("dummy user");

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const logut = () => {
    localStorage.clear();
    navigate("/login")
  };

  useEffect(() => {
    axios(`http://localhost:8000/users/getuser`, {
      method: "GET",
      headers: {
        "auth-token": token.data,
      },
    }).then((res) => {
      setName(res.data.username);
    });
  }, []);

  function stringAvatar(name) {
    let children = name.split(" ");
    children =
      children[1] !== undefined
        ? children[0][0] + children[1][0]
        : children[0][0] + children[0][1];
    return {
      sx: {
        bgcolor: stringToColor("dummy user"),
      },
      children: children.toUpperCase(),
    };
  }

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

  return (
    <AppBar
      sx={{
        backgroundColor: "#D1C4E9",
        height: "70px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Box
            component="img"
            sx={{
              height: 64,
              width: 137.5,
            }}
            alt="Your logo."
            src="http://admin.liveexamcenter.in/assets/images/logo.svg"
          />
          <Box>
            <Button
              type="submit"
              onClick={() => setOpen(true)}
              variant="outlined"
              style={{ marginRight: "10px" }}
            >
              create post
            </Button>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar {...stringAvatar(name)} />
                <em style={{ fontSize: "20px" }}> {name.toUpperCase()}</em>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={() => setAnchorElUser(null)}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.title}
                  onClick={() => {
                    setting.title === "Logout"
                      ? logut()
                      : navigate(setting.path);
                  }}
                >
                  <Typography textAlign="center">{setting.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Nav;
