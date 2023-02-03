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
  Switch
} from '@mui/material'
import Link from '@components/Link'
import ButtonLink from '@components/ButtonLink'
import Image from 'next/image';
// import { motion } from 'framer-motion'
import { WalletContext } from '@contexts/WalletContext'
import FileUploadArea from '@components/forms/FileUploadArea'
import { v4 as uuidv4 } from 'uuid';
import RaritySection from '@components/create/RaritySection'
import PackTokenSection from '@components/create/PackTokenSection';
import SocialSection from '@components/create/SocialSection';
import TraitSection from '@components/create/TraitSection';
import { useCSVReader } from 'react-papaparse';

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
  'Token Details',
  'Sale Info'
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
  const [traitData, setTraitData] = useState([{
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

  const [createSale, setCreateSale] = useState(true)
  const toggleCreateSale = () => {
    setCreateSale(!createSale)
  }

  const { CSVReader } = useCSVReader();
  const [csvUpload, setCsvUpload] = useState({})

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
                <Collapse in={activeStep === 0}>
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
                <Collapse in={activeStep === 1}>
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
                    <TraitSection data={traitData} setData={setTraitData} />
                  </Box>
                </Collapse>
                <Collapse in={activeStep === 2}>
                  <Box>
                    <Typography variant="h4">
                      Token details
                    </Typography>
                    <PackTokenSection data={packTokenData} setData={setPackTokenData} rarityData={rarityData} />
                    <Typography variant="h5">
                      Provide CSV for Metadata
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
                      You can upload a CSV file to automatically set metadata for the NFTs you will upload. Download a sample CSV below which will include headings for the traits you set previously.
                    </Typography>

                    <Box
                      sx={{
                        mb: '24px'
                      }}
                    >
                      <CSVReader
                        onUploadAccepted={(results: any) => {
                          setCsvUpload(results);
                        }}
                      >
                        {({
                          getRootProps,
                          acceptedFile,
                          ProgressBar,
                          getRemoveFileProps,
                        }: any) => (
                          <>
                            <Grid container sx={{ flexWrap: 'nowrap', height: '56px' }}>
                              <Grid item sx={{ flexGrow: '0' }}>
                                <Button
                                  variant="contained"
                                  disableElevation
                                  {...getRootProps()}
                                  sx={{
                                    borderRadius: '6px 0 0 6px',
                                    background: theme.palette.divider,
                                    color: theme.palette.text.secondary,
                                    display: 'inline-block',
                                    height: '100%'
                                  }}
                                >
                                  Browse file
                                </Button>
                              </Grid>
                              <Grid item sx={{ flexGrow: '1' }}>
                                <Box
                                  type="button"
                                  {...getRootProps()}
                                  sx={{
                                    display: 'inline-block',
                                    background: theme.palette.mode == 'dark' ? '#242932' : theme.palette.background.paper,
                                    height: '100%',
                                    width: '100%',
                                    p: '12px',
                                    verticalAlign: 'middle',
                                    '&:hover': {
                                      background: theme.palette.divider,
                                      cursor: 'pointer'
                                    }
                                  }}
                                >
                                  {acceptedFile && acceptedFile.name}
                                </Box>
                              </Grid>
                              <Grid item sx={{ flexGrow: '0' }}>
                                <Button
                                  variant="contained"
                                  disableElevation
                                  sx={{
                                    borderRadius: '0 6px 6px 0',
                                    background: theme.palette.divider,
                                    color: theme.palette.text.secondary,
                                    display: 'inline-block',
                                    height: '100%'
                                  }}
                                  {...getRemoveFileProps()}>
                                  Remove
                                </Button>
                              </Grid>
                            </Grid>

                            <ProgressBar style={{ backgroundColor: theme.palette.primary.main, }} />
                          </>
                        )}
                      </CSVReader>

                      <Button onClick={() => console.dir(csvUpload)}>
                      Console log upload results
                    </Button>
                    </Box>
                    

                    <Typography variant="h5">
                      Upload Images
                    </Typography>
                    {/* <FileUploadArea
                        multiple
                        /> */}
                  </Box>
                </Collapse>
                <Collapse in={activeStep === 3}>
                  <Box>
                    <Typography variant="h4">
                      Sale info
                    </Typography>
                    <Typography variant="body2">
                      If you choose not to setup a sale, the NFTs will be sent to the artist address as they're minted.
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
                      onClick={() => toggleCreateSale()}
                    >
                      <Grid item xs>
                        <Typography variant="h5" sx={{ verticalAlign: 'middle' }}>
                          Create Sales Portal
                        </Typography>
                      </Grid>
                      <Grid item xs="auto">
                        <Typography
                          sx={{
                            display: 'inline-block',
                            mr: '6px',
                            verticalAlign: 'middle',
                            color: createSale ? theme.palette.text.primary : theme.palette.text.secondary
                          }}
                        >
                          Enable
                        </Typography>
                        <Switch
                          focusVisibleClassName=".Mui-focusVisible"
                          disableRipple
                          checked={createSale}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Collapse in={createSale}>
                    <Grid container spacing={2} sx={{ mb: '24px' }}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          variant="filled"
                          id="date-start"
                          label="Date Start"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          variant="filled"
                          id="date-end"
                          label="Date End"
                        />
                      </Grid>
                    </Grid>
                  </Collapse>
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