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
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "1.5rem",
});

const ProfileDetails = styled(Grid)({
  fontFamily: "Roboto, sans-serif",
  fontSize: "0.9rem",
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  marginRight: theme.spacing(2),
}));

const StudentProfilePage = () => {
    const { user } = useAuth0();
    const userContext = useUserContext();
  
    return (
      <Container>
        <ProfileContainer>
          <ProfileHeader>
            {user?.picture && (
              <StyledAvatar src={user.picture} alt={user?.name} />
            )}
            <Box>
              <Typography variant="h4" component="h2">
                {userContext.user.name}
              </Typography>
            </Box>
          </ProfileHeader>
          <Divider />
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} style={{ textAlign: "center" }}>
                <Typography variant="h6" gutterBottom style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>
                  Specialization
                </Typography>
                <Typography variant="body1" gutterBottom style={{ fontSize: "1.1rem", fontFamily: "Arial, sans-serif" }}>
                  {userContext.user.branch}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} style={{ textAlign: "center" }}>
                <Typography variant="h6" gutterBottom style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>
                  Batch
                </Typography>
                <Typography variant="body1" gutterBottom style={{ fontSize: "1.1rem", fontFamily: "Arial, sans-serif" }}>
                  {userContext.user.batch}
                </Typography>
              </Grid>
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
  
  export default StudentProfilePage;