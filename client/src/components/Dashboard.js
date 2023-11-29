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

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TodayIcon from '@mui/icons-material/Today';
import ChatIcon from "@mui/icons-material/Chat";
import { Link } from "react-router-dom";
import { mainListItems, secondaryListItems } from "./dashboard copy/listItems";
import FilterMenu from "./Filter";
import UserCard from "./UserCard";
import { useUserContext } from "../context/UserContext";
import LoginButton from "./LoginButton";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../context/SocketContext";
import { io } from "socket.io-client";
import socket from "../chatSocket.js";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
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

const defaultTheme = createTheme();

const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const inputRef = useRef(null);

  const userContext = useUserContext();

  const { user, logout } = useAuth0();

  const { setSocketValue } = useSocketContext();

  // const session = useSession(); // tokens, when session exists we have a user
  // const supabase = useSupabaseClient(); // talk to supabase!
  // const { isLoading } = useSessionContext();
  
  // if(isLoading) {
  //   return <></>
  // }

  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const openFilterMenu = () => {
    setShowFilterMenu(true);
  };

  const closeFilterMenu = () => {
    setShowFilterMenu(false);
  };

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
              userContext.login(response.data.user);
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

  const applyFilters = (filters) => {
    const baseUrl = "http://localhost:4000/api/v1/student/filter-alumni/search";

    const filterParams = new URLSearchParams(filters).toString();
    const apiUrl = `${baseUrl}?${filterParams}`;
    console.log(apiUrl);
    axios
      .get(apiUrl)
      .then((response) => {
        setApiResponse(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });

    closeFilterMenu();
  };

  const handleSearchChange = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);

    // Make API call to fetch filtered results based on searchText
    const apiUrl = `http://localhost:4000/api/v1/student/filter-alumni/alumniPrefix?prefix=${searchText}`;
    console.log(apiUrl);
    axios
      .get(apiUrl)
      .then((response) => {
        setApiResponse(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  const handleCalendarClick = () => {
    navigate("/calendar");
  };

  const handleChat = () => {
    navigate("/chat/welcome");
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
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
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
          {secondaryListItems}
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
