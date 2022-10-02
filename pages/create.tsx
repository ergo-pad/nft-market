import React, { FC, useState, useEffect, useRef, useContext } from 'react';
import type { NextPage } from 'next'
import {
  Grid,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Icon,
  Fade,
  Tooltip,
  Collapse,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  IconButton,
  Divider,
  Stepper,
  Step,
  StepButton,
  FormControl,
  InputLabel,
  InputAdornment,
  FilledInput,
  TextField,
  ToggleButtonGroup,
  Switch,
  ToggleButton,
  SelectChangeEvent
} from '@mui/material'
import Link from '@components/Link'
import ButtonLink from '@components/ButtonLink'
import Image from 'next/image';
import { motion } from 'framer-motion'
import { WalletContext } from '@contexts/WalletContext'

interface IFormData {
  artist: {
    address: string;
    name?: string;
    website?: string;
    tagline?: string;
    social?: {
      socialNetwork: string;
      address: string;
    }[];
  }
  collection?: {

  }
  sale: {

  }
  tokens: {

  }
}

///////////////////////////////////////////////////////////////////
// BEGIN PLACEHOLDER DATA /////////////////////////////////////////
const formData = {
  artist: {
    address: '',
    name: '',
    website: '',
    tagline: '',
    social: [
      {
        socialNetwork: '',
        address: '',
      }
    ]
  },
  collection: {

  },
  sale: {

  },
  tokens: {

  }
}
// END PLACEHOLDER DATA ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////

const steps = [
  'Artist',
  'Collection Details',
  'Sale Info',
  'Token Details'
];

const Create: NextPage = () => {
  const {
    walletAddress,
    setWalletAddress,
    dAppWallet,
    setDAppWallet,
    addWalletModalOpen,
    setAddWalletModalOpen
  } = useContext(WalletContext);
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))


  const [scrollY, setScrollY] = useState(0)
  const userProfileCard = useRef<HTMLDivElement>(null)
  const userProfileContainer = useRef<HTMLDivElement>(null)
  const handleScroll = () => {
    const scrollPos = window.scrollY - 216
    if (scrollPos > 0 && (userProfileCard.current !== null && userProfileContainer.current !== null)) {
      if (scrollPos < (userProfileContainer.current.clientHeight - userProfileCard.current.clientHeight)) {
        setScrollY(scrollPos)
      }
      else {
        setScrollY(userProfileContainer.current.clientHeight - userProfileCard.current.clientHeight)
      }
    }
    else {
      setScrollY(0)
    }
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  const [activeStep, setActiveStep] = React.useState(0);
  const [stepperCompleted, setStepperCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const totalSteps = () => {
    return steps.length;
  };
  const completedSteps = () => {
    return Object.keys(stepperCompleted).length;
  };
  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };
  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };
  const handleStepperNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
        // find the first step that has been completed
        steps.findIndex((step, i) => !(i in stepperCompleted))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };
  const handleStepperBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };
  const handleStepperComplete = () => {
    const newCompleted = stepperCompleted;
    newCompleted[activeStep] = true;
    setStepperCompleted(newCompleted);
    handleStepperNext();
  };
  const handleStepperReset = () => {
    setActiveStep(0);
    setStepperCompleted({});
  };

  const [packToggle, setPackToggle] = useState(false)
  const handlePackToggle = () => {
    setPackToggle(!packToggle);
  };


  return (
    <Container sx={{ my: '50px' }}>
      <Box>
        <Typography variant="h1">
          Create New Tokens
        </Typography>
        <Typography variant="body2" sx={{ mb: '24px' }}>
          You can mint a single NFT, create your own collections, and even set up your own sales platform through this page.
        </Typography>
      </Box>

      <Box sx={{
        display: { xs: "block", lg: "none" }
      }}>
        <Stepper nonLinear activeStep={activeStep} sx={{ mb: '24px' }}>
          {steps.map((label, i) => (
            <Step key={label} completed={stepperCompleted[i]}>
              <StepButton
                color="inherit"
                onClick={handleStep(i)}
                sx={{
                  '& .MuiStepLabel-root .MuiStepLabel-labelContainer .MuiStepLabel-label': {
                    mb: 0
                  }
                }}
              >
                <Collapse orientation="horizontal" in={activeStep === i}
                  sx={{
                    maxHeight: '28px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {label}
                </Collapse>
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Grid container>
        <Grid
          item
          lg={3}
          sx={{ pr: "24px", display: { xs: "none", lg: "flex" } }}
        >
          <Box sx={{ position: 'relative', height: 'calc(100% + 100px)' }} ref={userProfileContainer}>
            <motion.div
              animate={{
                y: scrollY
              }}
              transition={{ type: "spring" }}
            >
              <Paper
                ref={userProfileCard}
                sx={{
                  p: '24px',
                  top: 84,
                  width: '100%',
                  zIndex: '100'
                }}
              >
                {/* STEPPER DESKTOP */}

                <Stepper nonLinear activeStep={activeStep} orientation="vertical">
                  {steps.map((label, index) => (
                    <Step key={label} completed={stepperCompleted[index]}
                      sx={{
                        '& .MuiStepLabel-root .MuiStepLabel-labelContainer .MuiStepLabel-label': {
                          mb: 0
                        }
                      }}>
                      <StepButton color="inherit" onClick={handleStep(index)}>
                        {label}
                      </StepButton>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
            </motion.div>
          </Box>
        </Grid>
        <Grid item lg={9} xs={12} sx={{ flex: '1 1 auto' }}>
          {allStepsCompleted() ? (
            <>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleStepperReset}>Reset</Button>
              </Box>
            </>
          ) : (
            <>
              <Collapse in={activeStep === 0} mountOnEnter unmountOnExit>
                <Box>
                  <Typography variant="h4">
                    Artist Info
                  </Typography>
                  <Grid container spacing={3} sx={{ mb: '24px' }}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="filled"
                        id="wallet-address"
                        label="Wallet Address"
                        value={walletAddress}
                        onClick={() => {
                          setAddWalletModalOpen(true)
                        }}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        variant="filled"
                        id="artist-name"
                        label="Artist Name"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        variant="filled"
                        id="artist-website"
                        label="Website"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="filled"
                        id="artist-tagline"
                        label="Tagline"
                        multiline
                        minRows={3}
                      />
                    </Grid>
                  </Grid>



                  <Typography variant="h6">
                    Social Links
                  </Typography>
                  <Grid container spacing={2} sx={{
                    mb: '24px',
                  }}>
                    <Grid item sm={4} xs={12}>
                      <Grid
                        container
                        spacing={1}
                        alignItems="center"
                      >
                        <Grid item xs>
                          <SocialMenu id={'test'} />
                        </Grid>
                        <Grid item xs="auto">
                          <IconButton sx={{ display: upSm ? 'none' : 'flex' }}>
                            <Icon>
                              delete
                            </Icon>
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item sm={8} xs={12}>
                      <Grid
                        container
                        spacing={1}
                        alignItems="center"
                      >
                        <Grid item xs>
                          <TextField
                            fullWidth
                            variant="filled"
                            id="social-network-link"
                            label="Profile Link"
                          />
                        </Grid>
                        <Grid item xs="auto">
                          <IconButton sx={{ display: upSm ? 'flex' : 'none' }}>
                            <Icon>
                              delete
                            </Icon>
                          </IconButton>
                        </Grid>
                      </Grid>


                    </Grid>
                  </Grid>


                  {/* 
                  <ToggleButtonGroup
                    color="primary"
                    value={packToggle}
                    exclusive
                    onChange={handlePackToggle}
                    aria-label="Platform"
                    fullWidth
                  >
                    <ToggleButton value="none">No Packs</ToggleButton>
                    <ToggleButton value="packs">Pack Tokens</ToggleButton>
                  </ToggleButtonGroup> */}
                </Box>
              </Collapse>
              <Collapse in={activeStep === 1} mountOnEnter unmountOnExit>
                <Box>
                  <Typography variant="h4">
                    Collection Details
                  </Typography>
                  <Grid
                    container
                    alignItems="center"
                    sx={{
                      width: '100%',
                      mb: '0px',
                      '&:hover': {
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => handlePackToggle()}
                  >
                    <Grid item xs>
                      <Typography variant="h5" sx={{ verticalAlign: 'middle', mb: 0 }}>
                        Pack tokens
                      </Typography>
                    </Grid>
                    <Grid item xs="auto">
                      <Switch
                        focusVisibleClassName=".Mui-focusVisible"
                        disableRipple
                        checked={packToggle}
                      />
                    </Grid>
                  </Grid>
                  <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
                    If you want to sell or give away tokens that represent "packs" of NFTs, such as for card packs or other bundles, select this box to create them. If you choose not to now, you won't be able to make them later for this collection.
                  </Typography>

                  <Collapse in={packToggle}>


                    <TextField
                      fullWidth
                      variant="filled"
                      id="pack-name"
                      label="Pack Name"
                      // value=""
                      sx={{
                        mb: '12px',
                      }}
                    />


                  </Collapse>
                </Box>
              </Collapse>
              <Collapse in={activeStep === 2} mountOnEnter unmountOnExit>
                <Box>
                  
                  Sale info
                  - send to yourself
                  - sell on marketplace
                  - create sales portal
                </Box>
              </Collapse>
              <Collapse in={activeStep === 3} mountOnEnter unmountOnExit>
                <Box>
                  Token details
                  - upload images
                  - provide metadata (csv)
                  - provide metadata (form-based)
                </Box>
              </Collapse>
              <Box sx={{ pt: 2, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  disabled={activeStep === 0}
                  onClick={handleStepperBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleStepperNext}
                  sx={{ mr: 1 }}
                >
                  Next
                </Button>
                {activeStep !== steps.length &&
                  (stepperCompleted[activeStep] ? (
                    <Typography variant="caption" sx={{ display: 'inline-block' }}>
                      Step {activeStep + 1} already completed
                    </Typography>
                  ) : (
                    <Button onClick={handleStepperComplete}>
                      {completedSteps() === totalSteps() - 1
                        ? 'Finish'
                        : 'Save Step'}
                    </Button>
                  ))}

              </Box>
            </>
          )}
        </Grid>
      </Grid>

    </Container>
  )
}


const SocialMenu: FC<{ id: string; }> = (props) => {
  const [sortOption, setSortOption] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value as string);
  };
  return (
    <FormControl fullWidth variant="filled">
      <InputLabel id={'social-network-name-' + props.id}>Social Network</InputLabel>
      <Select
        labelId="sort-select-box-label"
        id="sort-select-box"
        value={sortOption}
        label="Sort By"
        onChange={handleChange}
      >
        <MenuItem value={"telegram"}>Telegram</MenuItem>
        <MenuItem value={"discord"}>Discord</MenuItem>
        <MenuItem value={"twitter"}>Twitter</MenuItem>
      </Select>
    </FormControl>
  )
}

export default Create