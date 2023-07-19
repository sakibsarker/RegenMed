import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const Map = ({ address }) => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if (address) {
      // Use the geocoding service to fetch coordinates based on the address
      fetchCoordinates(address);
    }
  }, [address]);

  const fetchCoordinates = (address) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        setCenter({ lat: lat(), lng: lng() });
      }
    });
  };

  // Google Maps API configuration
  const mapContainerStyle = {
    height: '400px',
    width: '100%',
  };

  return (
    <div style={mapContainerStyle}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10} // Adjust the zoom level as needed
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default Map;
