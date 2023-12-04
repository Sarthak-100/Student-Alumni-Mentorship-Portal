import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserContext } from "../context/UserContext";
import axios from "axios";

const CenteredContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "70vh",
  backgroundColor: "#f0f0f0",
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
}));

const ProfilePage = () => {
  const { user } = useAuth0();
  const userContext = useUserContext();

  const [editMode, setEditMode] = useState(false);
  const [editedValues, setEditedValues] = useState({
    role: userContext.user?.work?.role,
    organization: userContext.user?.work?.organization,
    city: userContext.user?.location?.city,
    state: userContext.user?.location?.state,
    country: userContext.user?.location?.country,
  });

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (field, value) => {
    setEditedValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const saveProfile = async () => {
    console.log("INSIDE SAVE PROFILE");
    try {
      await axios
        .put(
          `http://localhost:4000/api/v1/users/updateAlumniProfile?userId=${userContext.user._id}`,
          {
            work: {
              role: editedValues.role,
              organization: editedValues.organization,
            },
            location: {
              city: editedValues.city,
              state: editedValues.state,
              country: editedValues.country,
            },
          },
          {
            headers: {
              "Content-Type": "application/json", // Set the content type to JSON
            },
          }
        )
        .then((response) => {
          console.log(response);
          toggleEditMode();
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
        {user?.picture && <img src={user.picture} alt={user?.name} />}
        <Typography variant="h5" component="div">
          {user?.name}
        </Typography>
        <Typography variant="h6" component="div">
          Specialization:
        </Typography>
        <Typography>{userContext.user.branch}</Typography>
        <Typography variant="h6" component="div">
          Batch:
        </Typography>
        <Typography>{userContext.user.batch}</Typography>
        <Typography variant="h5" component="div">
          Contact Information
        </Typography>
        <Typography>Email : {user.email}</Typography>
        <div>
          {editMode && userContext.user.user_type === "alumni" ? (
            <div>
              <Typography variant="h5" component="div">
                Work
              </Typography>
              <TextField
                label="Role"
                value={editedValues.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
              />
              <TextField
                label="Organization"
                value={editedValues.organization}
                onChange={(e) =>
                  handleInputChange("organization", e.target.value)
                }
              />
              <Typography variant="h5" component="div">
                Location
              </Typography>
              <TextField
                label="City"
                value={editedValues.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
              <TextField
                label="State"
                value={editedValues.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
              />
              <TextField
                label="Country"
                value={editedValues.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
              />
            </div>
          ) : null
          }
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={editMode ? saveProfile : toggleEditMode}
          style={{
            display: userContext.user.user_type === "alumni" ? "block" : "none",
          }}
        >
          {editMode ? "Save Profile" : "Edit Profile"}
        </Button>
      </Paper>
    </CenteredContainer>
  );
};

export default ProfilePage;