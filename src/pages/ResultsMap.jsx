import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";
import { GOOGLE_MAPS_API_KEY } from "../config";
import { Typography } from "antd";
import styled from "styled-components";

const { Title } = Typography;

const MapContainer = styled.div`
  position: relative;
  height: 400px;
  width: 100%;
`;

const PopupModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PopupModal = styled.div`
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
`;
// modify sakib
const ResultsMap = ({ results, adresss: addrsss }) => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const geocodeAddresses = async () => {
      const promises = results.map(async (result) => {
        const { address } = result;
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_MAPS_API_KEY}`;

        try {
          const response = await fetch(geocodeUrl);
          const data = await response.json();

          if (data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location || {
              lat: 0,
              lng: 0,
            };
            const { name, city, state, country } = result;
            return { address, lat, lng, name, city, state, country };
          }
        } catch (error) {
          console.error("Error geocoding address:", error);
        }

        return null;
      });

      if (addrsss && results.length === 0) {
        const addrrr = addrsss.description;

        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          addrrr
        )}&key=${GOOGLE_MAPS_API_KEY}`;
        
        try {
          const response = await fetch(geocodeUrl);
          const data = await response.json();

          if (data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location || {
              lat: 0,
              lng: 0,
            };
            const { name, city, state, country } =
              data.results[0].formatted_address;
            return { address: addrrr, lat, lng, name, city, state, country };
          }
        } catch (error) {
          console.error("Error geocoding address:", error);
        }
      }

      const geocodedResults = await Promise.all(promises);
      const filteredMarkers = geocodedResults.filter(
        (marker) => marker !== null
      );
      setMarkers(filteredMarkers);

      if (filteredMarkers.length > 0) {
        // Calculate the average latitude and longitude
        const sumLat = filteredMarkers.reduce(
          (total, marker) => total + marker.lat,
          0
        );
        const sumLng = filteredMarkers.reduce(
          (total, marker) => total + marker.lng,
          0
        );
        const avgLat = sumLat / filteredMarkers.length;
        const avgLng = sumLng / filteredMarkers.length;
        setCenter({ lat: avgLat, lng: avgLng });

        const bounds = new window.google.maps.LatLngBounds();
        filteredMarkers.forEach((marker) => {
          bounds.extend(new window.google.maps.LatLng(marker.lat, marker.lng));
        });
        setMapBounds(bounds);
      }
    };
//modify sakib
    geocodeAddresses();
  }, [results]);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleResultsButtonClick = () => {
    // Perform the action to show results in the current map area
    // Replace this console.log with your own logic to show the results
    const bounds = mapBounds.toJSON();
    const resultsInBounds = markers.filter((marker) => {
      return (
        marker.lat >= bounds.south &&
        marker.lat <= bounds.north &&
        marker.lng >= bounds.west &&
        marker.lng <= bounds.east
      );
    });
    console.log("Results in current map area:", resultsInBounds);
  };

  const WrappedMapComponent = withGoogleMap(() => (
    <GoogleMap
      defaultZoom={markers.length === 1 ? 8 : 4} // Adjust the zoom level based on the number of markers
      center={center}
      ref={(map) => mapBounds && map && map.fitBounds(mapBounds)}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={marker.address}
          icon={{
            //  modify sakib
            url:
              selectedMarker === marker
                ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new window.google.maps.Size(40, 40),
          }}
          onClick={() => handleMarkerClick(marker)}
        />
      ))}
    </GoogleMap>
  ));

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setSelectedMarker(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <MapContainer>
      <WrappedMapComponent
        containerElement={<div style={{ height: "100%" }} />}
        mapElement={<div style={{ height: "100%" }} />}
      />
      {/* {showResultsButton && (
        <Button
          type="primary"
          style={{ position: 'absolute', top: 16, right: 16 }}
          onClick={handleResultsButtonClick}
        >
          Show results in this area
        </Button>
      )} */}
      {selectedMarker && (
        <PopupModalOverlay>
          <PopupModal ref={modalRef}>
            <Title level={4}>{selectedMarker.name}</Title>
            <p>{selectedMarker.address}</p>
          </PopupModal>
        </PopupModalOverlay>
      )}
    </MapContainer>
  );
};

ResultsMap.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string.isRequired,
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ResultsMap;
