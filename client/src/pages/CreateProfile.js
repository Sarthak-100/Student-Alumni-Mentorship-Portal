import { IconButton } from "@mui/material";
import React from "react";
import axios from "axios";

const CreateProfile = () => {
  const createProfile = async () => {
    try {
      await axios
        .post("http://localhost:4000/api/v1/users/createProfile", {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <IconButton variant="contained" onClick={createProfile}>
        IconButton
      </IconButton>
    </div>
  );
};

export default CreateProfile;
