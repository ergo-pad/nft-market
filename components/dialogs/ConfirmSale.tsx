import React, { FC, useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Box,
  useTheme,
  useMediaQuery,
  TextField,
  FormControl,
  OutlinedInput,
  InputAdornment,
  FormHelperText
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    maxWidth: '440px',
    minWidth: '350px',
    border: 'none',
    margin: 'auto'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

interface IConfirmSaleProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tokenName: string;
  qty?: number;
  openNow?: boolean;
  price: number;
  currency: string;
  isBid?: boolean;
}

const ConfirmSale: FC<IConfirmSaleProps> = ({ open, setOpen, tokenName, qty, openNow, price, currency, isBid }) => {
  const [submitting, setSubmitting] = useState<"submitting" | "success" | "failed" | undefined>(undefined)
  const [bidPrice, setBidPrice] = useState(price + (price * 0.1))
  const [error, setError] = useState(false)

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBidPrice(Number(e.target.value))
    if (Number(e.target.value) < (price + 1)) setError(true)
    else setError(false)
  }

  const handleClose = () => {
    setSubmitting(undefined)
    setOpen(false);
  };

  const submit = () => {
    setSubmitting("submitting")
  }

  const switchTitle = (param: string | undefined) => {
    switch (param) {
      case "submitting":
        return 'Awaiting Confirmation';
      case "success":
        return 'Success';
      case "failed":
        return 'Transaction Failed';
      default:
        return 'Order Summary';
    }
  }

  const switchContent = (param: string | undefined) => {
    switch (param) {
      case "submitting":
        return (
          <Box
            sx={{
              textAlign: 'center',
            }}
          >
            <CircularProgress size={120} thickness={1} sx={{ mb: '12px' }} />
            <Typography
              sx={{
                fontWeight: '600',
                mb: '12px'
              }}
            >
              Awaiting your confirmation of the transaction in the dApp connector.
            </Typography>
            <Button onClick={() => setSubmitting("success")}>
              Test Success
            </Button>
            <Button onClick={() => setSubmitting("failed")}>
              Test Failed
            </Button>
          </Box>
        )
      case "success":
        return (
          <Box
            sx={{
              textAlign: 'center',
            }}
          >
            <TaskAltIcon sx={{ fontSize: '120px' }} />
            <Typography
              sx={{
                fontWeight: '600',
                mb: '12px'
              }}
            >
              Transaction succeeded.
            </Typography>
          </Box>
        )
      case "failed":
        return (
          <Box
            sx={{
              textAlign: 'center',
            }}
          >
            <CancelOutlinedIcon sx={{ fontSize: '120px' }} />
            <Typography
              sx={{
                fontWeight: '600',
                mb: '12px'
              }}
            >
              Transaction failed, please try again.
            </Typography>
          </Box>
        )
      default:
        return (
          <>
            <Table
              sx={{
                minWidth: 'auto',
                // mb: '16px',
              }}
              aria-label="Order Summary"
            >
              <TableBody
                sx={{
                  '& .MuiTableCell-root': {
                    borderBottom: 'none',
                    p: '6px 0',
                  },
                }}
              >
                <TableRow>
                  <TableCell>Name: </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>{tokenName}</TableCell>
                </TableRow>
                {qty && (
                  <TableRow>
                    <TableCell>Quantity: </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{qty}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell>{isBid ? 'Your Bid: ' : 'Total Price: '}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {isBid ? (
                      <FormControl error={error} variant="outlined" sx={{ maxWidth: '160px' }}>
                        <OutlinedInput
                          // variant="filled"
                          id="bid-value"
                          size="small"
                          // label="Your Bid"
                          name="bid-value"
                          type="number"
                          value={bidPrice.toString()}
                          onChange={handleBidChange}
                          endAdornment={<InputAdornment position="end">{currency}</InputAdornment>}
                        />
                        {error && <FormHelperText>Minimum bid is {price + 1}{' ' + currency}</FormHelperText>}
                      </FormControl>
                    ) : (
                      price + ' ' + currency
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {openNow !== undefined && (
              <Typography variant="body2" sx={{ mb: 0, mt: '24px' }}>
                {openNow ? (
                  'Note: You have chosen to open the packs right away. You will receive the NFTs immediately and not be sent pack tokens. '
                ) : (
                  "Note:  You have chosen to receive the pack tokens to your wallet, and will be able to open them when you're ready, or trade them. "
                )}
              </Typography>
            )}
          </>
        )
    }
  }

  const theme = useTheme()
  const extraSmall = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullScreen={extraSmall}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {switchTitle(submitting)}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {switchContent(submitting)}
        </DialogContent>
        <DialogActions sx={{
          display: !submitting ? 'block' : 'none'
        }}>
          <Button autoFocus fullWidth onClick={submit} variant="contained">
            Confirm Purchase
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}

export default ConfirmSale;