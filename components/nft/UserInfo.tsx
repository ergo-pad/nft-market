import React, { FC } from 'react';
import {
  Grid,
  Typography,
  Box,
  Avatar,
  useTheme,
  Icon,
  useMediaQuery,
  Tooltip
} from '@mui/material'
import Link from '@components/Link'

interface IUserInfoProps {
  name?: string;
  pfpUrl?: string;
  address: string;
  date: string;
  price?: {
    price: number;
    currency: string;
    usdConversion: number;
  }
  timeIcon?: string;
  saleSize?: boolean;
}

const UserInfo: FC<IUserInfoProps> = (props) => {
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  return (
    <Grid
      container
      justifyContent="space-between"
      wrap="nowrap"
      sx={{
        mb: '24px',
        maxWidth: '100%',
      }}
    >
      <Grid item zeroMinWidth xs>
        <Box sx={{ display: 'inline-block', verticalAlign: 'top' }}>
          <Avatar
            alt={props.name ? props.name : props.address}
            src={props.pfpUrl}
            sx={{
              mr: '6px',
              width: 48,
              height: 48,
              bgcolor: theme.palette.primary.main
            }}
          />
        </Box>
        {/* SELLER ADDRESS OR NAME */}
        <Box
          sx={{
            color: theme.palette.text.primary,
            maxWidth: props.price || !upSm ? '75%' : '85%',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <Link
            sx={{
              color: theme.palette.text.primary,
              fontWeight: '500',
              lineHeight: 1.5,
              mb: '16px',
              '&:hover': {
                color: theme.palette.primary.main,
              }
            }}
            href={'/users/' + props.address}
          >
            {props.name ? props.name : props.address}
          </Link>
          {/* DATE LISTED */}
          <Box
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.875rem'
            }}
          >
            <Icon
              sx={{
                verticalAlign: 'middle',
                mr: '6px',
                mt: '-4px',
                fontSize: '18px !important'
              }}
            >
              {props.timeIcon ? props.timeIcon : 'calendar_today'}
            </Icon>
            <Box sx={{ display: 'inline-block' }}>{props.date}</Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs="auto" sx={{ textAlign: 'right' }}>
        {props.price &&
          <>
            <Typography
              sx={{
                mb: 0,
                fontSize: props.saleSize ? '1.5rem' : '1rem',
                fontWeight: '500',
                lineHeight: props.saleSize ? 1.3 : 1.5
              }}
            >
              {props.price.price + ' ' + props.price.currency}
            </Typography>
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.875rem'
              }}
            >
              ${(props.price.usdConversion * props.price.price).toFixed(2)} USD
            </Typography>
          </>
        }
      </Grid>
    </Grid>
  );
};

export default UserInfo;

