import { Avatar, Box, Button, InputAdornment, TextField } from "@mui/material";
import { useState, FC, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { isAddressValid } from "./AddWallet";
import { LoadingButton } from "@mui/lab";

const Nautilus: FC<{
  // set: Function;
  connect: Function;
  setLoading: Function;
  setDAppWallet: Function;
  dAppWallet: any;
  loading: boolean;
  clear: Function;
  wallet: string;
}> = (props) => {
  const [changeLoading, setChangeLoading] = useState<number>(0);
  const [loggedIn, setLoggedIn] = useState(true)

  useEffect(() => {
    const wrapper = async () => {
      props.setLoading(true);
      await props.connect();
      props.setLoading(false);
    };
    if (!props.dAppWallet.connected || !isAddressValid(props.wallet)) {
      wrapper();
    }
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      {props.dAppWallet.connected && isAddressValid(props.wallet) ? (
        <>
          <Box sx={{ mt: ".5rem", fontSize: ".9rem", mb: ".5rem" }}>
            Select which address you want to use as as the default.
          </Box>
          <TextField
            label="Default Wallet Address"
            sx={{ width: "100%", mt: ".75rem" }}
            value={props.wallet}
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {props.wallet !== "" && <CheckCircleIcon color="success" />}
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              width: "100%",
              border: "1px solid",
              borderColor: "border.main",
              borderRadius: ".3rem",
              mt: "1rem",
              maxHeight: "12rem",
              overflowY: "auto",
            }}
          >
            {props.dAppWallet.addresses.map((i: any, c: number) => {
              return (
                i.name !== undefined && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      fontSize: ".7rem",
                      pl: ".5rem",
                      mt: ".5rem",
                      pb: ".5rem",
                      borderBottom:
                        c === props.dAppWallet.addresses.length - 1 ? 0 : "1px solid",
                      borderBottomColor: "border.main",
                    }}
                    key={`${i.name}-address-selector-${c}`}
                  >
                    {i.name}
                    {changeLoading === c ||
                      (!loggedIn && changeLoading === c) ? (
                      <LoadingButton
                        color="primary"
                        loading
                        variant="contained"
                        sx={{ ml: "auto", mr: ".5rem" }}
                      >
                        Active
                      </LoadingButton>
                    ) : (
                      <Button
                        sx={{ ml: "auto", mr: ".5rem" }}
                        variant="contained"
                        color={props.wallet === i.name ? "success" : "primary"}
                        size="small"
                      // onClick={}
                      >
                        {props.wallet === i.name ? "Active" : "Choose"}
                      </Button>
                    )}
                  </Box>
                )
              );
            })}
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ mt: ".5rem", fontSize: ".9rem" }}>
            Follow the instructions in your Nautilus Wallet to confirm and you
            will connect your wallet instantly. If a popup box is not appearing
            or if you accidentally closed it, please{" "}
            <Box
              sx={{
                cursor: "pointer",
                display: "inline",
                textDecoration: "underline",
                color: "primary.main",
              }}
              onClick={async () => {
                await props.connect();
              }}
            >
              click here
            </Box>{" "}
            to open it again
          </Box>
        </>
      )}
    </Box>
  );
};

export default Nautilus;
