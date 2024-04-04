import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Grid,
  Stack,
} from "@mui/material";
import { styled } from "@mui/system";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserContext } from "../context/UserContext";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import axios from "axios";

// Custom Styles
const ProfileContainer = styled(Box)`
  width: 90%;
  max-width: 700px;
  margin: 0 auto;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ccc;
`;

const ElegantTypography = styled(Typography)`
  font-family: "Segoe UI", sans-serif;
  font-weight: 400;
  &.bold {
    font-weight: 700;
  }
`;

const EditProfileIconButton = styled(IconButton)`
  background-color: #1976d2;
  color: #fff;
  padding: 0.8rem;
  border-radius: 50%;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #0d47a1;
  }
`;

const AlumniProfilePage = () => {
  const { user, logout } = useAuth0();
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
        .then(async (response) => {
          console.log(response);
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
              } else {
                console.log("Login Failed");
                logout({ returnTo: "http://localhost:5000" });
                // logout();
              }
            });
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
    <Container>
      <ProfileContainer>
        <ProfileHeader>
          {user?.picture && (
            <Avatar
              src={user.picture}
              alt={user?.name}
              sx={{ width: 150, height: 150 }}
            />
          )}
          <Stack direction="column" spacing={1} alignItems="center">
            <ElegantTypography variant="h4" component="h2" style={{ fontSize: '35px' }}>
              {userContext.user.name}
            </ElegantTypography>
            {!editMode && (
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <ElegantTypography style={{ fontSize: '20px', textAlign: 'center' }}>
                    <b>Email</b>: {user.email}
                  </ElegantTypography>
                </Grid>
                <Grid item xs={6}>
                  <ElegantTypography style={{ fontSize: '20px', textAlign: 'center' }}>
                    <b>Specialization </b>: {userContext.user.branch}
                  </ElegantTypography>
                </Grid>
                <Grid item xs={6}>
                  <ElegantTypography style={{ fontSize: '20px', textAlign: 'center' }}>
                    <b>Batch</b>: {userContext.user.batch}
                  </ElegantTypography>
                </Grid>
                
              </Grid>
            )}
          </Stack>

          {editMode ? (
            <EditProfileIconButton
              variant="contained"
              color="primary"
              onClick={saveProfile}
              title="Save Profile"
            >
              <SaveIcon /> {/* Render Save Icon when in edit mode */}
            </EditProfileIconButton>
          ) : (
            <EditProfileIconButton
              variant="contained"
              color="primary"
              onClick={toggleEditMode}
              title="Edit Profile"
            >
              <EditIcon /> {/* Render Edit Icon when not in edit mode */}
            </EditProfileIconButton>
          )}
        </ProfileHeader>

        {!editMode && (
          <Grid container spacing={1}>
            {/* Work Section */}
            <Grid item xs={12} md={6}>
              <ElegantTypography variant="h6" className="bold">
                Work
              </ElegantTypography>
              <ElegantTypography style={{ fontSize: '20px' }}>
                <b>Role</b>: {editedValues.role}
              </ElegantTypography>
              <ElegantTypography style={{ fontSize: '20px' }}>
                <b>Organization</b>: {editedValues.organization}
              </ElegantTypography>
            </Grid>

            {/* Location Section */}
            <Grid item xs={12} md={6}>
              <ElegantTypography variant="h6" className="bold" style={{ fontSize: '20px' }}>
                Location
              </ElegantTypography>
              <ElegantTypography style={{ fontSize: '20px' }}>
                <b>City</b>: {editedValues.city}
              </ElegantTypography>
              <ElegantTypography style={{ fontSize: '20px' }}>
                <b>State</b>: {editedValues.state}
              </ElegantTypography>
              <ElegantTypography style={{ fontSize: '20px' }}>
                <b>Country</b>: {editedValues.country}
              </ElegantTypography>
            </Grid>
          </Grid>
        )}

        {editMode && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
            <ElegantTypography>Work</ElegantTypography>
              <TextField
                label="Role"
                value={editedValues.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                fullWidth
                InputProps={{
                  style: { height: '45px' }, // Adjust the height here
                }}
                style={{ marginTop: '20px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Organization"
                value={editedValues.organization}
                onChange={(e) =>
                  handleInputChange("organization", e.target.value)
                }
                InputProps={{
                  style: { height: '45px' }, // Adjust the height here
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
            <ElegantTypography>Location</ElegantTypography>
              <TextField
                label="City"
                value={editedValues.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                fullWidth
                InputProps={{
                  style: { height: '45px' }, // Adjust the height here
                }}
                style={{ marginTop: '20px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="State"
                value={editedValues.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                fullWidth
                InputProps={{
                  style: { height: '45px' }, // Adjust the height here
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                value={editedValues.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                fullWidth
                InputProps={{
                  style: { height: '45px' }, // Adjust the height here
                }}
              />
            </Grid>
          </Grid>
        )}
      </ProfileContainer>
    </Container>
  );
};

export default AlumniProfilePage;
