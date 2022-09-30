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
} from '@mui/material'
import Link from '@components/Link'
import ButtonLink from '@components/ButtonLink'
import Image from 'next/image';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { UserContext } from '@contexts/UserContext'
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterOptions from "@components/FilterOptions";
import { SxProps } from "@mui/material";
import NftCard from '@components/NftCard';
import { recentNfts } from '@components/placeholders/recentNfts'
import SearchBar from '@components/SearchBar'
import SortBy from '@components/SortBy'
import { motion } from 'framer-motion'
import NextLink from 'next/link'
import { WalletContext } from '@contexts/WalletContext'

interface IFormData {
  address: string;

}

const steps = [
  'Initiate',
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
                    <Step key={label} completed={stepperCompleted[index]}>
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
                  <FormControl fullWidth variant="filled">
                    <InputLabel htmlFor="component-filled">Wallet</InputLabel>
                    <FilledInput
                      id="search"
                    // endAdornment={
                    //   <InputAdornment position="start">
                    //     <SearchIcon />
                    //   </InputAdornment>
                    // }
                    />
                  </FormControl>
                  
                  <Box>
                    Sell packs or just NFTs
                  </Box>
                </Box>
              </Collapse>
              <Collapse in={activeStep === 1} mountOnEnter unmountOnExit>
                <Box>
                  Collection? (more than one)
                  - collection info
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

export default Create