import React, { FC } from 'react';
import type { NextPage } from 'next';
import {
  Grid,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  InputAdornment,
  OutlinedInput,
  useMediaQuery,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Container,
  Typography,
  Box
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useTheme } from "@mui/material/styles";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
// @ts-ignore
import FilterOptions from "@components/FilterOptions";
import { SxProps } from "@mui/material";
import NftCard from '@components/NftCard';
import { recentNfts } from '@components/placeholders/recentNfts'

const marketStats = [
  {
    title: 'Collections',
    number: '2'
  },
  {
    title: 'NFTs',
    number: '1452'
  },
  {
    title: 'USD Traded',
    number: '$1.83k'
  },
  {
    title: 'Wallets',
    number: '17k'
  }
]

interface ISortByProps {
  sx?: SxProps;
}

const SortBy: FC<ISortByProps> = ({ sx }) => {
  const [sortOption, setSortOption] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value as string);
  };

  return (
    <FormControl fullWidth sx={sx}>
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

interface ISearchBar {
  sx?: SxProps;
}

const SearchBar: FC<ISearchBar> = ({ sx }) => {
  return (
    <FormControl fullWidth variant="outlined" sx={sx}>
      <InputLabel htmlFor="outlined-adornment-search">Search</InputLabel>
      <OutlinedInput
        id="outlined-adornment-search"
        endAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        label="Search"
      />
    </FormControl>
  );
};

export interface ConfirmationDialogRawProps {
  id: string;
  keepMounted: boolean;
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const radioGroupRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          background: "rgb(14, 20, 33)",
          width: "100%",
          maxWidth: "400px",
          maxHeight: "80vh",
        },
      }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Filter &amp; Sort</DialogTitle>
      <DialogContent dividers>
        <SortBy sx={{ mb: "24px" }} />
        <FilterOptions />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

const Marketplace: NextPage = () => {
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [filterDialogvalue, setFilterDialogValue] = React.useState("Dione");

  const handleDialogClick = () => {
    setFilterDialogOpen(true);
  };

  const handleDialogClose = (newValue?: string) => {
    setFilterDialogOpen(false);

    if (newValue) {
      setFilterDialogValue(newValue);
    }
  };

  const theme = useTheme();

  return (
    <Container sx={{ my: '50px' }}>
      <Grid container>
        <Grid item md={6}>
          <Typography variant="h1">
            Marketplace
          </Typography>
          <Typography variant="body2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dui ac nec molestie condimentum aliquam viverra sed nisi. Eu, nisl, integer ultricies fames pharetra sem eu commodo. Nam tellus, ut vel egestas pulvina.
          </Typography>
        </Grid>
        <Grid item md={6}>
          <Grid container>
            {marketStats.map((props, i) => {
              return (
                <Grid item md={3}>
                  {props.number}
                  {props.title}
                </Grid>
              )
            })}
          </Grid>
        </Grid>
      </Grid>
      <Grid container>
        <Grid
          item
          lg={3}
          sx={{ pr: "24px", display: { xs: "none", lg: "block" } }}
        >
          <FilterOptions />
        </Grid>
        <Grid item lg={9} xs={12}>
          {useMediaQuery(theme.breakpoints.up("lg")) ? (
            <Grid container sx={{ mb: "32px" }} spacing={3}>
              <Grid item md={7}>
                <SearchBar />
              </Grid>
              <Grid item md={5}>
                <SortBy />
              </Grid>
            </Grid>
          ) : (
            <Grid container sx={{ mb: "32px" }} spacing={3} direction="row">
              <Grid item xs>
                <SearchBar />
              </Grid>
              <Grid item xs="auto">
                <Button
                  sx={{ height: "100%" }}
                  variant="outlined"
                  aria-label="filter"
                  onClick={handleDialogClick}
                >
                  <FilterAltIcon />
                </Button>
                <ConfirmationDialogRaw
                  id="ringtone-menu"
                  keepMounted
                  open={filterDialogOpen}
                  onClose={handleDialogClose}
                  value={filterDialogvalue}
                />
              </Grid>
            </Grid>
          )}
          <Grid
            container
            spacing={4}
            columns={{ xs: 1, sm: 2, md: 3 }}
            sx={{ mb: "24px" }}
          >
            {recentNfts.map((props, i) => {
              return (
                <Grid key={i} item xs={1}>
                  <NftCard
                    key={i}
                    link={props.link}
                    imgUrl={props.imgUrl}
                    name={props.name}
                    price={props.price}
                    rarity={props.rarity}
                    time={props.time}
                    collection={props.collection}
                    collectionLink={props.collectionLink}
                    artist={props.artist}
                    artistLink={props.artistLink}
                    artistLogo={props.artistLogo}
                  />
                </Grid>
              )
            })}
          </Grid>
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Button variant="contained" sx={{}}>Load more...</Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Marketplace
