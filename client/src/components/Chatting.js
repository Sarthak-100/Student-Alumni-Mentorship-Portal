import React from 'react'
import SendMessage from './SendMessage';
import Messages from './Messages';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VideoCallIcon from '@mui/icons-material/VideoCall';



const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  // alignItems: 'flex-start',
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(1.3),
  // Override media queries injected by theme.mixins.toolbar
  '@media all': {
    minHeight: 35,
  },
}));

const Chatting = () => {
  return (
    <div className='chatting'>
      <AppBar position="static">
        <StyledToolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 0 }}
          >
            {/* <MenuIcon /> */}
            <Avatar alt="Remy Sharp" src="https://images.pexels.com/photos/5483063/pexels-photo-5483063.jpeg?auto=compress&cs=tinysrgb&w=600" sx={{ width: 24, height: 26}}/>
          </IconButton>
          <Typography variant='h6' flexGrow={1} sx={{pt: 0, ml: 0}}>Rahul</Typography>
          <IconButton
            size="large"
            aria-label="display more actions"
            edge="end"
            color="inherit"
          >
            <VideoCallIcon />
          </IconButton>
          <IconButton
            size="large"
            aria-label="display more actions"
            edge="end"
            color="inherit"
          >
            <DownloadIcon />
          </IconButton>
        </StyledToolbar>
      </AppBar>
      <Messages />
      <SendMessage />
    </div>
  )
}

export default Chatting
