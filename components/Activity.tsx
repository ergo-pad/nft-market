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

export interface IActivity {
  tokenImageUrl: string;
  tokenName: string;
  tokenUrl: string;
  collectionName?: string;
  collectionUrl?: string;
  initiatorAvatarUrl?: string;
  initiatorUsername?: string;
  initiatorAddress: string; // for URL 
  action: 'purchased' | 'opened' | 'created';
  date: Date;
  transactionUrl: string;
  index?: number;
}

const Activity: FC<IActivity> = ({
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
            alt={tokenName}
            src={tokenImageUrl}
            sx={{ width: 64, height: 64 }}
          />
        </Grid>
        <Grid item xs>
          <Grid container alignItems="center">
            <Grid item xs>
              <Box>
                <Link href={tokenUrl} sx={{ display: 'inline-block' }}>
                  {tokenName}
                </Link>
                {collectionUrl && collectionName && (
                  <>
                    &nbsp;
                    <Typography variant="body1" sx={{ display: 'inline-block', color: theme.palette.text.secondary }}>
                      from
                    </Typography>
                    &nbsp;
                    <Link href={collectionUrl} sx={{ display: 'inline-block' }}>
                      {collectionName}
                    </Link>
                  </>
                )}
              </Box>
              <Box sx={{ display: 'inline-block', verticalAlign: 'text-bottom' }}>
                <Avatar
                  alt={initiatorUsername ? initiatorUsername : initiatorAddress}
                  src={initiatorAvatarUrl ? initiatorAvatarUrl : ''}
                  sx={{ width: 18, height: 18, mr: '6px' }}
                />
              </Box>
              <Typography component="span" variant="body1">
                <Link href={'/users/' + initiatorAddress} sx={{ display: 'inline-block' }}>
                  {initiatorUsername ? initiatorUsername : initiatorAddress}
                </Link>
                &nbsp;
              </Typography>
              <Typography component="span" sx={{ color: theme.palette.text.secondary }}>
                {action === 'purchased' && 'made a purchase'}
                {action === 'opened' && 'opened packs'}
                {action === 'created' && 'created a sale'}
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

export default Activity;
