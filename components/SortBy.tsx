import React, { FC } from 'react';
import {
    FormControl,
    InputLabel,
    MenuItem,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { SxProps } from "@mui/material";

interface ISortByProps {
    sx?: SxProps;
  }
  
  const SortBy: FC<ISortByProps> = ({ sx }) => {
    const [sortOption, setSortOption] = React.useState("");
  
    const handleChange = (event: SelectChangeEvent) => {
      setSortOption(event.target.value as string);
    };
  
    return (
      <FormControl fullWidth sx={sx} variant="filled">
        <InputLabel id="sort-select-box-input">Sort By</InputLabel>
        <Select
          labelId="sort-select-box-label"
          id="sort-select-box"
          value={sortOption}
          label="Sort By"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"price-lowtohigh"}>Price: low to high</MenuItem>
          <MenuItem value={"price-hightolow"}>Price: high to low</MenuItem>
          <MenuItem value={"rarity-lowtohigh"}>Rarity: low to high</MenuItem>
          <MenuItem value={"rarity-hightolow"}>Rarity: high to low</MenuItem>
          <MenuItem value={"newest-first"}>Newest First</MenuItem>
          <MenuItem value={"oldest-first"}>Oldest First</MenuItem>
        </Select>
      </FormControl>
    );
  };

  export default SortBy;