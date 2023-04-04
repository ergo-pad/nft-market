import React, { FC, useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { SxProps } from "@mui/material";
import { GridSortModel } from '@mui/x-data-grid';

interface ICollectionSortProps {
  sx?: SxProps;
  sortModel: GridSortModel;
  setSortModel: React.Dispatch<React.SetStateAction<GridSortModel>>;
}

const CollectionSort: FC<ICollectionSortProps> = ({ sx, sortModel, setSortModel }) => {
  const [sortOption, setSortOption] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value as string);
    const sort = event.target.value.split('-')[1]
    if (sort === 'asc' || sort === 'desc')
      setSortModel([{
        field: event.target.value.split('-')[0],
        sort: sort
      }])
    else setSortModel([])
  };

  useEffect(() => {
    if (sortModel.length > 0)
    setSortOption(sortModel[0].field + '-' + sortModel[0].sort)
    else setSortOption('')
  }, [sortModel])

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
        <MenuItem value={"rank-asc"}>Rank: highest first</MenuItem>
        <MenuItem value={"rank-desc"}>Rank: lowest first</MenuItem>
        <MenuItem value={"floorPrice-asc"}>Floor Price: low to high</MenuItem>
        <MenuItem value={"floorPrice-desc"}>Floor Price: high to low</MenuItem>
        <MenuItem value={"volume-asc"}>Volume: low to high</MenuItem>
        <MenuItem value={"volume-desc"}>Volume: high to low</MenuItem>
        <MenuItem value={"items-asc"}>Items: low to high</MenuItem>
        <MenuItem value={"items-desc"}>Items: high to low</MenuItem>
        <MenuItem value={"owners-asc"}>Owners: low to high</MenuItem>
        <MenuItem value={"owners-desc"}>Owners: high to low</MenuItem>
      </Select>
    </FormControl>
  );
};

export default CollectionSort;