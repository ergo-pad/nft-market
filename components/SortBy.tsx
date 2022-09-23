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
          <MenuItem value={"oldest"}>Oldest</MenuItem>
          <MenuItem value={"newest"}>Newest</MenuItem>
          <MenuItem value={"most members"}>Most Members</MenuItem>
          <MenuItem value={"least members"}>Least Members</MenuItem>
        </Select>
      </FormControl>
    );
  };

  export default SortBy;