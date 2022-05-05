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

function stringAvatar(name) {
  let children =
    name.firstname[0][0].toUpperCase() + name.lastname[0][0].toUpperCase();
  return {
    sx: {
      bgcolor: stringToColor(children),
      width: "30px",
      height: "28px",
    },
    children: children,
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

const Nav = ({ setOpen, open }) => {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const token = JSON.parse(localStorage.getItem("token")) || "";
  const [name, setName] = useState();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const logut = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    axios(`http://localhost:8000/users/getuser`, {
      method: "GET",
      headers: {
        "auth-token": token.data,
      },
    }).then((res) => {
      setName(res.data);
    });
  }, [token.data]);

  if (name !== undefined) {
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
            <h1>AM Social Feed</h1>
            <Box>
              <Button
                type="submit"
                onClick={() => setOpen(!open)}
                variant="outlined"
                style={{ marginRight: "10px" }}
              >
                create post
              </Button>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar {...stringAvatar(name)} src={name.image} />
                  
                  <h5 style={{marginLeft:"5px"}}>
                    {" "}
                    {name.username
                      ? name.username
                      : name.firstname + " " + name.lastname}
                  </h5>
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
  }
};
export default Nav;
