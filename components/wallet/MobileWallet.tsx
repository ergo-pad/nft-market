import { FC } from 'react';
import ergo from "@public/icons/ergo.png";
import ClearIcon from "@mui/icons-material/Clear";
import QRCode from "react-qr-code";
import {
  Avatar,
  Box,
  Button,
  DialogContentText,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { isAddressValid } from "./AddWallet";

const MobileWallet: FC<{
  set: Function;
  wallet: string;
  setWallet: Function;
  qrCode: string;
}> = (props) => {
  return (
    <Box sx={{ width: "100%" }}>
      {props.qrCode === undefined ? (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: "1rem",
              width: "100%",
              backgroundColor: "primary.lightOpacity",
              p: "1rem",
              borderRadius: ".5rem",
              border: "1px solid",
              borderColor: "primary.main",
            }}
          >
            <Avatar
              src={ergo.src}
              sx={{ height: "2.5rem", width: "2.5rem", mr: "1rem" }}
            />
            <Box sx={{ fontSize: "1.2rem", color: "text.primary" }}>
              Mobile Wallet
              <Box
                sx={{
                  fontSize: ".9rem",
                  color: "text.secondary",
                  mt: "-.25rem",
                }}
              >
                Connect by manually adding your wallet address
              </Box>
            </Box>
            <Button
              sx={{ ml: "auto" }}
              size="small"
              onClick={() => props.set()}
            >
              Change
            </Button>
          </Box>
          <Box sx={{ mt: ".75rem", fontSize: ".9rem" }}>
            Please type your wallet address in the input field in order to
            connect.
          </Box>
          <TextField
            key="mobile-wallet-input"
            label="Wallet address    "
            sx={{ width: "100%", mt: ".75rem", fontSize: ".9rem" }}
            value={props.wallet}
            onChange={(e: any) => props.setWallet(e.target.value)}
            autoComplete={"false"}
            size="medium"
            InputProps={{
              readOnly: props.qrCode === undefined && isAddressValid(props.wallet),
              endAdornment: !isAddressValid(props.wallet) && (
                <InputAdornment position="end">
                  {props.wallet !== "" && (
                    <IconButton
                      color="primary"
                      onClick={() => props.setWallet("")}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </>
      ) : (
        <Box sx={{ width: "100%" }}>
          <DialogContentText
            sx={{ fontSize: ".9rem", mb: ".75rem", mt: ".75rem" }}
          >
            Please use the QR code to authenticate with Ergo Mobile Wallet.
          </DialogContentText>
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <QRCode value={props.qrCode} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MobileWallet;
