import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_API_KEY } from '../config.js';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const maindataTable = 'maindata';

const loginUser = async ({ email, password }) => {
  try {
    // Validate the email and password
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    // Retrieve the user from the database based on the email (case-insensitive)
    const { data: users, error: retrievalError } = await supabase
      .from(maindataTable)
      .select()
      .ilike('email', email)
      .limit(2); // Limit the query to 2 records

    if (retrievalError) {
      throw new Error('Error retrieving user from the database.');
    }

    if (!users || users.length === 0) {
      throw new Error('Invalid email or password. Please check your email and password.');
    }

    if (users.length > 1) {
      throw new Error('Multiple users found with the same email. Please contact support.');
    }

    const user = users[0]; // Access the first user in the array

    // Compare the provided password with the stored password
    if (password !== user.password) {
      throw new Error('Invalid email or password. Please check your email and password.');
    }

    // Construct the user data to include in the response
    const userData = {
      userId: user.id, // Assuming there is an 'id' property in the user object
      // Other user data properties...
    };

    return userData;
  } catch (error) {
    console.error('Error during login:', error);
    throw error; // Throw the specific error from loginUser
  }
};




export default loginUser;
