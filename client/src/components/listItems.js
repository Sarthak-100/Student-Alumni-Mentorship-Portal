import * as React from "react";
import ListItemIconButton from "@mui/material/ListItemIconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useNavigate } from "react-router-dom";

const ListItems = ({ showFilterAlumniCallback ,showFilterStudentCallback}) => {
  const navigate = useNavigate();

  const handleFilterAlumniClick = (showFilterAlumniCallback) => {
    navigate("/filterAlumni");
    showFilterAlumniCallback(true);
  };

  const handleFilterStudentClick = (showFilterStudentCallback) => {
    navigate("/filterStudent");
    showFilterStudentCallback(true);
  };

  return (
    <React.Fragment>
      <ListItemIconButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemIconButton>

      <ListItemIconButton
        onClick={() => handleFilterAlumniClick(showFilterAlumniCallback)}
      >
        <ListItemIcon>
          <FilterAltIcon />
        </ListItemIcon>
        <ListItemText primary="Filter Alumni" />
      </ListItemIconButton>
  
      <ListItemIconButton
      onClick={() => handleFilterStudentClick(showFilterStudentCallback)}>
        <ListItemIcon>
          <FilterAltIcon />
        </ListItemIcon>
        <ListItemText primary="Filter Students" />
      </ListItemIconButton>
      
      <ListItemIconButton>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItemIconButton>
      <ListItemIconButton>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Integrations" />
      </ListItemIconButton>
    </React.Fragment>
  );
};

export default ListItems;