import React, { useContext, Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItemText,
  useMediaQuery,
  Drawer,
  Hidden,
} from '@mui/material';
import { AuthContext } from '../AuthContext';
import Logo from '../assets/logo.png';

const bounceAnimation = keyframes`
  0%, 20%, 60%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  80% {
    transform: translateY(-10px);
  }
`;

const NavbarMenu = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
`;

const StyledList = styled(List)`
  &.drawerList {
    color: #000;
    display: flex;
    flex-direction: column; /* Stack items vertically */
  }
`;

const NavbarItem = styled(Link)`
  text-decoration: none;
  color: ${props => props.sidebar ? "#000" : "#fff"};
  margin-left: 16px;
  display: inline-block;

  &:hover {
    color: yellow;
    transform: scale(1.2);
  }
`;

const MenuIconWrapper = styled.span`
  display: inline-block;
  width: 24px;
  height: 2px;
  background-color: #fff;
  position: relative;
  transition: background-color 0.3s ease-in-out;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: #fff;
    transition: transform 0.3s ease-in-out;
  }

  &::before {
    top: -6px;
  }

  &::after {
    top: 6px;
  }

  ${props =>
    props.open &&
    css`
      background-color: transparent;

      &::before {
        transform: rotate(45deg);
        top: 0;
      }

      &::after {
        transform: rotate(-45deg);
        top: 0;
      }
    `}
`;


const LogoImage = styled.img`
  height: 4rem;
  width: 10rem;
  margin-right: 1px;
  margin-left: 1rem;
  cursor: pointer;
  padding: 5px;
`;

const Navbar = ({ userId }) => {
  const { loggedIn, logout, currentUser } = useContext(AuthContext);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  let currentUserID;
  try {
    const jsonUser = JSON.parse(currentUser);
    currentUserID = jsonUser.userId;
  } catch (error) {
    console.error('Error parsing or accessing user data:', error);
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: currentUserID ? `/profile/${currentUserID}` : '/' },
    { name: 'About', path: '/services' },
    { name: 'Contact', path: '/contact' },
    { name: 'Doctor Login', path: '/doctorlogin' },
    { name: 'Logout', path: '/' },
  ];
  const renderNavItems = (
    <StyledList className={isMobile ? 'drawerList' : 'navbarMenu'}>
      {navItems.map((item) => {
        if (
          (item.name === 'Logout' && !loggedIn) ||
          (item.name === 'Doctor Login' && loggedIn)
        ) {
          return null;
        }

        return (
          <NavbarItem
            key={item.name}
            to={item.path}
            sidebar={isMobile} // Pass sidebar prop as true when in the sidebar
            className="navbarItem"
            onClick={() => {
              toggleDrawer();
              if (item.name === 'Logout') handleLogout();
            }}
          >
            <ListItemText primary={item.name} />
          </NavbarItem>
        );
      })}
    </StyledList>
  );

  return (
    <AppBar position="fixed">
      <Toolbar>
        <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
            <LogoImage src={Logo} alt="Regen Global Logo" />
          </Link>
        </div>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
            >
              <MenuIconWrapper />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer}
              classes={{ paper: 'drawerContent' }}
              PaperProps={{ component: 'div', style: { zIndex: 1200 } }}
            >
              {renderNavItems}
            </Drawer>
          </>
        ) : (
          <Hidden smDown implementation="css">
            <NavbarMenu>
              {loggedIn ? (
                <>
                  {renderNavItems}
                </>
              ) : (
                navItems.slice(0, -1).map((item) => (
                  <Fragment key={item.name}>
                    <NavbarItem
                      to={item.path}
                      className="navbarItem"
                      onClick={item.name === 'Logout' ? handleLogout : undefined}
                    >
                      <ListItemText primary={item.name} />
                    </NavbarItem>
                  </Fragment>
                ))
              )}
            </NavbarMenu>
          </Hidden>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
