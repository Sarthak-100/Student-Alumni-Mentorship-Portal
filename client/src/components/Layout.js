// Import necessary dependencies from React and external libraries
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
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
  Badge,
  Divider,
  Drawer as MuiDrawer,
} from "@mui/material";

// Import icons and components
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import ProfilePage from "./../pages/ProfilePage";
import Notifications from "./../pages/Notifications";
import Hello from "./Hello";
import FilterAlumni from "./FilterAlumni.js";
import FilterStudent from "./FilterStudent.js";
import TodayIcon from "@mui/icons-material/Today";
import { useUserContext } from "../context/UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../context/SocketContext";
import { Link } from "react-router-dom";
import socket from "../chatSocket.js";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useNotificationsNoContext } from "../context/NotificationsNoContext.js";
import Calendar from "./Calendar.js";

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

// Layout component
const Layout = () => {
  // State variables and hooks initialization
  const [open, setOpen] = useState(true);

  // Function to toggle the drawer
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Context and authentication hooks
  const userContext = useUserContext();
  const { user, logout } = useAuth0();
  const navigate = useNavigate();
  const { setSocketValue } = useSocketContext();

  const { notificationsNo, setNotificationsNoValue, increment } =
    useNotificationsNoContext();
  const isStudentOrAlumni =
    user && (user.user_type === "student" || user.user_type === "alumni");

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
              // console.log("INSIDE PROFILE API", response.data);
              let tempUser = response.data.user;
              let user_type = response.data.user_type;
              tempUser.user_type = user_type;
              // console.log("INSIDE PROFILE API 2", tempUser);
              userContext.login(tempUser);
              setSocketValue(socket);
            } else {
              console.log("Login Failed");
              logout({ returnTo: "http://localhost:5000" });
              // logout();
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

  const handleCalendarClick = () => {
    console.log("calendar clicked");
    navigate("/calendar");
  };

  // Function to handle chat button click
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
            <IconButton color="inherit" onClick={handleCalendarClick}>
              <TodayIcon /> {/* Calendar icon */}
            </IconButton>
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
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <ListItemButton>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </Link>
          <Link
            to="/filterAlumni"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItemButton>
              <ListItemIcon>
                <FilterAltIcon />
              </ListItemIcon>
              <ListItemText primary="Filter Alumni" />
            </ListItemButton>
          </Link>
          {isStudentOrAlumni ? (
            <ListItemButton>
              <ListItemIcon>
                <LayersIcon />
              </ListItemIcon>
              <ListItemText primary="Integrations" />
            </ListItemButton>
          ) : (
            <Link
              to="/filterStudent"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <FilterAltIcon />
                </ListItemIcon>
                <ListItemText primary="Filter Student" />
              </ListItemButton>
            </Link>
          )}

          <ListItemButton>
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItemButton>

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
            {/* Defining routes using React Router */}
            <Routes>
              {/* Nested routes inside the Layout */}
              <Route index element={<Hello />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/filterAlumni" element={<FilterAlumni />} />
              <Route path="/filterStudent" element={<FilterStudent />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
