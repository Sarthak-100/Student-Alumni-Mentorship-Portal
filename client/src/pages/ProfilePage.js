// ProfilePage.js
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Link,
} from "@mui/material";
import { styled } from "@mui/system";
import { useUserContext } from "../context/UserContext";
import axios from "axios";

const CenteredContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#f0f0f0",
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
}));

const ProfilePage = () => {
  const { user } = useAuth0();
  const userContext = useUserContext();

  console.log("^^^^UserContext:^^^", userContext.user);

  const editProfile = async () => {
    /*

    let input parameters be of format from the form: 
    Work
    roleInp
    orgInp

    Location
    cityInp
    stateInp
    countryInp

    */
    try {
      await axios
        .update(
          `http://localhost:4000/api/v1/users/updateAlumniProfile?userId=${user._id}`,
          {
            /*
              here just plugin the input parameters in the format below. LETS SAY role and city is changedso 
                work: {
                  role: roleInp,
                  organization: orgInp,
                },
                location: {
                  city: cityInp,
                }

                just send in the above format
            */
          }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CenteredContainer>
      <Paper
        sx={{
          p: 2,
          textAlign: "center",
          backgroundColor: "white",
          boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* <ProfileAvatar src="your-profile-image-url.jpg" /> */}
        {user?.picture && <img src={user.picture} alt={user?.name} />}
        <Typography variant="h5" component="div">
          {user?.name}
        </Typography>
        {/* Username : {user.nickname} */}
        <Typography variant="h6" component="div">
          Specialization:
        </Typography>
        <Typography>{userContext.user.branch}</Typography>
        <Typography variant="h6" component="div">
          Batch:
        </Typography>
        <Typography>{userContext.user.batch}</Typography>

        <Button
          variant="contained"
          color="primary"
          style={{
            display: userContext.user.user_type === "alumni" ? "block" : "none",
          }}
        >
          Edit Profile
        </Button>
      </Paper>
      <Paper
        sx={{
          p: 2,
          textAlign: "center",
          marginTop: 2,
          backgroundColor: "white",
          boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h5" component="div">
          About Me
        </Typography>
        <Typography>
          I'm a passionate student looking to connect with alumni for mentorship
          opportunities.
        </Typography>
        <Typography variant="h5" component="div">
          Skills
        </Typography>
        <Typography>
          - Web Development - JavaScript - React - HTML/CSS - ...
        </Typography>
        <Typography variant="h5" component="div">
          Contact Information
        </Typography>
        <Typography>Email : {user.email}</Typography>
        {/* <Typography>
          LinkedIn: <Link href="https://www.linkedin.com/in/johndoe">https://www.linkedin.com/in/johndoe</Link>
        </Typography> */}
      </Paper>
    </CenteredContainer>
  );
};

export default ProfilePage;
