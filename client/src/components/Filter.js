import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Popover,
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import UserCard from "./UserCard";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

// const FilterMenu = ({ open, onClose, applyFilters, anchorEl }) => {
//   const [selectedBatch, setSelectedBatch] = useState("");
//   const [selectedBranch, setSelectedBranch] = useState("");
//   const [selectedProfile, setSelectedProfile] = useState("");
//   const [selectedCompany, setSelectedCompany] = useState("");
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [apiResponse, setApiResponse] = useState(null);
//   const [applyClicked, setApplyClicked] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           'http://localhost:4000/api/v1/student/filter-alumni/values'
//         );
//         setApiResponse(response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleApplyFilters = () => {
//     const filters = {
//       batch: selectedBatch,
//       branch: selectedBranch,
//       current_role: selectedProfile,
//       current_organization: selectedCompany,
//       current_location: selectedCountry,
//     };

//     applyFilters(filters);
//     setApplyClicked(false);
//     // onClose(); // Close the popover after applying filters
//   };

//   const handleClearFilters = () => {
//     setSelectedBatch("");
//     setSelectedBranch("");
//     setSelectedProfile("");
//     setSelectedCompany("");
//     setSelectedCountry("");
//     applyFilters({
//       batch: "",
//       branch: "",
//       current_role: "",
//       current_organization: "",
//       current_location: "",
//     });
//     setApplyClicked(true);
//   };

//   const handleClearField = (field) => {
//     switch (field) {
//       case 'batch':
//         setSelectedBatch("");
//         break;
//       case 'branch':
//         setSelectedBranch("");
//         break;
//       case 'profile':
//         setSelectedProfile("");
//         break;
//       case 'company':
//         setSelectedCompany("");
//         break;
//       case 'country':
//         setSelectedCountry("");
//         break;
//       default:
//         break;
//     }
//   };
const FilterMenu = ({ open, onClose, applyFilters, anchorEl }) => {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [applyClicked, setApplyClicked] = useState(false);
  const [isFieldSelected, setIsFieldSelected] = useState({
    batch: false,
    branch: false,
    profile: false,
    company: false,
    country: false,
  });
  // const [renderField, setRenderField] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4000/api/v1/student/filter-alumni/values'
        );
        setApiResponse(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   if (renderField.field && renderField.label) {
  //     console.log("rendering", renderField.field, renderField.label);
  //     renderTextField(renderField.field, renderField.label, "", () => {});
  //     setRenderField({ field: '', label: '' }); // Reset the flag
  //   }
  // }, [renderField]);

  const handleApplyFilters = () => {
    const filters = {
      batch: selectedBatch,
      branch: selectedBranch,
      current_role: selectedProfile,
      current_organization: selectedCompany,
      current_location: selectedCountry,
    };

    applyFilters(filters);
    setApplyClicked(false);
  };

  const handleClearFilters = () => {
    setSelectedBatch("");
    setSelectedBranch("");
    setSelectedProfile("");
    setSelectedCompany("");
    setSelectedCountry("");
    applyFilters({
      batch: "",
      branch: "",
      current_role: "",
      current_organization: "",
      current_location: "",
    });
    setApplyClicked(true);
    setIsFieldSelected({
      batch: false,
      branch: false,
      profile: false,
      company: false,
      country: false,
    });
  };

  const handleToggleFieldMode = (field) => {
    setIsFieldSelected((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleClearField = (field, label) => {
    // const value = isFieldSelected[field];
    // console.log("check", field, isFieldSelected[field], label);
    if (isFieldSelected[field]) {
      switch (field) {
        case 'batch':
          setSelectedBatch("");
          break;
        case 'branch':
          setSelectedBranch("");
          break;
        case 'profile':
          setSelectedProfile("");
          break;
        case 'company':
          setSelectedCompany("");
          break;
        case 'country':
          setSelectedCountry("");
          break;
        default:
          break;
      }
    }
    // setRenderField({ field, label });
    handleToggleFieldMode(field);
    // console.log("before calling", field, isFieldSelected[field], label);
    // renderTextField(field, label, "", () => {});
    // console.log("check karlo", field, isFieldSelected[field], label);
    // if (!value) {
    //   console.log("check2", value, field, isFieldSelected[field], label);
    //   renderTextField(field, label, "", () => {});
    // }
  };

  const renderTextField = (field, label, value, onChange) => (
    isFieldSelected[field] ? (
      <TextField
        label={label}
        fullWidth
        variant="outlined"
        margin="normal"
        value={value}
        onChange={onChange}
        InputProps={{
          endAdornment: (
            <ClearOutlinedIcon
              style={{ cursor: 'pointer', opacity: 0.65 }}
              onClick={() => handleClearField(field, label)}
            />
          ),
        }}
      />
    ) : (
      <TextField
        select
        label={label}
        fullWidth
        variant="outlined"
        margin="normal"
        value={value}
        onChange={onChange}
      >
        <MenuItem value="">Select {label}</MenuItem>
          {apiResponse &&
            apiResponse[field + 'es'] &&
            apiResponse[field + 'es'].map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
        </TextField>
    )
  );
  
  return (
    <Popover
      open={open || applyClicked} // Open when parent open or apply is clicked
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={onClose} // Close the popover if clicking outside the popover
      PaperProps={{
        style: {
          width: "300px",
        },
      }}
    >
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Filter Alumni
        </Typography>
        <Divider />

        {renderTextField('batch', 'Batch', selectedBatch, (e) => {setSelectedBatch(e.target.value);
        handleToggleFieldMode('batch');
        //render it other way
        <TextField
          label={'Batch'}
          fullWidth
          variant="outlined"
          margin="normal"
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          InputProps={{
            endAdornment: (
              <ClearOutlinedIcon
                style={{ cursor: 'pointer', opacity: 0.65 }}
                onClick={() => handleClearField('batch', 'Batch')}
              />
            ),
          }}
        />
        })}
        {renderTextField('branch', 'Branch', selectedBranch, (e) => setSelectedBranch(e.target.value))}
        {renderTextField('profile', 'Job Profile', selectedProfile, (e) => setSelectedProfile(e.target.value))}
        {renderTextField('company', 'Company', selectedCompany, (e) => setSelectedCompany(e.target.value))}
        {renderTextField('country', 'Country', selectedCountry, (e) => setSelectedCountry(e.target.value))}

        {/* <TextField
          select
          label="Batch"
          fullWidth
          variant="outlined"
          margin="normal"
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          SelectProps={
            selectedBatch
              ? {
                  endAdornment: (
                    <ClearOutlinedIcon
                      style={{ cursor: 'pointer', opacity: 0.65 }} // Adjust opacity for a lighter appearance
                      onClick={() => handleClearField('batch')}
                    />
                  ),
                }
              : null
          }
        >
          {apiResponse &&
            apiResponse.batches &&
            apiResponse.batches.map((batch) => (
              <MenuItem key={batch} value={batch}>
                {batch}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          select
          label="Branch"
          fullWidth
          variant="outlined"
          margin="normal"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          {apiResponse &&
            apiResponse.branches &&
            apiResponse.branches.map((branch) => (
              <MenuItem key={branch} value={branch}>
                {branch}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          select
          label="Job Profile"
          fullWidth
          variant="outlined"
          margin="normal"
          value={selectedProfile}
          onChange={(e) => setSelectedProfile(e.target.value)}
        >
          {apiResponse &&
            apiResponse.roles &&
            apiResponse.roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          select
          label="Company"
          fullWidth
          variant="outlined"
          margin="normal"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          {apiResponse &&
            apiResponse.companies &&
            apiResponse.companies.map((company) => (
              <MenuItem key={company} value={company}>
                {company}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          select
          label="Country"
          fullWidth
          variant="outlined"
          margin="normal"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {apiResponse &&
            apiResponse.countries &&
            apiResponse.countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
        </TextField> */}

        <Box p={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" style={{ marginRight: '8px' }} onClick={handleApplyFilters}>
            Apply Filters
          </Button>
          <Button variant="outlined" size="small" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Box>

        {apiResponse && apiResponse.result && apiResponse.result.length > 0 && (
          <div>
            <Typography variant="h6" gutterBottom>
              API Response:
            </Typography>
            {apiResponse.result.map((user, index) => (
              <UserCard key={index} user={user} />
            ))}
          </div>
        )}
      </Box>
    </Popover>
  );
};

export default FilterMenu;