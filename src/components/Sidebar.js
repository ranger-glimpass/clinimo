import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, Box, Typography, IconButton, Button, Divider } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function Sidebar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        _id: '',
        name: '',
        email: '',
        company: '',
        address: '',
        contactNumber: '',
        password: '',
        imageUrl: '', // Assuming there's an imageUrl field
    });
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        console.log('Logout action');
        // Implement your logout logic here, e.g., clearing session or token
        sessionStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        // Fetch user data from sessionStorage
        const user = sessionStorage.getItem('user');
        if (user) {
            setUserData(JSON.parse(user));
        }
    }, []);

    return (
        <Box>
            {isMobile && (
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ marginLeft: 1 }}
                >
                    <MenuIcon />
                </IconButton>
            )}
            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={isMobile ? mobileOpen : true}
                onClose={handleDrawerToggle}
                sx={{
                    width: 240,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
                }}
            >
                <Box sx={{ padding: 2, textAlign: 'center', bgcolor: 'background.paper', boxShadow: 1 }}>
                    <Avatar sx={{ margin: 'auto', bgcolor: 'primary.main', width: 56, height: 56 }}>{userData.company[0]}</Avatar>
                    <Typography variant="h6" noWrap>
                        {userData.company}
                    </Typography>
                </Box>
                <Divider />
                <List>
                    {[ 
                        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
                        { text: 'Staffs', icon: <PeopleIcon />, path: '/staffs' },
                        { text: 'Assistants', icon: <PeopleIcon />, path: '/assistants' },
                        { text: 'Call Logs', icon: <DescriptionIcon />, path: '/call-logs' },
                        { text: 'Account', icon: <AccountCircleIcon />, path: '/account' },
                        { text: 'Wallet', icon: <AccountBalanceWalletIcon />, path: '/wallet' }
                    ].map((item) => (
                        <ListItem button key={item.text} component={NavLink} to={item.path} onClick={isMobile ? handleDrawerToggle : null} sx={{ '&.active': { backgroundColor: 'action.selected' } }}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <Box sx={{ padding: 2 }}>
                    <Button 
                        startIcon={<LogoutIcon />} 
                        fullWidth 
                        variant="outlined" 
                        color="primary" 
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>
            </Drawer>
        </Box>
    );
}

export default Sidebar;
