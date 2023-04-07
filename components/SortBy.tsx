import React, { FC, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { SxProps } from "@mui/material";

interface ISortByProps {
  sx?: SxProps;
  inputData: any[];
  setSortedData: React.Dispatch<React.SetStateAction<any[]>>;
  controlledSortOption?: string;
  setControlledSortOption?: React.Dispatch<React.SetStateAction<string>>;
}

const SortBy: FC<ISortByProps> = ({
  sx,
  inputData,
  setSortedData,
  controlledSortOption,
  setControlledSortOption
}) => {
  const [sortOption, setSortOption] = React.useState("");

  useEffect(() => {
    if (controlledSortOption) setSortOption(controlledSortOption)
  }, [controlledSortOption])

  useEffect(() => {
    sortData(sortOption)
  }, [inputData, sortOption])

  const handleChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value as string);
    if (setControlledSortOption) {
      setControlledSortOption(event.target.value as string)
    }
  };

  const sortData = (sort: string) => {
    if (sort === 'price-lowtohigh') {
      const sorted = [...inputData].sort((a, b) => (a.price === undefined ? 1 : b.price === undefined ? -1 : a.price - b.price));
      setSortedData(sorted);
    }
    else if (sort === 'price-hightolow') {
      const sorted = [...inputData].sort((a, b) => (a.price === undefined ? 1 : b.price === undefined ? -1 : b.price - a.price));
      setSortedData(sorted);
    }
    else {
      setSortedData([...inputData]); // create a new array before setting the state
    }
  }

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
          No sorting
        </MenuItem>
        <MenuItem value={"price-lowtohigh"}>Price: low to high</MenuItem>
        <MenuItem value={"price-hightolow"}>Price: high to low</MenuItem>
        {/* <MenuItem value={"ending-soonest"}>Ending Soonest</MenuItem>
        <MenuItem value={"ending-latest"}>Ending Latest</MenuItem>
        <MenuItem value={"newest-first"}>Newest Listings First</MenuItem>
        <MenuItem value={"newest-last"}>Oldest Listings First</MenuItem> */}
      </Select>
    </FormControl>
  );
};

export default SortBy;