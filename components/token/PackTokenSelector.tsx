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
import { formatNumber } from '@utils/general';

export interface IPackTokenSelector {
  packInfo: {
    name: string;
    image: string;
    price: {
      tokenId: string;
      amount: number;
    }[]
  };
  selected?: boolean[];
  setSelected?: React.Dispatch<React.SetStateAction<boolean[]>>;
  index?: number;
}

const PackTokenSelector: FC<IPackTokenSelector> = ({
  packInfo,
  selected,
  setSelected,
  index
}) => {
  const theme = useTheme()
  const desktop = useMediaQuery(theme.breakpoints.up('md'))
  
  const handleSelect = () => {
    if (setSelected != undefined && index != undefined) {
      setSelected(prev => {
        const newArray = prev.map((item, i) => {
          if (prev[index] === true && index === i) return false
          if (prev[index] === true && index != i) return item
          if (prev[index] === false && index === i) return true
          if (prev[index] === false && index != i) return false
          else return item
        })
        return newArray
      })
    }
  }

  return (
      <Paper
       onClick={() => handleSelect()}
        variant="outlined"
        sx={{
          p: '12px',
          mb: '12px',
          backgroundColor: selected !== undefined && index !== undefined && selected[index] ?
            theme.palette.divider :
            theme.palette.background.paper,
          // transform: selected !== undefined && index !== undefined && selected[index] ?
          //   "scale3d(0.95, 0.95, 1)" :
          //   "scale3d(1, 1, 1)",
          transition: "transform 0.15s ease-in-out",
          cursor: 'pointer'
        }}

      >
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="center"
        >
          <Grid item xs="auto">
            <Avatar
              variant="rounded"
              alt={packInfo.name}
              src={packInfo.image}
              sx={{ width: 48, height: 48 }}
            />
          </Grid>
          <Grid item xs>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography variant="h4">
                  {packInfo.name}
                </Typography>
              </Grid>
              <Grid item xs="auto">
              {/* NOTE CURRENCY IS EMPTY IF NOT ERG. NEEDS FIX LATER */}
                {packInfo.price[0].tokenId === '0000000000000000000000000000000000000000000000000000000000000000' ?
                  (
                    <>
                      {formatNumber((packInfo.price[0].amount * 0.000000001), 2)} {' Erg'}
                    </>

                  ) :
                  (
                    <>
                      Price error.
                    </>
                  )}
              </Grid>
            </Grid>

          </Grid>
        </Grid>
      </Paper>
  );
};

export default PackTokenSelector;
