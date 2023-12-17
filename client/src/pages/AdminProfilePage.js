import React from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Grid,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserContext } from "../context/UserContext";

// Custom Styles
const ProfileContainer = styled(Box)(({ theme }) => ({
  width: "90%",
  maxWidth: 700,
  margin: "0 auto",
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`,
  backgroundColor: theme.palette.background.paper,
}));

const ProfileHeader = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "1.5rem",
});

const AdminProfilePage = () => {
  const { user } = useAuth0();
  const userContext = useUserContext();

  return (
    <Container>
      <ProfileContainer>
        <ProfileHeader>
          {user?.picture && (
            <Avatar
              src={user.picture}
              alt={user?.name}
              sx={{ width: 150, height: 150, marginBottom: 1 }}
            />
          )}
          <Box textAlign="center">
            <Typography variant="h4" component="h2">
              {userContext.user.name}
            </Typography>
          </Box>
        </ProfileHeader>
        <Divider />
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>
                Contact Information
              </Typography>
              <Typography variant="body1" style={{ fontSize: "1.1rem", fontFamily: "Arial, sans-serif" }}>
                Email: {user.email}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </ProfileContainer>
    </Container>
  );
};

export default AdminProfilePage;
