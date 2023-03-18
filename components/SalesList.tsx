import React, { FC } from 'react';
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
import NftCard, { INftItem } from '@components/NftCard';
import { recentNfts } from '@components/placeholders/recentNfts'
import SearchBar from '@components/SearchBar'
import SortBy from '@components/SortBy'

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

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("sm"))

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
        {!desktop && <SortBy sx={{ mb: "24px" }} />}
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

export interface ISalesListProps {
  nftListArray: INftItem[];
  setDisplayNumber: React.Dispatch<React.SetStateAction<number>>;
}

const SalesList: FC<ISalesListProps> = ({ nftListArray, setDisplayNumber }) => {
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [filterDialogvalue, setFilterDialogValue] = React.useState("Dione");

  const displayMore = () => {
    setDisplayNumber((prev: number) => prev + 12)
  }

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
  const desktop = useMediaQuery(theme.breakpoints.up("sm"))

  return (
    <>
      <Grid container sx={{ mb: 2 }} spacing={2}>
        <Grid item xs sm={7}>
          <SearchBar />
        </Grid>
        {desktop && (
          <Grid item sm>
            <SortBy />
          </Grid>
        )}
        <Grid item xs="auto">
          <Button
            sx={{ height: "100%" }}
            variant="contained"
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
      <Grid
        container
        spacing={2}
        columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        sx={{ mb: "24px" }}
      >
        {nftListArray.map((item, i) => {
          return (
            <Grid key={i} item xs={1}>
              <NftCard
                nftData={item}
              />
            </Grid>
          )
        })}
      </Grid>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Button
          variant="contained"
          sx={{}}
          onClick={displayMore} // SWITCH TO SCROLL TRIGGER FOR INFINITE SCROLL
        >
          Load more...
        </Button>
      </Box>
    </>
  )
}

export default SalesList
