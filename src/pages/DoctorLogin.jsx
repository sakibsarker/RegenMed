import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { Input, Button } from 'antd'
import { UserOutlined, KeyOutlined } from '@ant-design/icons'
import { AuthContext } from '../AuthContext'
import  loginUser from './loginUser'

const Container = styled.div`
  width: 80%;
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: var(--main-color);
`

const Title = styled.h3`
  text-align: center;
  margin-bottom: 20px;
`

const StyledForm = styled.form`
  .input-group {
    margin-bottom: 15px;
  }

  .btn-login {
    width: 100%;
  }

  .signup-text {
    text-align: center;
    margin-top: 20px;
  }
`

const IconWrapper = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
  color: rgba(0, 0, 0, 0.25);
`
const DoctorLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Make a POST request to the server to verify the login credentials
      const response = await loginUser({ email, password });
  
      // Log the response
      console.log('Login response:', response);
  
      // Handle the response based on the server's authentication logic
      if (response.userId) {
        // Login successful
        const id = response.userId;
        login({ userData: JSON.stringify(response), id });
  
        console.log('Login successful');
        console.log('userdata: ', response);
  
        // Redirect to the user's profile page
        const userData = { ...response, loggedIn: true };
        navigate(`/profile/${id}`, { state: userData });
      } else if (response.error.includes('Invalid email or password')) {
        // Login failed with specific error: Invalid email or password
        setError('Invalid email or password. Please check your email and password.');
      } else {
        // Login failed with other error
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error during login:', error);
    }
  };
  
  return (
    <Container>
      <Title>Sign In</Title>
      <StyledForm onSubmit={handleSubmit}>
        <div className='input-group'>
          <IconWrapper>
            <UserOutlined />
          </IconWrapper>
          <Input
            type='text'
            name='email'
            placeholder='Email'
            prefix={<UserOutlined />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='input-group'>
          <IconWrapper>
            <KeyOutlined />
          </IconWrapper>
          <Input.Password
            type='password'
            name='password'
            placeholder='Password'
            prefix={<KeyOutlined />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && error}
        <Button className='btn-login' type='primary' htmlType='submit'>
          Login
        </Button>
        <p className='signup-text'>
          {/* Don't have an account? <Link to='/register'>Sign Up</Link> or <Link to='/claim'>claim your profile</Link> */}
          Do not have an account? <Link to='/register'>Sign Up</Link>
        </p>
      </StyledForm>
    </Container>
  )
}

export default DoctorLogin
