import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY, GOOGLE_MAPS_API_KEY } from '../config.js';
// import emailjs from 'emailjs-com';
import axios from 'axios'
const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const maindataTable = 'maindata';
const bcrypt = require('bcryptjs');



const geocodeCity = async (city, state, country) => {
  try {
    const address = `${city}, ${state}, ${country}`;
    const encodedAddress = encodeURIComponent(address);
    console.log(encodedAddress)

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`
    );

    const results = response.data;
    console.log('geocode results:', results);

    if (results && results.length > 0) {
      const result = results[0];
      const { lat, lon } = result;
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      console.log('No results found for the city:', city, state, country);
      return null;
    }
  } catch (error) {
    console.log('Error geocoding:', error);
    return null;
  }
};


const insertNewUser = async (userData) => {
  try {
    const {
      clinicName,
      description,
      conditions,
      treatments,
      address,
      country,
      city,
      state,
      phone,
      email,
      password,
    } = userData;

    console.log('user data:', userData);

    // Generate a random 7-digit number as the id
    const id = Math.floor(Math.random() * 9000000) + 1000000;

    // Geocode the city, state, and country to get the latitude and longitude
    const userCoordinates = await geocodeCity(city, state, country);
    if (!userCoordinates) {
      throw new Error('Invalid location');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('user coordinates:', userCoordinates);

    // Prepare the data to be inserted
    const newData = {
      id: id,
      name: clinicName,
      description: description,
      conditions: conditions,
      treatments: treatments,
      address: address,
      city: city,
      country: country,
      state: state,
      phone: phone,
      email: email,
      password: hashedPassword,
      latitude: userCoordinates.latitude,
      longitude: userCoordinates.longitude,
      created_at: new Date().toISOString(),
    };

    console.log('new data:', newData);

    // Insert data into the "maindata" table using Supabase
    const { data, error } = await supabase
      .from(maindataTable)
      .insert([newData]);

    console.log('insert data response:', data);
    console.log('insert data error:', error);

    if (error) {
      throw new Error('Failed to insert data');
    }

    console.log('Data inserted successfully:', data);

    const formatUserData = (userData) => {
      const excludedFields = ['confirmEmail', 'password', 'confirmPassword'];
      
      const formattedData = Object.entries(userData)
        .filter(([key]) => !excludedFields.includes(key))
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    
      return formattedData;
    };

  // Send email using EmailJS
  // const templateParams = {
  //   to_name: userData.clinicName, // Replace with the recipient's name
  //   form_data: formatUserData(userData), // Include the formatted form data
  //   cc: 'ben.havis1@gmail.com' // Replace with the desired CC email address
  // };
  // const serviceId = 'service_2r0se76'; // Replace with your EmailJS service ID
  // const templateId = 'template_oxld718'; // Replace with your EmailJS template ID
  // const userId = 'nUUB9oVzshoW23wdo'; // Replace with your EmailJS user ID

  // await emailjs.send(serviceId, templateId, templateParams, userId);


    return { message: 'Data inserted successfully' };
  } catch (error) {
    console.error('Error inserting data:', error);
    throw new Error('Failed to insert data');
  }
};


export default insertNewUser;
