import React, { FC } from 'react';
import type { NextPage } from 'next';
import {
  Grid,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  useMediaQuery,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Container,
  Typography,
  Box,
  Paper
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useTheme } from "@mui/material/styles";
import FilterOptions from "@components/FilterOptions";
import { SxProps } from "@mui/material";
import UserCard from '@components/UserCard';
import { dummyUsers } from '@components/placeholders/dummyUsers'
import SearchBar from '@components/SearchBar'
import SortBy from '@components/SortBy'

export interface ConfirmationDialogRawProps {
  id: string;
  keepMounted: boolean;
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
}

const Users: NextPage = () => {
  const theme = useTheme();

  return (
    <Container sx={{ my: '50px' }}>
      <Grid container>
        <Grid item md={6}>
          <Typography variant="h1">
            Browse Users
          </Typography>
          <Typography variant="body2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dui ac nec molestie condimentum aliquam viverra sed nisi. Eu, nisl, integer ultricies fames pharetra sem eu commodo. Nam tellus, ut vel egestas pulvina.
          </Typography>
        </Grid>
        <Grid item md={6}>

        </Grid>
      </Grid>

      <SearchBar sx={{ mb: '24px' }} />

      <Grid
        container
        spacing={4}
        
        columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        sx={{ mb: "24px" }}
      >
        {dummyUsers.map((props, i) => {
          return (
            <Grid key={i} item xs={1}>
              <UserCard
                key={i}
                pfpUrl={props.pfpUrl}
                name={props.name}
                address={props.address}
              />
            </Grid>
          )
        })}
      </Grid>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Button variant="contained" sx={{}}>Load more...</Button>
      </Box>


    </Container>
  )
}

export default Users
