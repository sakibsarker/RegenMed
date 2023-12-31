import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { GOOGLE_MAPS_API_KEY } from '../config';
import styled from 'styled-components';
import { getDistance } from 'geolib';

const mainColor = '#4811ab'; // Define the main color variable

const StyledLayout = styled(Layout)`
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 3px ${mainColor};
    transform: translateY(-2px);
  }

  h4 {
    color: ${mainColor};
    font-weight: bold;
    margin-bottom: 5px;
  }

  p {
    margin: 0;
  }

  .link {
    color: ${mainColor};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: darken(${mainColor}, 10%);
    }
  }

  .map-link {
    color: #1890ff;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #40a9ff;
    }
  }

  &.selected {
    background-color: #f5f5f5; /* Add your desired gray color value */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 3px ${mainColor};
    transform: translateY(-2px);
  }
`;

const apiKey = GOOGLE_MAPS_API_KEY;

const Result = ({ result, isSelected, resultAddress, initialSearch, resultRadius }) => {
  const { id, name, city, specialty, placeId, address } = result;
  const [distance, setDistance] = useState('');

  useEffect(() => {
    const fetchDistance = async () => {
      if (!resultAddress) {
        // Handle the case when the address is not available
        setDistance('');
        return;
      }

      // Calculate the distance between the result address and the result city
      const resultLocation = await getLocationCoordinates(city);
      const addressLocation = await getLocationCoordinates(resultAddress);
      if (!resultLocation || !addressLocation) {
        // Handle the case when the coordinates are not available
        setDistance('');
        return;
      }
      const distanceInMeters = getDistance(resultLocation, addressLocation);
      const distanceInMiles = distanceInMeters * 0.000621371; // Conversion factor for meters to miles

      // Set the distance state
      setDistance(distanceInMiles.toFixed(2));
    };

    fetchDistance();
  }, []);

  const getUserLocation = () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error(error);
          resolve(null); // Resolve with null in case of error or denial
        }
      );
    });
  };

  const getLocationCoordinates = async (location) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`
      );
      const data = await response.json();
    //  console.log('Geocoding API response:', data);

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        console.log('Coordinates:', lat, lng);
        return { latitude: lat, longitude: lng };
      } else {
        throw new Error('No results found for the location.');
      }
    } catch (error) {
      console.error('Error retrieving location coordinates:', error);
      // Handle the error, such as showing a message to the user or setting a specific state variable to indicate the error.
      return null;
    }
  };

  const navigate = useNavigate();
 

  const handleProfileClick = (result) => {
    console.log('Result:', result); // Log the result object
    console.log('initial search: ', initialSearch)
    console.log('result address: ', resultAddress)
    
    navigate(`/profile/${id}`, {
      state: {
        ...result,
        initialSearch: initialSearch,
        resultAddress: resultAddress,
        resultRadius: resultRadius,
        fromProfile: true
      }
    });
  };
  return (
    <StyledLayout className={`result-card ${isSelected ? 'selected' : ''}`} onClick={() => handleProfileClick(result)}>
      <Link style={{ textDecoration: 'none' }}>
        <h4>{name}</h4>
      </Link>
      <p>{address}</p>
      <p>{specialty}</p>
      {distance && (
        <p>{`Distance: ${distance} miles`}</p>
      )}
      {placeId && (
        <p>
          <a href={`https://www.google.com/maps/place/?q=place_id:${placeId}`} target="_blank" rel="noopener noreferrer">
            View on Google Maps
          </a>
        </p>
      )}
    </StyledLayout>
  );
};

Result.propTypes = {
  result: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    specialty: PropTypes.string.isRequired,
    placeId: PropTypes.string,
    address: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  resultAddress: PropTypes.string,
};

export default Result;
