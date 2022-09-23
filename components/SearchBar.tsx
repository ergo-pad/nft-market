import React, { FC } from 'react';
import {
  FormControl,
  InputLabel,
  InputAdornment,
  FilledInput,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { SxProps } from "@mui/material";

interface ISearchBar {
  sx?: SxProps;
}

const SearchBar: FC<ISearchBar> = ({ sx }) => {
  return (
    <FormControl fullWidth variant="filled" sx={sx}>
      <InputLabel htmlFor="component-filled">Search</InputLabel>
      <FilledInput
        id="search"
        endAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default SearchBar;