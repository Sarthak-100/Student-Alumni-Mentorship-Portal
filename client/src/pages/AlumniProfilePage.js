import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Stack,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserContext } from "../context/UserContext";
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

const ElegantButton = styled(Button)`
  background-color: #1976d2;
  color: #fff;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  font-weight: 500;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #0d47a1;
  }
`;

const AlumniProfilePage = () => {
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
    try {
      const response = await axios.put(
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
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
      toggleEditMode();
    } catch (error) {
      console.error("API Error:", error);
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
          <Stack direction="column" spacing={1}>
            <ElegantTypography variant="h4" component="h2">
              {userContext.user.name}
            </ElegantTypography>
            {!editMode && (
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <ElegantTypography>
                    <b>Specialization </b>: {userContext.user.branch}
                  </ElegantTypography>
                </Grid>
                <Grid item xs={6}>
                  <ElegantTypography>
                    <b>Batch</b>: {userContext.user.batch}
                  </ElegantTypography>
                </Grid>
                <Grid item xs={12}>
                  <ElegantTypography>
                    <b>Email</b>: {user.email}
                  </ElegantTypography>
                </Grid>
              </Grid>
            )}
          </Stack>

          <ElegantButton
            variant="contained"
            color="primary"
            onClick={editMode ? saveProfile : toggleEditMode}
          >
            {editMode ? "Save Profile" : "Edit Profile"}
          </ElegantButton>
        </ProfileHeader>
        
        {!editMode && (
          <Grid container spacing={1}>
          {/* Work Section */}
          <Grid item xs={12} md={6}>
            <ElegantTypography variant="h6" className="bold">
              Work
            </ElegantTypography>
            <ElegantTypography>
              <b>Role</b>: {editedValues.role}
            </ElegantTypography>
            <ElegantTypography>
              <b>Organization</b>: {editedValues.organization}
            </ElegantTypography>
          </Grid>
        
          {/* Location Section */}
          <Grid item xs={12} md={6}>
            <ElegantTypography variant="h6" className="bold">
              Location
            </ElegantTypography>
            <ElegantTypography>
            {editedValues.city},{editedValues.state}
            </ElegantTypography>
            <ElegantTypography>
              {editedValues.country}
            </ElegantTypography>
          </Grid>
        </Grid>
        )}
        
        {editMode && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ElegantTypography variant="h6">Work</ElegantTypography>
              <TextField
                label="Role"
                value={editedValues.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Organization"
                value={editedValues.organization}
                onChange={(e) =>
                  handleInputChange("organization", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <ElegantTypography variant="h6">Location</ElegantTypography>
              <TextField
                label="City"
                value={editedValues.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                fullWidth
              />
              <TextField
                label="State"
                value={editedValues.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                fullWidth
              />
              <TextField
                label="Country"
                value={editedValues.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
      </ProfileContainer>
    </Container>
  );
};

export default AlumniProfilePage;
