import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Dialog,
  TextField,
  Collapse,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  Grid,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  Avatar,
  Box,
  Chip,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from "@mui/icons-material/CheckCircle";
import { WalletContext } from '@contexts/WalletContext'
import { Address } from '@nautilus-wallet/ergo-ts';
import Nautilus from '@components/wallet/Nautilus';
import { ExpandMore } from '@mui/icons-material';

const WALLET_ADDRESS = 'wallet_address_7621';
const WALLET_ADDRESS_LIST = 'wallet_address_list_1283';
const DAPP_CONNECTED = 'dapp_connected_6329';
const DAPP_NAME = 'dapp_name_8930';

const wallets = [
  {
    name: 'Nautilus',
    icon: '/images/wallets/nautilus-128.png',
    description: 'Connect automatically signing with your wallet'
  },
  {
    name: 'SAFEW',
    icon: '/images/wallets/safew_icon_128.png',
    description: 'Connect automatically signing with your wallet'
  },
  {
    name: 'Mobile',
    icon: '/images/wallets/mobile.webp',
    description: 'Enter your wallet address manually'
  },
]

/**
 * Note on es-lint disable lines:
 *
 * Ergo dApp injector uses global variables injected from the browser,
 * es-lint will complain if we reference un defined varaibles.
 *
 * Injected variables:
 * - ergo
 * - window.ergo_check_read_access
 * - window.ergo_request_read_access
 * - window.ergoConnector
 */
export const AddWallet = () => {
  const router = useRouter();
  const theme = useTheme();
  const [walletInput, setWalletInput] = useState('');
  const {
    walletAddress,
    setWalletAddress,
    dAppWallet,
    setDAppWallet,
    addWalletModalOpen,
    setAddWalletModalOpen
  } = useContext(WalletContext);
  const [init, setInit] = useState(false);
  const [mobileAdd, setMobileAdd] = useState(false);
  const [expanded, setExpanded] = useState<string | false>(false);
  /**
   * dapp state
   *
   * loading: yoroi is slow so need to show a loader for yoroi
   * dAppConnected: true if permission granted (persisted in local storage)
   * dAppError: show error message
   * dAppAddressTableData: list available addresses from wallet
   */
  const [loading, setLoading] = useState(false);
  const [dAppError, setDAppError] = useState(false);
  const [dAppAddressTableData, setdAppAddressTableData] = useState([{}]); // table data

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      if (panel === 'nautilus' && isExpanded === true) dAppConnect('nautilus')
    };

  useEffect(() => {
    // load primary address
    const address = localStorage.getItem(WALLET_ADDRESS)
    if (address !== null) {
      setWalletAddress(address);
      setWalletInput(address);
    }
    // load dApp state
    const dappConnected = localStorage.getItem(DAPP_CONNECTED);
    const dappName = localStorage.getItem(DAPP_NAME);
    const walletAddressList = localStorage.getItem(WALLET_ADDRESS_LIST);
    if (
      dappConnected !== null &&
      dappName !== null &&
      walletAddressList !== null
    ) {
      setDAppWallet({
        connected: dappConnected === 'true' ? true : false,
        name: dappName,
        addresses: JSON.parse(walletAddressList),
      });
    }
    // refresh connection
    try {
      if (localStorage.getItem(DAPP_CONNECTED) === 'true') {
        window.ergoConnector[String(localStorage.getItem(DAPP_NAME))]
          .isConnected()
          .then((res: any) => {
            console.log(res)
            if (!res)
              window.ergoConnector[String(localStorage.getItem(DAPP_NAME))]
                .connect()
                .then((res: any) => {
                  if (!res) clearWallet();
                });
          });
      }
    } catch (e) {
      console.log(e);
    }
    setInit(true);
  }, []); // eslint-disable-line

  /**
   * update persist storage
   */
  useEffect(() => {
    if (init) {
      localStorage.setItem(DAPP_CONNECTED, dAppWallet.connected.toString());
      localStorage.setItem(DAPP_NAME, dAppWallet.name);
      localStorage.setItem(
        WALLET_ADDRESS_LIST,
        JSON.stringify(dAppWallet.addresses)
      );
    }
  }, [dAppWallet, init]);

  useEffect(() => {
    if (init) localStorage.setItem(WALLET_ADDRESS, walletAddress);
  }, [walletAddress, init]);

  const handleClose = () => {
    // reset unsaved changes
    setAddWalletModalOpen(false);
    setWalletInput(walletAddress);
    setDAppError(false);
  };

  const handleSubmitWallet = () => {
    // add read only wallet
    setAddWalletModalOpen(false);
    setWalletAddress(walletInput);
    // clear dApp state
    setDAppError(false);
    setDAppWallet({
      connected: false,
      name: '',
      addresses: [],
    });
  };

  const clearWallet = (hardRefresh = false) => {
    // clear state and local storage
    setWalletInput('');
    setWalletAddress('');
    // clear dApp state
    setDAppError(false);
    setDAppWallet({
      connected: false,
      name: '',
      addresses: [],
    });
    if (hardRefresh) router.reload();
  };

  const handleWalletFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletInput(e.target.value);
  };

  /**
   * dapp connector
   */
  const dAppConnect = async (walletAddress: string) => {
    const walletMapper: { [index: string]: any } = {
      nautilus: window.ergoConnector?.nautilus,
      safew: window.ergoConnector?.safew,
    };
    setLoading(true);
    try {
      if (await walletMapper[walletAddress].isConnected()) {
        await dAppLoad(walletAddress);
        setLoading(false);
        return;
      } else if (await walletMapper[walletAddress].connect()) {
        await dAppLoad(walletAddress);
        setLoading(false);
        return;
      }
      setDAppError(true);
    } catch (e) {
      setDAppError(true);
      console.log(e);
    }
    setLoading(false);
  };

  const dAppLoad = async (walletAddress: string) => {
    try {
      // @ts-ignore
      const address_used = await ergo.get_used_addresses(); // eslint-disable-line
      // @ts-ignore
      const address_unused = await ergo.get_unused_addresses(); // eslint-disable-line
      const addresses = [...address_used, ...address_unused];
      // use the first used address if available or the first unused one if not as default
      const address = addresses.length ? addresses[0] : '';
      setWalletAddress(address);
      setWalletInput(address);
      // update dApp state
      setDAppWallet({
        connected: true,
        name: walletAddress,
        addresses: addresses,
      });
      setDAppError(false);
    } catch (e) {
      console.log(e);
      // update dApp state
      setDAppWallet({
        connected: false,
        name: '',
        addresses: [],
      });
      setDAppError(true);
    }
  };

  const changeWalletAddress = (address: string) => {
    setWalletAddress(address);
    setWalletInput(address);
  };

  const loadAddresses = async () => {
    setLoading(true);
    try {
      // @ts-ignore
      const address_used: string[] = await ergo.get_used_addresses();
      // @ts-ignore
      const address_unused: string[] = await ergo.get_unused_addresses();
      const addresses = [...address_used, ...address_unused];
      const addressData = addresses.map((address, index) => {
        return { id: index, name: address };
      });
      setDAppWallet({
        ...dAppWallet,
        addresses: addresses,
      });
      setdAppAddressTableData(addressData);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <>
      <Button onClick={() => setAddWalletModalOpen(true)}>
        Wallet
      </Button>
      <Dialog open={addWalletModalOpen} onClose={handleClose}>
        <DialogTitle
          sx={{
            textAlign: 'center',
            mb: 0,
            pb: 0,
            fontWeight: '800',
            fontSize: '32px',
          }}
        >
          {dAppWallet.connected ? 'DApp Connected' : 'Connect Wallet'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center', mb: '24px' }}>
            Your wallet info will never be stored on our server.
          </DialogContentText>

          {wallets.map((props, i) => {
            return (
              <Button
                fullWidth
                sx={{
                  borderRadius: '6px',
                  display: 'flex',
                  p: '0.5rem',
                  justifyContent: 'space-between',
                  mb: '12px'
                }}
                key={i}
              >
                <Box
                  sx={{
                    fontSize: "1.2rem",
                    color: "text.primary",
                    fontWeight: '400',
                    textAlign: 'left',
                    display: 'flex',
                  }}
                >
                  <Avatar
                    src={props.icon}
                    variant={props.name === "SAFEW" ? 'square' : 'circular'}
                    sx={{
                      height: "3rem",
                      width: "3rem",
                      mr: "1rem",
                    }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "1.1rem",
                        color: "text.secondary",
                        fontWeight: '400'
                      }}
                    >
                      {props.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: ".9rem",
                        color: "text.secondary",
                        fontWeight: '400'
                      }}
                    >
                      {props.description}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{
                  transform: 'rotate(-90deg)',
                  textAlign: 'right',
                  lineHeight: '0',
                  mr: '-0.5rem'
                }}>
                  <ExpandMoreIcon />
                </Box>
              </Button>
            )
          })}






          {!dAppWallet.connected && (
            <Grid container spacing={2} sx={{ py: 2 }}>
              <Grid item xs={4}>
                <Button
                  // disabled={loading || wallet}
                  onClick={() => dAppConnect('nautilus')}
                  sx={{
                    color: '#fff',
                    textTransform: 'none',
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': {
                      boxShadow: 'none',
                    },
                    '&:active': {

                    },
                    width: '100%',
                  }}
                >
                  Nautilus
                  {loading && (
                    <CircularProgress
                      sx={{ ml: 2, color: 'white' }}
                      size={'1.2rem'}
                    />
                  )}
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  // disabled={loading || wallet}
                  onClick={() => dAppConnect('safew')}
                  sx={{
                    color: '#fff',
                    textTransform: 'none',
                    backgroundColor: theme.palette.secondary.main,
                    '&:hover': {

                      boxShadow: 'none',
                    },
                    '&:active': {
                      // backgroundColor: theme.palette.secondary.active,
                    },
                    width: '100%',
                  }}
                >
                  SafeW
                  {loading && (
                    <CircularProgress
                      sx={{ ml: 2, color: 'white' }}
                      size={'1.2rem'}
                    />
                  )}
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  onClick={() => setMobileAdd(!mobileAdd)}
                  sx={{
                    color: '#fff',
                    textTransform: 'none',

                    '&:hover': {

                      boxShadow: 'none',
                    },
                    '&:active': {

                    },
                    width: '100%',
                  }}
                >
                  Mobile
                </Button>
              </Grid>
            </Grid>
          )}
          <FormHelperText error={true}>
            {dAppError
              ? 'Failed to connect to wallet. Please retry after refreshing page.'
              : ''}
          </FormHelperText>
          {/* {dAppWallet.connected && (
            <Accordion sx={{ mt: 1 }}>
              <AccordionSummary onClick={loadAddresses}>
                <strong>Change Address</strong>
              </AccordionSummary>
              <AccordionDetails>
                <PaginatedTable
                  rows={dAppAddressTableData}
                  onClick={(index) =>
                    changeWalletAddress(dAppAddressTableData[index].name)
                  }
                />
              </AccordionDetails>
            </Accordion>
          )} */}
          {/* <Collapse in={mobileAdd || dAppWallet.connected}>
            <TextField
              disabled={dAppWallet.connected}
              autoFocus
              margin="dense"
              id="name"
              label="Wallet address"
              type="wallet"
              fullWidth
              variant="outlined"
              value={walletInput}
              onChange={handleWalletFormChange}
              error={!isAddressValid(walletInput)}
              sx={{
                '& .MuiOutlinedInput-input:-webkit-autofill': {
                  boxShadow: '0 0 0 100px rgba(35, 35, 39, 1) inset',
                },
              }}
            />
            <FormHelperText error={true}>
              {!isAddressValid(walletInput) ? 'Invalid ergo address.' : ''}
            </FormHelperText>
          </Collapse> */}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-around', pb: 2 }}>
          <Button sx={{ width: '150px' }} onClick={handleClose}>Close Window</Button>
          <Button sx={{ width: '150px' }} disabled={!walletAddress} onClick={() => clearWallet(true)}>
            Remove Wallet
          </Button>
          <Button
            sx={{ width: '150px' }}
            onClick={handleSubmitWallet}
            disabled={!isAddressValid(walletInput) || dAppWallet.connected}
          >
            Connect
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export function isAddressValid(address: string) {
  try {
    return new Address(address).isValid();
  } catch (_) {
    return false;
  }
}

export default AddWallet;
