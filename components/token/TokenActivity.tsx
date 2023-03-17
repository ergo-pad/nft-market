import React, { FC, useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Avatar,
  useMediaQuery,
  useTheme,
  Paper,
  Grid,
  IconButton,
  Icon
} from '@mui/material'
import { timeFromNow } from '@utilities/daytime'
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Link from '@components/Link'

export interface ITokenActivity {
  tokenImageUrl: string;
  tokenName: string;
  tokenUrl: string;
  collectionName?: string;
  collectionUrl?: string;
  initiatorAvatarUrl?: string;
  initiatorUsername?: string;
  initiatorAddress: string; // for URL 
  action: 'purchased' | 'opened' | 'sale-init' | 'auction-init' | 'auction-won' | 'minted';
  date: Date;
  transactionUrl: string;
  index?: number;
}

const TokenActivity: FC<ITokenActivity> = ({
  tokenImageUrl,
  tokenName,
  tokenUrl,
  collectionName,
  collectionUrl,
  initiatorAvatarUrl,
  initiatorUsername,
  initiatorAddress,
  action,
  date,
  transactionUrl,
  index
}) => {
  const theme = useTheme()
  const desktop = useMediaQuery(theme.breakpoints.up('md'))
  return (
    <Paper elevation={0} sx={{ p: '12px', mb: '12px' }}>
      <Grid
        container
        spacing={2}
        direction="row"
        alignItems="center"
      >
        <Grid item xs="auto">
          <Avatar
            variant="rounded"
            alt={initiatorUsername ? initiatorUsername : initiatorAddress}
            src={initiatorAvatarUrl}
            sx={{ width: 48, height: 48 }}
          />
        </Grid>
        <Grid item xs>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography component="span" variant="body1">
                <Link href={'/users/' + initiatorAddress} sx={{ display: 'inline-block' }}>
                  {initiatorUsername ? initiatorUsername : initiatorAddress}
                </Link>
                &nbsp;
              </Typography>
              <Typography component="span" sx={{ color: theme.palette.text.secondary }}>
                {action === 'purchased' && 'purchased this token'}
                {action === 'opened' && 'opened a pack'}
                {action === 'sale-init' && 'created a sale'}
                {action === 'auction-init' && 'began an auction'}
                {action === 'auction-won' && 'won this at auction'}
                {action === 'minted' && 'minted'}
              </Typography>
              <Box>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                  {timeFromNow(date)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs="auto">
              <IconButton href={transactionUrl} target="_blank">
                <Icon>
                open_in_new
                </Icon>
              </IconButton>
            </Grid>
          </Grid>

        </Grid>
      </Grid>
    </Paper>
  );
};

export default TokenActivity;
