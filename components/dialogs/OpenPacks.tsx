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
import Image from 'next/image';
import Link from '@components/Link';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
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

interface IOpenPacksProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  packs: {
    name: string;
    collection?: string;
    artist: string;
    imgUrl: string;
  }[]
}

const OpenPacks: FC<IOpenPacksProps> = ({ open, setOpen, packs }) => {
  const [submitting, setSubmitting] = useState<"submitting" | "success" | "failed" | undefined>(undefined)

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
        return 'Open Packs';
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
            {packs.map((item, i) => {
              return (
                <Grid2
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                  sx={{
                    width: '100%',
                    p: '12px',
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }}
                  key={i}
                >
                  <Grid2 xs="auto">
                    <Image
                      src={item.imgUrl}
                      layout="fixed"
                      width={48}
                      height={48}
                      alt="nft-image"
                      sizes="48px"
                      objectFit="cover"
                    />
                  </Grid2>
                  <Grid2 xs>
                    <Typography sx={{ fontWeight: '700' }}>
                      {item.name}
                    </Typography>
                    {item.collection && (
                      <Typography>
                        {item.collection}
                      </Typography>
                    )}
                    <Typography>
                      {item.artist}
                    </Typography>
                  </Grid2>
                </Grid2>
              )
            })}
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
            Confirm Open
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}

export default OpenPacks;