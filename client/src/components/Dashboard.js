// Import necessary dependencies from React and external libraries
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  styled,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Input,
  Badge,
  Divider,
  Grid,
  Drawer as MuiDrawer,
} from "@mui/material";

// Import icons and components
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ChatIcon from "@mui/icons-material/Chat";
import { Link } from "react-router-dom";
import FilterMenu from "./Filter";
import UserCard from "./UserCard";
import { useUserContext } from "../context/UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../context/SocketContext";
import { useNotificationsNoContext } from "../context/NotificationsNoContext.js";
import socket from "../chatSocket.js";

// Set the width of the drawer
const drawerWidth = 240;

// Styled components for AppBar and Drawer
const AppBar = styled(MuiAppBar, {
  // Styling configurations for the AppBar
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  // Styling configurations for the Drawer
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// Create a default theme using MUI's createTheme
const defaultTheme = createTheme();

// Dashboard component
const Dashboard = () => {
  // State variables and hooks initialization
  const [open, setOpen] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const inputRef = useRef(null);

  // Context and authentication hooks
  const userContext = useUserContext();
  const { user, logout } = useAuth0();

  const { setSocketValue } = useSocketContext();

  const { notificationsNo, setNotificationsNoValue, increment } =
    useNotificationsNoContext();

  const navigate = useNavigate();

  // Function to toggle the drawer
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Function to open and close the filter menu
  const openFilterMenu = () => {
    setShowFilterMenu(true);
  };

  const closeFilterMenu = () => {
    setShowFilterMenu(false);
  };

  // Function to fetch the user profile
  useEffect(() => {
    const getMyProfile = async () => {
      console.log("$%$#$#$#$#$#", user);
      try {
        await axios
          .get(
            `http://localhost:4000/api/v1/users/myProfile?email=${user?.email}`,
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            if (response.data.success) {
              let tempUser = response.data.user;
              let user_type = response.data.user_type;
              tempUser.user_type = user_type;
              userContext.login(tempUser);
              setSocketValue(socket);
            } else {
              console.log("Login Failed");
              logout({ returnTo: "http://localhost:5000" });
            }
          })
          .catch((error) => {
            console.error("API Error:", error);
          });
      } catch (error) {
        console.error("fetch Profile failed:", error);
      }
    };

    getMyProfile();
  }, []);

  useEffect(() => {
    const getNotificationsNo = async () => {
      try {
        await axios
          .get(
            `http://localhost:4000/api/v1/notifications/countNotifications?userId=${userContext.user?._id}`,
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            console.log(response);
            setNotificationsNoValue(response.data);
          })
          .catch((error) => {
            console.error("API Error:", error);
          });
      } catch (error) {
        console.error(error);
      }
    };
    getNotificationsNo();
  });

  // Function to handle chat IconButton click
  const handleChat = () => {
    navigate("/chat/welcome");
  };

  const handleNotification = () => {
    navigate("/notifications");
  };

  useEffect(() => {
    console.log("socket#$#$#$#$#$#$#$#$#$#$#", socket, socket.id);
    socket.emit("addUser", userContext.user?._id);
    // socket.emit("addUser", user.email);
    socket.on("getUsers", (users) => {
      console.log(users);
    });

    return () => {
      // Cleanup function to remove the event listener when the component unmounts
      socket.off("getUsers");
    };
  }, [userContext.user?._id]);

  useEffect(() => {
    console.log(
      "INSIDE NOTIFICATION DASHBOARD",
      socket,
      window.location.pathname
    );
    socket.on("getMessageNotification", async (data) => {
      if (
        window.location.pathname !== "/chat/welcome" &&
        window.location.pathname !== "/chat/chatting"
      ) {
        try {
          await axios
            .post(
              `http://localhost:4000/api/v1/notifications/newNotification`,
              {
                receiverId: userContext.user?._id,
                senderId: data.senderId,
                senderName: data.senderName,
                messageType: "message",
                message: data.text,
              },
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              console.log("CREATED NOTIFICATION");
            })
            .catch((error) => {
              console.error("API Error:", error);
            });
          increment();
        } catch (error) {
          console.log(error);
        }
      }
    });
    socket.on("receiveNewConversation&MessageNotification", async (data) => {
      if (
        window.location.pathname !== "/chat/welcome" &&
        window.location.pathname !== "/chat/chatting"
      ) {
        try {
          await axios
            .post(
              `http://localhost:4000/api/v1/notifications/newNotification`,
              {
                receiverId: userContext.user._id,
                senderId: data.senderId,
                senderName: data.senderName,
                messageType: "message",
                message: data.text,
              },
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              console.log("CREATED NOTIFICATION");
            })
            .catch((error) => {
              console.error("API Error:", error);
            });
          increment();
        } catch (error) {
          console.log(error);
        }
      }
    });
    socket.on("updateBlockedStatusNotification", async (data) => {
      if (
        window.location.pathname !== "/chat/welcome" &&
        window.location.pathname !== "/chat/chatting"
      ) {
        try {
          await axios
            .post(
              `http://localhost:4000/api/v1/notifications/newNotification`,
              {
                receiverId: userContext.user._id,
                senderId: data.senderId,
                senderName: data.senderName,
                messageType: "blockingUpdate",
                message: `You have been ${
                  data.blocked ? "blocked" : "unblocked"
                }.`,
              },
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              console.log("CREATED NOTIFICATION");
            })
            .catch((error) => {
              console.error("API Error:", error);
            });
          increment();
        } catch (error) {
          console.log(error);
        }
      }
    });
    return () => {
      socket.off("getMessageNotification");
      socket.off("receiveNewConversation&MessageNotification");
      socket.off("updateBlockedStatusNotification");
    };
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton color="inherit" onClick={handleChat}>
              <ChatIcon />
            </IconButton>
            <Link
              to="/profile"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <IconButton color="inherit">
                <AccountCircleIcon />
              </IconButton>
            </Link>
            <IconButton color="inherit">
              <Badge badgeContent={notificationsNo} color="secondary">
                <NotificationsIcon onClick={handleNotification} />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          {mainListItems}
          <Divider />
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Input
              ref={inputRef}
              placeholder="Search For Alumni"
              sx={{
                width: "78%",
                fontSize: "15px",
                fontWeight: "550",
                marginLeft: "5px",
                marginBottom: "-3px",
              }}
              onChange={handleSearchChange}
            />
            <IconButton onClick={openFilterMenu} sx={{ marginLeft: "10px" }}>
              <FilterAltIcon />
            </IconButton>
            {apiResponse &&
              apiResponse.result &&
              apiResponse.result.length > 0 && (
                <Grid container spacing={3}>
                  {apiResponse.result.map((user, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                      <UserCard cardUser={user} />
                    </Grid>
                  ))}
                </Grid>
              )}
          </Container>
        </Box>
      </Box>
      <FilterMenu
        open={showFilterMenu}
        onClose={closeFilterMenu}
        applyFilters={applyFilters}
        anchorEl={inputRef.current}
      />
    </ThemeProvider>
  );
};

export default Dashboard;