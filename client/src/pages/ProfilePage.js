
import { useUserContext } from "../context/UserContext";
// import axios from "axios";
// import { useSocketContext } from "../context/SocketContext";

// const CenteredContainer = styled(Container)(({ theme }) => ({
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   height: "70vh",
//   backgroundColor: "#f0f0f0",
// }));

// const ProfileAvatar = styled(Avatar)(({ theme }) => ({
//   width: 150,
//   height: 150,
// }));

// const ProfilePage = () => {
//   const { user, logout } = useAuth0();
//   const userContext = useUserContext();

//   const [editMode, setEditMode] = useState(false);
//   const [editedValues, setEditedValues] = useState({
//     role: userContext.user?.work?.role,
//     organization: userContext.user?.work?.organization,
//     city: userContext.user?.location?.city,
//     state: userContext.user?.location?.state,
//     country: userContext.user?.location?.country,
//   });

//   const toggleEditMode = () => {
//     setEditMode(!editMode);
//   };

//   const handleInputChange = (field, value) => {
//     setEditedValues((prevValues) => ({
//       ...prevValues,
//       [field]: value,
//     }));
//   };

//   const saveProfile = async () => {
//     console.log("INSIDE SAVE PROFILE");
//     try {
//       await axios
//         .put(
//           `http://localhost:4000/api/v1/users/updateAlumniProfile?userId=${userContext.user._id}`,
//           {
//             work: {
//               role: editedValues.role,
//               organization: editedValues.organization,
//             },
//             location: {
//               city: editedValues.city,
//               state: editedValues.state,
//               country: editedValues.country,
//             },
//           },
//           {
//             headers: {
//               "Content-Type": "application/json", // Set the content type to JSON
//             },
//           }
//         )
//         .then(async (response) => {
//           console.log(response);
//           await axios
//             .get(
//               `http://localhost:4000/api/v1/users/myProfile?email=${user?.email}`,
//               {
//                 withCredentials: true,
//               }
//             )
//             .then((response) => {
//               if (response.data.success && !response.data.user.removed) {
//                 // console.log("INSIDE PROFILE API", response.data);
//                 let tempUser = response.data.user;
//                 let user_type = response.data.user_type;
//                 tempUser.user_type = user_type;
//                 // console.log("INSIDE PROFILE API 2", tempUser);
//                 userContext.login(tempUser);
//               } else {
//                 console.log("Login Failed");
//                 logout({ returnTo: "http://localhost:5000" });
//                 // logout();
//               }
//             });
//           toggleEditMode();
//         })
//         .catch((error) => {
//           console.error("API Error:", error);
//         });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <CenteredContainer>
//       <Paper
//         sx={{
//           p: 2,
//           textAlign: "center",
//           backgroundColor: "white",
//           boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
//         }}
//       >
//         {user?.picture && <img src={user.picture} alt={user?.name} />}
//         <Typography variant="h5" component="div">
//           {user?.name}
//         </Typography>
//         <Typography variant="h6" component="div">
//           Specialization:
//         </Typography>
//         <Typography>{userContext.user?.branch}</Typography>
//         <Typography variant="h6" component="div">
//           Batch:
//         </Typography>
//         <Typography>{userContext.user.batch}</Typography>
//         <Typography variant="h5" component="div">
//           Contact Information
//         </Typography>
//         <Typography>Email : {user.email}</Typography>
//         <div>
//           {editMode && userContext.user.user_type === "alumni" ? (
//             <div>
//               <Typography variant="h5" component="div">
//                 Work
//               </Typography>
//               <TextField
//                 label="Role"
//                 value={editedValues.role}
//                 onChange={(e) => handleInputChange("role", e.target.value)}
//               />
//               <TextField
//                 label="Organization"
//                 value={editedValues.organization}
//                 onChange={(e) =>
//                   handleInputChange("organization", e.target.value)
//                 }
//               />
//               <Typography variant="h5" component="div">
//                 Location
//               </Typography>
//               <TextField
//                 label="City"
//                 value={editedValues.city}
//                 onChange={(e) => handleInputChange("city", e.target.value)}
//               />
//               <TextField
//                 label="State"
//                 value={editedValues.state}
//                 onChange={(e) => handleInputChange("state", e.target.value)}
//               />
//               <TextField
//                 label="Country"
//                 value={editedValues.country}
//                 onChange={(e) => handleInputChange("country", e.target.value)}
//               />
//             </div>
//           ) : (
//             <div>
//               <Typography variant="h5" component="div">
//                 Work
//               </Typography>
//               <Typography>Role : {editedValues.role}</Typography>
//               <Typography>
//                 Organization : {editedValues.organization}
//               </Typography>
//               <Typography>City : {editedValues.city}</Typography>
//               <Typography>State : {editedValues.state}</Typography>
//               <Typography>Country : {editedValues.country}</Typography>
//             </div>
//           )}
//         </div>
//         <IconButton
//           variant="contained"
//           color="primary"
//           onClick={editMode ? saveProfile : toggleEditMode}
//           style={{
//             display: userContext.user.user_type === "alumni" ? "block" : "none",
//           }}
//         >
//           {editMode ? "Save Profile" : "Edit Profile"}
//         </IconButton>
//       </Paper>
//     </CenteredContainer>
//   );
// };
import AdminProfilePage from "./AdminProfilePage";
import AlumniProfilePage from "./AlumniProfilePage";
import StudentProfilePage from "./StudentProfilePage";
import React from 'react'

const ProfilePage = () => {
  const userContext = useUserContext(); // Assuming this gives you access to user context

  // Destructure the user object from userContext
  const { user } = userContext;

  let profileComponent = null;

  // Conditionally set the profileComponent based on user_type
  if (user.user_type === "student") {
    profileComponent = <StudentProfilePage />;
  } else if (user.user_type === "alumni") {
    profileComponent = <AlumniProfilePage />;
  } else if (user.user_type === "admin") {
    profileComponent = <AdminProfilePage />;
  } else {
    // Handle other user types or no user type specified
    profileComponent = <div>No profile found for this user type</div>;
  }

  return (
    <div>
      {profileComponent}
    </div>
  )
}

export default ProfilePage;


