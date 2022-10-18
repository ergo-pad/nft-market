import React, { useState, useContext } from 'react';
import type { NextPage } from 'next'
import {
  Grid,
  Container,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Collapse,
  Button,
  Paper,
  Stepper,
  Step,
  StepButton,
  TextField,
} from '@mui/material'
import Link from '@components/Link'
import ButtonLink from '@components/ButtonLink'
import Image from 'next/image';
// import { motion } from 'framer-motion'
import { WalletContext } from '@contexts/WalletContext'
import FileUploadArea from '@components/forms/FileUploadArea'
import InputSlider from '@components/forms/InputSlider'
import { TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import SocialItem from '@components/create/SocialItem'
import RaritySection from '@components/create/RaritySection'
import PackTokenSection from '@components/create/PackTokenSection';
import SocialSection from '@components/create/SocialSection';

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

interface IFileData {
  currentFile: File;
  previewImage: string;
  progress: number;
  message: string;
}

const fileInitObject = {
  currentFile: {} as File,
  previewImage: '',
  progress: 0,
  message: ""
}

const fileInit = [fileInitObject]

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

  const [artistAvatarImg, setArtistAvatarImg] = useState(fileInit)
  const [artistBannerImg, setArtistBannerImg] = useState(fileInit)
  const [collectionFeaturedImg, setCollectionFeaturedImg] = useState(fileInit)
  const [collectionBannerImg, setCollectionBannerImg] = useState(fileInit)
  const [artistSocials, setArtistSocials] = useState([{
    id: uuidv4(),
    network: '',
    url: '',
  }])
  const [rarityData, setRarityData] = useState([{
    id: uuidv4(),
    name: '',
    description: '',
    img: fileInitObject
  }])
  const [packTokenData, setPackTokenData] = useState([{
    id: uuidv4(),
    name: '',
    packAmount: 1,
    nftAmount: 1,
  }])

  return (
    <>
      <Container sx={{ my: '50px', mb: { xs: '-12px', md: 0 } }}>
        <Box>
          <Typography variant="h1">
            Create New Tokens
          </Typography>
          <Typography variant="body2" sx={{ mb: '24px' }}>
            You can mint a single NFT, create your own collections, and even set up your own sales platform through this page.
          </Typography>
        </Box>
      </Container>

      <Box sx={{
        display: { xs: "block", lg: "none" },
        position: 'sticky',
        top: 61,
        background: theme.palette.background.default,
        p: '12px',
        mb: '12px',
        zIndex: 60,
        // borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        {/* STEPPER MOBILE */}
        <Stepper nonLinear activeStep={activeStep}>
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
      <Container sx={{ mb: '50px' }}>
        <Grid container>
          <Grid
            item
            lg={3}
            sx={{ pr: "24px", display: { xs: "none", lg: "flex" } }}
          >
            <Box sx={{
              position: 'relative',
              //height: 'calc(100% + 100px)' 
            }}
            // ref={userProfileContainer}
            >
              {/* <motion.div
                animate={{
                  y: scrollY
                }}
                transition={{ type: "spring", bounce: 0.1  }}
              > */}
              <Paper
                // ref={userProfileCard}
                elevation={0}
                sx={{
                  position: 'sticky',
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
              {/* </motion.div> */}
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
                    <Grid container spacing={2} sx={{ mb: '24px' }}>
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
                      <Grid item xs={12}>
                        <FileUploadArea
                          title="Artist Profile Image"
                          fileData={artistAvatarImg}
                          setFileData={setArtistAvatarImg}
                          expectedImgHeight={120}
                          expectedImgWidth={120}
                          type="avatar"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FileUploadArea
                          title="Artist Banner"
                          fileData={artistBannerImg}
                          setFileData={setArtistBannerImg}
                          expectedImgHeight={260}
                          expectedImgWidth={3840}
                        />
                      </Grid>
                    </Grid>
                    <SocialSection data={artistSocials} setData={setArtistSocials} />
                  </Box>
                </Collapse>
                <Collapse in={activeStep === 1} mountOnEnter unmountOnExit>
                  <Box>
                    <Typography variant="h4">
                      Collection Details
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: '24px' }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          variant="filled"
                          id="collection-name"
                          label="Collection Name"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          variant="filled"
                          id="collection-description"
                          label="Collection Description"
                          multiline
                          minRows={3}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FileUploadArea
                          title="Collection Banner Image"
                          fileData={collectionBannerImg}
                          setFileData={setCollectionBannerImg}
                          expectedImgHeight={320}
                          expectedImgWidth={564}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FileUploadArea
                          title="Collection Featured Image"
                          fileData={collectionFeaturedImg}
                          setFileData={setCollectionFeaturedImg}
                          expectedImgHeight={320}
                          expectedImgWidth={564}
                        />
                      </Grid>
                    </Grid>

                    <RaritySection data={rarityData} setData={setRarityData} />

                    <PackTokenSection data={packTokenData} setData={setPackTokenData} rarityData={rarityData} />

                    <Typography variant="h5">
                      Additional Traits
                    </Typography>
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
    </>
  )
}

export default Create