import React, { useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Layout, Input, Button, Form, AutoComplete } from "antd";

import { Icon } from "@iconify/react";
import MainBack from "../assets/newdnagif.gif";
import Services from "./Services";
import Contact from "./Contact";
import PlacesAutocomplete from "react-places-autocomplete";
import insertTopSearch from "./insertTopSearch";
import { terms } from "../config";
import { set } from "react-hook-form";

const IconWrapper = styled.div`
  position: relative;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  pointer-events: none;

  svg {
    position: absolute;
    width: 16px;
    height: 16px;
    color: purple;
  }
`;

const StyledErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  margin-top: 10rem;

  .treatment-text {
    color: white;
    font-weight: bold;
    margin-bottom: 1rem;
    margin-top: 1rem;
  }

  @media screen and (max-width: 768px) {
    margin-top: 10rem;
  }

  .ant-input {
    width: 0rem;
    height: 50px;

    @media screen and (max-width: 768px) {
      width: 80%;
    }
  }

  .type-button {
    width: fit-content;
    margin-left: 5px;
  }
`;

const StyledContainer = styled.div`
  min-height: 100vh;
  background-image: url(${MainBack});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  image-rendering: optimizeQuality;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: -o-crisp-edges;
  image-rendering: pixelated;
  -ms-interpolation-mode: nearest-neighbor;

  h5 {
    color: var(--main-color);
    font-weight: bold;
  }

  @media screen and (max-width: 768px) {
    background-attachment: scroll;
    padding: 2rem;
    background-position: 20% center;
    min-height: 100vh;
  }
`;

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledMainText = styled.h1`
  color: white;
  padding-top: 6rem;
  text-align: center;
  font-size: 3rem;
  font-weight: bold;
  animation: ${fadeInAnimation} 2s ease-in-out;

  @media screen and (max-width: 768px) {
    padding-top: 3rem;
    font-size: 1.5rem;
  }

  ::after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    background-color: purple;
    margin-top: 1rem;
  }
`;

const Main = () => {
  const [address, setAddress] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const [options, setOptions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = useCallback((value) => {
    const filterTerm = value.trim(); // Trim any leading or trailing whitespace
    setSearchTerm(filterTerm);

    const filteredOptions = terms
      .filter((term) => term.toLowerCase().includes(filterTerm.toLowerCase()))
      .map((term) => ({ value: term }));

    setOptions(filteredOptions);
  }, []);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (!searchTerm) {
          setErrorMessage("Please enter a search term");
        } else if (!address) {
          setErrorMessage("Please enter a location");
        } else {
          const filterTerm = searchTerm.trim(); // Trim any leading or trailing whitespace
          console.log("Search term:", filterTerm);

          // Update top searches in the database
          insertTopSearch(filterTerm);

          // Update top searches in the database
          console.log("Before updateTopSearches");
          // updateTopSearches(filterTerm);
          console.log("After updateTopSearches");

          navigate("/results", {
            state: {
              searchTerm: filterTerm,
              location: address,
              checkedOptions: checkboxOptions,
            },
          });
        }
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  const handleAddressChange = (value) => {
    setShowSuggestions(true);
    setAddress(value);
  };

  const [checkboxOptions, setCheckboxOptions] = useState([
    { label: "PRP", value: "PRP", checked: false },
    { label: "Stem Cell Therapy", value: "Stem", checked: false },
    { label: "Prolotherapy", value: "Prolotherapy", checked: false },
  ]);

  const handleButtonClick = (value) => {
    const updatedOptions = checkboxOptions.map((option) =>
      option.value === value ? { ...option, checked: !option.checked } : option
    );
    setCheckboxOptions(updatedOptions);
  };

  const handleButtonStyle = (value) => {
    const option = checkboxOptions.find((option) => option.value === value);
    return option.checked
      ? { color: "white", backgroundColor: "var(--main-color)" }
      : {};
  };

  const handleSuggestionClick = (suggestion, event) => {
    event.stopPropagation(); // Stop event propagation

    const filterTerm = suggestion.value.toString(); // Convert to string
    setSearchTerm(filterTerm.toLowerCase());
    console.log(`search term: ${searchTerm}`);
  };

  console.log("Render options:", options);

  return (
    <Layout>
      <StyledContainer>
        <StyledMainText>
          Find a Regenerative Medicine Doctor<br></br> based on your condition
        </StyledMainText>
        <StyledForm form={form} onFinish={handleSubmit} layout="vertical">
          {/* Display error message */}
          {errorMessage && (
            <StyledErrorMessage>{errorMessage}</StyledErrorMessage>
          )}

          <div className="form-row">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <AutoComplete
                style={{ width: "70vw", maxWidth: "450px", height: "50px" }}
                value={searchTerm}
                options={options}
                onSelect={(value) => setSearchTerm(value)}
                onSearch={handleSearch}
                placeholder="Search medical conditions"
              />
            </div>
            <IconWrapper>
              <Icon icon="ant-design:environment-outlined" />
            </IconWrapper>
            <PlacesAutocomplete
              onClick={(event) => handleSuggestionClick(suggestion, event)}
              value={address}
              onChange={handleAddressChange}
              onSelect={(value) => {
                setAddress(value);
                setShowSuggestions(false);
              }} // Update the selected value in the state
              searchOptions={{
                types: ["(cities)"],
                componentRestrictions: { country: ["us"] }, // Limit suggestions to USA, Canada, Mexico
              }}
              //add sakib
              debounce={500}
              //add
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div>
                  <Input
                    style={{
                      width: "15rem",
                      marginLeft: "5rem",
                      marginRight: "5rem",
                    }}
                    {...getInputProps({
                      placeholder: "Enter a location...",
                      className: "location-search-input",
                    })}
                  />
                  {/* add showSuggestions sakib*/}
                  {showSuggestions && (
                    <div className="autocomplete-dropdown-container">
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion, index) => {
                        const className = suggestion.active
                          ? "suggestion-item--active"
                          : "suggestion-item";
                        const style = suggestion.active
                          ? { backgroundColor: "#fafafa", cursor: "pointer" }
                          : { backgroundColor: "#ffffff", cursor: "pointer" };
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              style,
                            })}
                            key={index}
                            onClick={() => {
                              setAddress(suggestion.description);
                              setShowSuggestions(false);
                            }} // Update the selected address on click
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </PlacesAutocomplete>
          </div>
          <h5 className="treatment-text">Select Treatment Type(s)</h5>
          <div className="button-group">
            {checkboxOptions.map((option) => (
              <Button
                className="type-button"
                type={option.checked ? "primary" : "default"}
                onClick={() => handleButtonClick(option.value)}
                style={handleButtonStyle(option.value)}
                key={option.value}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <Button className="search-button" htmlType="submit" type="primary">
            Search
          </Button>
        </StyledForm>
      </StyledContainer>
      <Services />
      <Contact />
    </Layout>
  );
};

export default Main;
