import React, { FC, useContext, useState, useEffect } from 'react';
import {
  IconButton,
  Icon,
  useTheme,
  Avatar,
  Typography,
  Box,
  Button,
  Grid,
  Badge
} from '@mui/material'
import { WalletContext } from '@contexts/WalletContext';
import { useRouter } from 'next/router';
import AddWallet from '@components/wallet/AddWallet';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MessageIcon from '@mui/icons-material/Message';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorIcon from '@mui/icons-material/Error';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Link from '@components/Link';

////////////////////////////////
// START SAMPLE DATA ///////////
////////////////////////////////

const sampleMenuItems = [
  {
    icon: <CheckCircleIcon fontSize="small" color="success" />,
    txType: 'Purchase transaction',
    txId: 'xyzjdfkkals',
    success: 'confirmed',
    time: '8 minutes',
    unread: true
  },
  {
    icon: <ErrorIcon fontSize="small" color="warning" />,
    txType: 'Purchase transaction',
    txId: 'xyzjdfkkals',
    success: 'submitted to mempool',
    time: '12 minutes',
    unread: true
  },
  {
    icon: <CancelIcon fontSize="small" color="error" />,
    txType: 'Purchase transaction',
    txId: 'abcdalkdsjflkjasdf',
    success: 'failed',
    time: '2 hours',
    unread: false
  },
]

////////////////////////////////
// END SAMPLE DATA /////////////
////////////////////////////////

interface INotificationsMenuProps {

}

interface IMenuItemProps {
  icon: React.ReactElement;
  txType: string;
  txId: string;
  success: string;
  time: string;
  unread: boolean;
  index: number;
}

const NotificationsMenu: FC<INotificationsMenuProps> = ({ }) => {
  const theme = useTheme()
  const router = useRouter();
  const {
    walletAddress,
    setWalletAddress,
    dAppWallet,
    setDAppWallet,
    addWalletModalOpen,
    setAddWalletModalOpen
  } = useContext(WalletContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [currentMenuItems, setCurrentMenuItems] = useState(sampleMenuItems)
  const [numberUnread, setNumberUnread] = useState(0)

  useEffect(() => {
    const array = currentMenuItems.filter((item) => item.unread === true)
    setNumberUnread(array.length)
  }, [currentMenuItems])

  const setRead = (i: number) => {
    setCurrentMenuItems((prevArray) => {
      const newArray = prevArray.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            unread: false
          }
        }
        return item
      })
      return newArray
    })
  }

  const CustomMenuItem: FC<IMenuItemProps> = ({ icon, txType, txId, success, time, unread, index }) => {
    return (
      <MenuItem
        onClick={() => setRead(index)}
        sx={{ background: unread ? 'rgba(255,255,255,0.05)' : 'none' }}
      >
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <Grid container direction="column" sx={{ whiteSpace: 'normal' }}>
          <Grid item>
            {txType + ' '}
            <Link href={'https://explorer.ergoplatform.com/en/transactions/' + txId}>{txId}</Link>
            {' '}
            {success}
          </Grid>
          <Grid item sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>
            {time + ' ago'}
          </Grid>
        </Grid>
        {unread && (
          <ListItemIcon>
            <FiberManualRecordIcon sx={{ fontSize: '12px', ml: '18px' }} />
          </ListItemIcon>
        )}
      </MenuItem>
    )
  }
  return (
    <>
      <IconButton sx={{ color: theme.palette.text.primary }} onClick={handleClick}>
        <Badge badgeContent={numberUnread} color="primary">
          <Icon color="inherit">
            notifications
          </Icon>
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
        PaperProps={{
          elevation: 1,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 0,
            minWidth: '230px',
            maxWidth: '420px',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 15,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ width: '100%', px: '12px', py: '6px' }}>
          <Typography>
            Notifications
          </Typography>
        </Box>
        {currentMenuItems.map((item, i) => {
          return (
            <CustomMenuItem
              txType={item.txType}
              txId={item.txId}
              success={item.success}
              icon={item.icon}
              time={item.time}
              unread={item.unread}
              key={i}
              index={i}
            />
          )
        })}
        <Box
          sx={{
            width: '100%',
            p: '6px 6px 0 6px',
          }}
        >
          <Button fullWidth>
            View All
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default NotificationsMenu;