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
import Admin_Charts from "./AdminCharts";
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
import BarChartIcon from "@mui/icons-material/BarChart";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useNotificationsNoContext } from "../context/NotificationsNoContext.js";
import { useClearNotificationContext } from "../context/ClearNotificationContext";
import { useReportedNoContext } from "../context/ReportedNoContext";
import { useMessageNotificationsNoContext } from "../context/messageNotificationsNoContext";
import Calendar from "./Calendar.js";
import UpcomingEvents from "./UpcomingEvents.js";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import LogoutIconButton from "./LogoutButton";
import Reports from "../pages/Reports.js";
import CreateProfile from "../pages/CreateProfile";

const iconContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  marginRight: 0, // Adjust the right margin for the entire icon container
};

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

  const reportedNoContext = useReportedNoContext();

  const messageNotificationsNoContext = useMessageNotificationsNoContext();

  const { clearNotification, setClearNotificationValue } =
    useClearNotificationContext();

  const [reloadNotificationPage, setReloadNotificationPage] = useState(0);
  const [reloadReportNotificationPage, setReloadReportNotificationPage] =
    useState(0);

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
            if (response.data.success && !response.data.user.removed) {
              // console.log("INSIDE PROFILE API", response.data);
              let tempUser = response.data.user;
              let user_type = response.data.user_type;
              tempUser.user_type = user_type;
              // console.log("INSIDE PROFILE API 2", tempUser);
              userContext.login(tempUser);
              setSocketValue(socket);
            } else {
              console.log("Login Failed");
              // logout({ returnTo: "http://localhost:5000" });
              logout();
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
    socket.on("getRemoveUserNotification", async (data) => {
      logout({ returnTo: "http://localhost:5000" });
    });
    return () => {
      socket.off("getRemoveUserNotification");
    };
  });

  useEffect(() => {
    const getNotificationsNo = async () => {
      console.log("getNotificationsNo", userContext.user?._id);
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
  }, [userContext]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        await axios
          .get(
            `http://localhost:4000/api/v1/conversations/getConversations?user_id=${userContext.user?._id}`,
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            const conversationsTemp = response.data;
            console.log(conversationsTemp);
            let countT = 0;
            conversationsTemp.forEach((c) => {
              console.log("%%%%%%", c.unseenMessages[userContext.user?._id]);
              countT += c.unseenMessages[userContext.user?._id];
            });
            console.log(countT);
            messageNotificationsNoContext.setMessageNotificationsNoValue(
              countT
            );
            console.log(messageNotificationsNoContext.messageNotificationsNo);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [userContext]);

  useEffect(() => {
    const getReportedNo = async () => {
      try {
        await axios
          .get(`http://localhost:4000/api/v1/reports/countUnresolvedReports`, {
            withCredentials: true,
          })
          .then((response) => {
            console.log(response);
            reportedNoContext.setReportedNoValue(response.data);
          })
          .catch((error) => {
            console.error("API Error:", error);
          });
      } catch (error) {
        console.error(error);
      }
    };
    getReportedNo();
  }, [userContext]);

  useEffect(() => {
    if (userContext.user?._id !== undefined) {
      //store the signed in user avatar in the database
      console.log(
        "INSIDE USE EFFECT",
        userContext.user?._id,
        user?.picture,
        typeof user?.picture
      );
      try {
        axios
          .post(
            `http://localhost:4000/api/v1/users/updateAvatar?userId=${userContext.user?._id}`,
            {
              avatar: user?.picture,
            },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            console.log("Avatar updated successfully!", response.data);
          })
          .catch((error) => {
            console.error("API Error:", error);
          });
      } catch (error) {
        console.error("Error details:", error);
      }
    }
  }, [user?.picture, userContext]);

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
    socket.emit("addUser", userContext.user?._id, userContext.user?.user_type);
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
          data.conversation.unseenMessages[userContext.user._id] += 1;
          await axios
            .put(
              `http://localhost:4000/api/v1/conversations/updateConversation?conversationId=${data.conversation._id}`,
              {
                unseenMessages: data.conversation.unseenMessages,
              },
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              messageNotificationsNoContext.increment(1);
            })
            .catch((error) => {
              console.log(error);
            });
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
        messageNotificationsNoContext.increment(1);
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
                  data.blockedStatus ? "blocked" : "unblocked"
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
          if (window.location.pathname === "/notifications") {
            setReloadNotificationPage((prevReload) => prevReload + 1);
          } else {
            increment();
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
    socket.on("reportNotificationAdmin", async (data) => {
      console.log("reportNotificationAdmin");
      if (window.location.pathname === "/reports") {
        setReloadReportNotificationPage((prevReload) => prevReload + 1);
      } else {
        reportedNoContext.increment();
      }
    });
    socket.on("reportNotificationUser", async (data) => {
      if (window.location.pathname === "/notifications") {
        setReloadNotificationPage((prevReload) => prevReload + 1);
      } else {
        increment();
      }
    });
    socket.on("getResolvedNotification", async (data) => {
      if (window.location.pathname === "/notifications") {
        setReloadNotificationPage((prevReload) => prevReload + 1);
      } else {
        increment();
      }
    });
    socket.on("getFixMeetingNotification", async (data) => {
      if (window.location.pathname === "/notifications") {
        setReloadNotificationPage((prevReload) => prevReload + 1);
      } else {
        increment();
      }
    });

    socket.on("receiveUpdateDeletedEvent", async (data) => {
      if (window.location.pathname === "/notifications") {
        setReloadNotificationPage((prevReload) => prevReload + 1);
      } else {
        increment();
      }
    });

    socket.on("notifyingAdminStudentBlocked", async (data) => {
      if (window.location.pathname === "/notifications") {
        setReloadNotificationPage((prevReload) => prevReload + 1);
      } else {
        increment();
      }
    });
    return () => {
      socket.off("getMessageNotification");
      socket.off("receiveNewConversation&MessageNotification");
      socket.off("updateBlockedStatusNotification");
      socket.off("reportNotificationAdmin");
      socket.off("reportNotificationUser");
      socket.off("receiveUpdateDeletedEvent");
      socket.off("getResolvedNotification");
      socket.off("getFixMeetingNotification");
      socket.off("notifyingAdminStudentBlocked");
    };
  });

  useEffect(() => {
    const clearNotifications = async () => {
      console.log("clear not useEffect 1");
      console.log("clearNotification", clearNotification);
      console.log("window.location.pathname", window.location.pathname);
      if (clearNotification && window.location.pathname !== "/notifications") {
        console.log("clear not useEffect 2");
        try {
          await axios
            .delete(
              `http://localhost:4000/api/v1/notifications/clearNotifications?userId=${userContext.user._id}`,
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.error("API Error:", error);
            });
        } catch (error) {
          console.error(error);
        }
        setNotificationsNoValue(0);
        setClearNotificationValue(0);
      }
    };
    clearNotifications();
  });

  const handleReports = () => {
    navigate("/reports");
  };

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
              sx={{ flexGrow: 1, fontSize: "1.5rem" }}
            >
              Dashboard
            </Typography>
            {userContext.user?.user_type === "admin" ? (
              <IconButton color="inherit" title="Complaints">
                <Badge
                  badgeContent={reportedNoContext?.reportedNo}
                  color="secondary"
                  
                >
                  <AssignmentLateIcon onClick={handleReports} style={{ fontSize: "1.75rem" }}/>
                </Badge>
              </IconButton>
            ) : null}
            <div style={iconContainerStyle}>
              <IconButton color="inherit" title="Notifications">
                <Badge badgeContent={notificationsNo} color="secondary">
                  <NotificationsIcon
                    style={{ fontSize: "2rem" }}
                    onClick={handleNotification}
                  />
                </Badge>
              </IconButton>
              <IconButton
                color="inherit"
                title="Calendar"
                onClick={handleCalendarClick}
              >
                <TodayIcon style={{ fontSize: "2rem" }} />
              </IconButton>
              <IconButton color="inherit" title="Chat" onClick={handleChat}>
                <Badge
                  badgeContent={
                    messageNotificationsNoContext.messageNotificationsNo
                  }
                  color="secondary"
                >
                  <ChatIcon style={{ fontSize: "2rem" }} />
                </Badge>
              </IconButton>
              <Link
                to="/profile"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <IconButton color="inherit" title="Profile">
                  <AccountCircleIcon style={{ fontSize: "2rem" }} />
                </IconButton>
              </Link>
              <IconButton color="inherit" title="Logout">
                <LogoutIconButton />
              </IconButton>
            </div>
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
          {userContext.user?.user_type === "admin" ? (
            <>
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
              <Link
                to="/stats"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <BarChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reports" />
                </ListItemButton>
              </Link>
            </>
          ) : null}

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
              <Route path="/stats" element={<Admin_Charts />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/upcoming-events" element={<UpcomingEvents />} />
              <Route
                path="/notifications"
                element={
                  <Notifications
                    reloadNotificationPage={reloadNotificationPage}
                  />
                }
              />
              <Route
                path="/reports"
                element={
                  <Reports
                    reloadReportNotificationPage={reloadReportNotificationPage}
                  />
                }
              />
              <Route path="/createProfile" element={<CreateProfile />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
