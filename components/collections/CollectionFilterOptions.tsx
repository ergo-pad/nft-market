import React, { FC, useEffect, useMemo, useState } from "react";
import {
  Typography,
  Box,
  Divider,
  Grid,
  TextField
} from "@mui/material";
import { IFilters } from "@components/collections/CollectionList";

interface ICollectionFilterOptions {
  data: any[];
  setFilteredValues: React.Dispatch<React.SetStateAction<any[]>>;
  filters: IFilters;
  setFilters: React.Dispatch<React.SetStateAction<IFilters>>;
}

const CollectionFilterOptions: FC<ICollectionFilterOptions> = ({ data, setFilteredValues, filters, setFilters }) => {

  const handleChangeFilters = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [parent, child] = name.split('-'); // split the name into parent and child properties
    setFilters(prevFilters => ({
      ...prevFilters,
      [parent]: {
        ...prevFilters[parent as keyof IFilters],
        [child]: value // update the child property with the new value
      }
    }));
  };

  useEffect(() => {
    const filterMax = data.filter(item => {
      return !filters.floorPrice.max || item.floorPrice < filters.floorPrice.max;
    }).filter(item => {
      return !filters.volume.max || item.volume < filters.volume.max;
    }).filter(item => {
      return !filters.items.max || item.items < filters.items.max;
    }).filter(item => {
      return !filters.owners.max || item.owners < filters.owners.max;
    });

    const filterMin = filterMax.filter(item => {
      return !filters.floorPrice.min || item.floorPrice > filters.floorPrice.min;
    }).filter(item => {
      return !filters.volume.min || item.volume > filters.volume.min;
    }).filter(item => {
      return !filters.items.min || item.items > filters.items.min;
    }).filter(item => {
      return !filters.owners.min || item.owners > filters.owners.min;
    });

    setFilteredValues(filterMin);
  }, [filters]);

  return (
    <>
      <Typography variant="h5" sx={{ mb: 0 }}>Filter</Typography>
      <Divider sx={{ mb: 2 }} />

      <Filter
        filters={filters}
        handleChangeFilters={handleChangeFilters}
        title="Floor Price"
        variableName="floorPrice"
        currency="Erg"
      />
      <Filter
        filters={filters}
        handleChangeFilters={handleChangeFilters}
        title="Volume"
        variableName="volume"
        currency="Erg"
      />
      <Filter
        filters={filters}
        handleChangeFilters={handleChangeFilters}
        title="Items"
        variableName="items"
      />
      <Filter
        filters={filters}
        handleChangeFilters={handleChangeFilters}
        title="Owners"
        variableName="owners"
      />

    </>
  );
};

export default CollectionFilterOptions;


const Filter: FC<{
  filters: IFilters;
  handleChangeFilters: Function;
  title: string;
  variableName: string;
  currency?: string;
}> = ({
  filters,
  handleChangeFilters,
  title,
  variableName,
  currency
}) => {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          <Grid item xs={4}>
            <TextField
              fullWidth
              variant="filled"
              id={variableName + '-filter-min'}
              placeholder="Min"
              name={variableName + '-min'}
              type="number"
              value={filters[variableName as keyof IFilters].min}
              sx={{ '& .MuiInputBase-input': { pt: '8px' } }}
              onChange={(e: any) => handleChangeFilters(e)}
            />
          </Grid>
          <Grid item xs={1} sx={{ textAlign: 'center' }}>
            —
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              variant="filled"
              id={variableName + '-filter-max'}
              placeholder="Max"
              type="number"
              name={variableName + '-max'}
              value={filters[variableName as keyof IFilters].max}
              sx={{ '& .MuiInputBase-input': { pt: '8px' } }}
              onChange={(e: any) => handleChangeFilters(e)}
            />
          </Grid>
          <Grid item xs={3}>
            {currency}
          </Grid>
        </Grid>
      </Box>
    )
  }