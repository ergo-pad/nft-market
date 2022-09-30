import React, { FC } from 'react';
import {
  IconButton,
  Icon,
  useTheme
} from '@mui/material'

interface IUserAvatarProps {

}

const UserAvatar: FC<IUserAvatarProps> = ({ }) => {
  const theme = useTheme()
  return (
    <>
      <IconButton sx={{ color: theme.palette.text.primary }} onClick={() => {}}>
        <Icon color="inherit">
          account_circle
        </Icon>
      </IconButton>
    </>
  );
};

export default UserAvatar;