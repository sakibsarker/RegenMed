import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import Map from "../components/Map";
import styled from "styled-components";
import { AuthContext } from "../AuthContext";
import getProfile from "./getProfile";
import updateData from "./updateData";

const mainColor = "#4811ab"; // Define the main color variable

const EditButton = styled.button`
  color: ${mainColor};
  font-weight: bold;
  margin-top: 16px;
  padding: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: white;
    background-color: ${mainColor};
  }
`;

const Container = styled.div`
  min-height: calc(100vh - 64px);
  background-color: #f2f2f2;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 100px;

  .link {
    text-decoration: none;
    color: ${mainColor};
    font-weight: bold;
    margin-top: 16px;

    &:hover {
      color: white;
    }
  }
`;

const ReturnLink = styled(Typography)`
  && {
    color: ${mainColor};
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-size: 1.8rem;
    cursor: pointer;
    transition: font-size 0.3s;

    &:hover {
      font-size: 1.3rem; /* Increase the font size on hover */
      color: ${mainColor}; /* Set the color to the main color */
    }
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-left: 2rem;
`;

const MapContainer = styled.div`
  flex: 1;
  margin-right: 2rem;
`;

const CardContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 80%;

  .select-dropdown {
    appearance: none;
    background-color: #f2f2f2;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 4px;
    cursor: pointer;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px #bfbfbf;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Card = styled.section`
  display: flex;
  flex-direction: column;
  background-color: white;
  color: black;
  transition: background-color 0.3s, color 0.3s;
  padding: 12px;
  margin-bottom: 16px;
  width: 60%;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);

  a {
    color: ${mainColor};
    text-decoration: none;
    font-weight: bold;
    margin-top: 16px;
    transition: color 0.3s;

    &:hover {
      color: white;
    }
  }

  &:hover {
    background-color: ${mainColor};
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border: none;

    a {
      color: white;
    }

    button {
      color: white;
    }
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${mainColor};
    font-weight: bold;
    margin-top: 16px;
    padding: 8px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: white;
    }
  }
`;

const Profile = () => {
  const { loggedIn, currentUser } = useContext(AuthContext);
  const [cardStates, setCardStates] = useState([]);
  const [profileId, setProfileId] = useState(``);
  //add sakib
  const [loading, setLoading] = useState(false); // Add a loading state variable
  const [error, setError] = useState(null); // Add an error state variable
  //add sakib
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const resultRadius = state.resultRadius;
  const fromProfile = state.fromProfile;

  console.log("initial search on profile: ", state.initialSearch);

  console.log("current user from profile:", currentUser);
  let currentUserID;
  try {
    const jsonUser = JSON.parse(currentUser);
    console.log("jsonuser", jsonUser);
    currentUserID = jsonUser.userId; // Update the property name to "userId"
    console.log("current userid from json:", currentUserID);
  } catch (error) {
    console.error("Error parsing or accessing user data:", error);
  }

  useEffect(() => {
    const url = window.location.href; // Get the current URL
    const id = url.substring(url.lastIndexOf("/") + 1); // Extract the ID from the URL

    setLoading(true); // Set loading to true when the component mounts

    // Make an API call to fetch the profile data using the ID
    getProfile(id)
      .then((response) => {
        console.log("Profile data:", response);
        const data = response;

        // Update the ID state variable
        setProfileId(data.id);

        const fieldNames = [
          "name",
          "description",
          "conditions",
          "treatments",
          "website",
          "address",
          "email",
          "phone",
        ];
        const cardStates = fieldNames.map((fieldName) => ({
          editMode: false,
          fieldName: fieldName.charAt(0).toUpperCase() + fieldName.slice(1), // Capitalize the field name
          fieldValue: data[fieldName] || "", // Assuming the profile data is in the form of fieldName: value
        }));
        setCardStates(cardStates);

        setLoading(false); // Set loading to false when the data is fetched
      })
      .catch((error) => {
        setLoading(false); // Set loading to false when the data is fetched
        setError(error?.message || "Something went wrong!"); // Set the error state variable
        console.error("Error fetching profile data:", error);
        // Handle the error case here
        // Perform any necessary error handling or display an error message
      });
  }, []);

  const handleAddTreatment = (event, index) => {
    const selectedTreatment = event.target.value;
    setCardStates((prevState) => {
      const updatedCardStates = [...prevState];
      const fieldValue = updatedCardStates[index].fieldValue;

      if (fieldValue) {
        updatedCardStates[
          index
        ].fieldValue = `${fieldValue.trim()}, ${selectedTreatment}`;
      } else {
        updatedCardStates[index].fieldValue = selectedTreatment;
      }

      return updatedCardStates;
    });
  };

  const handleConditionChange = (selectedOption, index) => {
    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates];
      updatedCardStates[index].fieldValue = selectedOption;
      return updatedCardStates;
    });
  };

  const handleCloseClick = (index) => {
    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates];
      updatedCardStates[index].editMode = false;
      return updatedCardStates;
    });
  };

  const handleEditClick = (index) => {
    console.log("Clicked on Edit for card index:", index);

    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates];
      updatedCardStates[index].editMode = true;
      return updatedCardStates;
    });
  };

  const handleSaveClick = async (index) => {
    const url = window.location.href; // Get the current URL
    const id = url.substring(url.lastIndexOf("/") + 1); // Extract the ID from the URL

    console.log("URL:", url); // Log the URL
    console.log("ID:", id); // Log the ID
    console.log("Saving value:", cardStates[index].fieldValue); // Log the value being saved

    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates];
      updatedCardStates[index].editMode = false;
      return updatedCardStates;
    });

    // Determine the field name based on the index
    let fieldName;
    switch (index) {
      case 0:
        fieldName = "name";
        break;
      case 1:
        fieldName = "description";
        break;
      case 2:
        fieldName = "conditions";
        break;
      case 3:
        fieldName = "treatments";
        break;
      case 4:
        fieldName = "website";
        break;
      case 5:
        fieldName = "address";
        break;
      case 6:
        fieldName = "email";
        break;
      case 7:
        fieldName = "phone";
        break;
      // Add more cases for other fields if needed
      default:
        break;
    }

    try {
      await updateData(id, fieldName, cardStates[index].fieldValue);
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle the error case here
      // Perform any necessary error handling or display an error message
    }
  };

  const handleInputChange = (event, index) => {
    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates];
      updatedCardStates[index].fieldValue = event.target.value;
      console.log("updated card states: ", updatedCardStates); // Move this line before the return statement
      return updatedCardStates;
    });
  };

  const renderFieldValue = (fieldName, fieldValue, editMode, index) => {
    if (fieldName === "Conditions" && !editMode) {
      return fieldValue.split(",").map((condition, i) => (
        <span key={i}>
          {condition.trim()}
          {i !== fieldValue.split(",").length - 1 && ", "}
        </span>
      ));
    } else if (fieldName === "Website" && !editMode) {
      return <a href={fieldValue}>{fieldValue}</a>;
    } else if (fieldName === "Email" && !editMode) {
      return <a href={`mailto:${fieldValue}`}>{fieldValue}</a>;
    } else {
      return fieldValue;
    }
  };

  const handleReturnToResults = () => {
    navigate("/results", {
      state: {
        searchTerm: state.initialSearch,
        location: state.resultAddress,
        radius: resultRadius,
      },
    });
  };

  console.log("cardStates:", cardStates);

  //add sakib

  if (loading) {
    return (
      <Container>
        <h3>Loading profile data...</h3>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <h3>{error}</h3>
      </Container>
    );
  }

  if (cardStates.length === 0) {
    return (
      <Container>
        <h3>No profile data available.</h3>
      </Container>
    );
  }
//add sakib
  console.log("profileid: ", profileId);
  return (
    <Container>
      {loggedIn && currentUser.firstTimeLogin && (
        <Typography variant="h4" component="h4" sx={{ mb: 2 }}>
          Welcome back, {currentUser.name}!
        </Typography>
      )}
      {!loggedIn && fromProfile && (
        <ReturnLink
          variant="body2"
          className="link"
          onClick={handleReturnToResults}
        >
          Return to Results
        </ReturnLink>
      )}
      <ProfileWrapper>
        <MapContainer>
          <Map address={cardStates[5].fieldValue} />
        </MapContainer>
        <CardContainer>
          {cardStates.map((cardState, index) => (
            <Card key={index}>
              <h3>
                {cardState.fieldName === "Name"
                  ? "Clinic Name/Doctor Name:"
                  : cardState.fieldName}
              </h3>
              {cardState.editMode ? (
                <div>
                  {cardState.fieldName === "Treatments" && (
                    <div>
                      <select
                        className="select-dropdown"
                        onChange={(event) => handleAddTreatment(event, index)}
                      >
                        <option value="">Select a treatment</option>
                        <option value="PRP">PRP</option>
                        <option value="Prolotherapy">Gene Therapy</option>
                        <option value="Stem">Stem Cell Therapy</option>
                      </select>
                    </div>
                  )}
                  <input
                    type="text"
                    value={cardState.fieldValue}
                    onChange={(event) => handleInputChange(event, index)}
                  />
                  <button onClick={() => handleSaveClick(index)}>Save</button>
                  <button onClick={() => handleCloseClick(index)}>Close</button>
                </div>
              ) : (
                <div>
                  {cardState.fieldName === "Treatments" ? (
                    <div>
                      {cardState.fieldValue.split(",").map((treatment, i) => (
                        <span key={i}>
                          {treatment.trim()}
                          {i !== cardState.fieldValue.split(",").length - 1 &&
                            ", "}
                        </span>
                      ))}
                      {loggedIn && currentUserID === profileId && (
                        <div>
                          <EditButton onClick={() => handleEditClick(index)}>
                            Edit
                          </EditButton>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {renderFieldValue(
                        cardState.fieldName,
                        cardState.fieldValue,
                        cardState.editMode,
                        index
                      )}
                      {loggedIn && currentUserID === profileId && (
                        <EditButton onClick={() => handleEditClick(index)}>
                          Edit
                        </EditButton>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </CardContainer>
      </ProfileWrapper>
    </Container>
  );
};

export default Profile;
