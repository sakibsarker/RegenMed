import { createClient } from "@supabase/supabase-js";
import {
  SUPABASE_URL,
  SUPABASE_API_KEY,
  GOOGLE_MAPS_API_KEY,
} from "../config.js";
import axios from "axios";
import { useCallback } from "react";
const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const maindataTable = "maindata";

const geocodeCity = async (city, state, country) => {
  try {
    const address = `${city || ""}, ${state || ""}, ${country || ""}`;
    const encodedAddress = encodeURIComponent(address);

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`
    );

    const results = response.data;

    if (results && results.length > 0) {
      const result = results[0];
      const { lat, lon } = result;
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371; // in kilometers

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return distance;
};

const getData = async (
  filterTerm,
  checkboxOptions,
  city,
  state,
  country,
  maxDistance = 25
) => {
  console.log("Executing getData...");
  console.log("Filter term from getData:", filterTerm);
  console.log("Checkbox options:", checkboxOptions);
  console.log("City:", city);
  console.log("State:", state);
  console.log("Country:", country);
  console.log("Max Distance:", maxDistance);

  try {
    const { data: allData, error } = await supabase
      .from(maindataTable)
      .select("*")
      .ilike("conditions", `%${filterTerm}%`);

    console.log("all data: ", allData);

    if (error) {
      console.error("Error executing query:", error);
      return { error: "Internal Server Error" };
    }
//modiefy sakib
    const cityLocation = await geocodeCity(
      (city = city || ""),
      (state = state || ""),
      (country = country || "")
    );
    //modiefy
    if (!cityLocation) {
      console.log("Invalid location:", city, state, country);
      return { error: "Invalid location" };
    }

    const cityLatitude = cityLocation.latitude;
    const cityLongitude = cityLocation.longitude;

    const filteredData = allData.filter((item) => {
      const conditions = item.conditions || "";
      const treatments = item.treatments || "";

      // Check if the conditions include the filter term
      const conditionsMatch = conditions
        .toLowerCase()
        .includes(filterTerm.toLowerCase());

      // Check if any of the checkbox options are selected and included in the treatments
      const selectedOptions = checkboxOptions.filter(
        (option) => option.checked
      );
      const optionsMatch = selectedOptions.every((option) =>
        treatments.toLowerCase().includes(option.value.toLowerCase())
      );

      const latitude = parseFloat(item.latitude);
      const longitude = parseFloat(item.longitude);

      if (!isNaN(latitude) && !isNaN(longitude)) {
        const distance = calculateDistance(
          latitude,
          longitude,
          parseFloat(cityLatitude),
          parseFloat(cityLongitude)
        );
        const distanceInKm = distance; // Haversine formula already returns distance in kilometers
        return conditionsMatch && optionsMatch && distanceInKm <= maxDistance;
      }

      return false;
    });

    console.log("Filtered Rows:", filteredData);

    return { data: filteredData };
  } catch (error) {
    console.error("Error executing query:", error);
    return { error: "Internal Server Error" };
  }
};

export default getData;
