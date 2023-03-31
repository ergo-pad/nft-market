import React, { FC } from 'react';
import {
  Grid,
  Button,
  useMediaQuery,
  DialogContent,
  DialogActions,
  Dialog,
  Box
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useTheme } from "@mui/material/styles";
import FilterOptions from "@components/FilterOptions";
import NftCard, { INftItem } from '@components/NftCard';
import SearchBar from '@components/SearchBar'
import SortBy from '@components/SortBy'
import { ICollectionTraits, ICollectionRarities } from "@components/collections/Properties";

export interface ConfirmationDialogRawProps {
  id: string;
  keepMounted: boolean;
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
}

export interface ITokenListProps {
  nftListArray: INftItem[];
  setDisplayNumber: React.Dispatch<React.SetStateAction<number>>;
  notFullWidth?: boolean;
}

const TokenList: FC<ITokenListProps> = ({ nftListArray, setDisplayNumber, notFullWidth }) => {
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [filterDialogvalue, setFilterDialogValue] = React.useState("What");

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
            variant="outlined"
            sx={{
              height: "100%",
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.divider,
              '&:hover': {
                color: theme.palette.text.secondary,
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.text.secondary,
              }
            }}
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
        columns={{ xs: 1, sm: 2, md: 3, lg: notFullWidth ? 3 : 4, xl: notFullWidth ? 4 : 5 }}
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
          // background: "rgb(14, 20, 33)",
          width: "100%",
          maxWidth: "400px",
          // maxHeight: "80vh",
          
        },
      }}
      maxWidth={desktop ? 'sm' : undefined}
      fullScreen={!desktop}
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogContent dividers sx={{ p: '16px', border: 'none' }}>
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

export default TokenList
