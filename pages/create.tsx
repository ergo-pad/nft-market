import React, { useState, useContext, useEffect } from 'react';
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
import Image from 'next/image'
// import { motion } from 'framer-motion'
import FileUploadArea from '@components/forms/FileUploadArea'
import FileUploadAreaIPFS from '@components/forms/FileUploadAreaIPFS'
import { v4 as uuidv4 } from 'uuid';
import RaritySection from '@components/create/RaritySection'
import PackTokenSection from '@components/create/PackTokenSection';
import SocialSection from '@components/create/SocialSection';
import TraitSection from '@components/create/TraitSection';
import { useCSVReader } from 'react-papaparse';
import ArtistForm, { IArtistData, artistDataInit } from '@components/create/ArtistForm'
import CollectionForm, { ICollectionData, collectionDataInit } from '@components/create/CollectionForm'

interface ITokensData {
  packs?: {
    name: string;
    amount: number;
    nftPerPack: number;
    chances?: {
      rarityName: string;
      chance: number; // higher number is higher chance of receiving this rarity
    }[];
  }[];
  nfts: {
    name: string;
    image: string;
    description: string;
    traits?: {
      key: string; // the name of the trait type (eg: sex, speed, age)
      value: string | number; // the trait that this specific NFT has
      type: 'Property' | 'Level' | 'Stat';
    }[];
    rarity?: string;
    explicit?: boolean; // default is false
  }[];
}

interface ISaleData {
  royalties: {
    address: string;
    percent: number; // 1000 * royalty percentage of this recipient (e.g. 50 if the receipient receives 5% of the sale)
  }[];
  dateStart: Date;
  dateEnd: Date;
  price: {
    tokenId?: string; // if there are multiple packs to sell, this is the token ID of the pack. Don't use for sales without pack tokens
    price: number;
    currency: 'erg' | 'sigusd'; // default to sigusd
  }[];
}

/// FORM INIT ///
const tokensDataInit: ITokensData = {
  packs: [
    {
      name: '',
      amount: 1,
      nftPerPack: 1,
      chances: [
        {
          rarityName: '',
          chance: 1,
        }
      ],
    }
  ],
  nfts: [
    {
      name: '',
      image: '',
      description: '',
      traits: [
        {
          key: '', // the name of the trait type (eg: sex, speed, age)
          value: '', // the trait that this specific NFT has
          type: 'Property',
        }
      ],
      rarity: '',
      explicit: false, // default is false
    }
  ],
}

const saleDataInit: ISaleData = {
  royalties: [
    {
      address: '',
      percent: 1000, // 1000 * royalty percentage of this recipient (e.g. 50 if the receipient receives 5% of the sale)
    },
  ],
  dateStart: new Date(1663353871000), // FIX DEFAULTS
  dateEnd: new Date(1663353871000), // FIX DEFAULTS
  price: [
    {
      tokenId: '', // if there are multiple packs to sell, this is the token ID of the pack. Don't use for sales without pack tokens
      price: 1,
      currency: 'sigusd', // default to sigusd
    },
  ]
}
// END FORM INIT //

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

const fileInitObject: IFileData = {
  currentFile: {} as File,
  previewImage: '',
  progress: 0,
  message: ""
}

export interface ITraitData {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
}

const fileInit = [fileInitObject]

const Create: NextPage = () => {
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const [clearArtistForm, setClearArtistForm] = useState(false)

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
  const saveStep = () => {
    if (activeStep === 0) {
      localStorage.setItem('creation-artist-form', JSON.stringify(artistData))
    }
  }
  const clearSaved = () => {
    const newCompleted = stepperCompleted;
    newCompleted[activeStep] = false;
    setStepperCompleted(newCompleted);
    if (activeStep === 0) {
      setClearArtistForm(true)
      localStorage.removeItem('creation-artist-form')
    }
  }
  const handleStepperComplete = () => {
    saveStep()
    const newCompleted = stepperCompleted;
    newCompleted[activeStep] = true;
    setStepperCompleted(newCompleted);
    handleStepperNext();
  };
  const handleStepperReset = () => {
    setActiveStep(0);
    setStepperCompleted({});
  };

  const [artistData, setArtistData] = useState<IArtistData>(artistDataInit)

  // COLLECTION DATA STATES //
  const [rarityData, setRarityData] = useState([{
    id: uuidv4(),
    name: '',
    description: '',
    imgUrl: ''
  }])
  const [traitData, setTraitData] = useState([{
    id: uuidv4(),
    name: '',
    description: '',
    imgUrl: ''
  }])

  // TOKEN DATA STATES //
  const [packTokenData, setPackTokenData] = useState([{
    id: uuidv4(),
    name: '',
    packAmount: 1,
    nftAmount: 1,
  }])
  const [nftImages, setNftImages] = useState(fileInit)

  // SALE DATA STATES //
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
                  <ArtistForm
                    artistData={artistData}
                    setArtistData={setArtistData}
                    clearForm={clearArtistForm}
                    setClearForm={setClearArtistForm}
                  />
                </Collapse>
                <Collapse in={activeStep === 1}>
                  <CollectionForm
                    rarityData={rarityData}
                    setRarityData={setRarityData}
                    traitData={traitData}
                    setTraitData={setTraitData}
                  />
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
                    <FileUploadAreaIPFS
                      multiple
                      title="NFT Images"
                      fileData={nftImages}
                      setFileData={setNftImages}
                    />
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
                      <>
                        <Typography variant="caption" sx={{ display: 'inline-block' }}>
                          Step {activeStep + 1} already completed
                        </Typography>
                        <Button onClick={clearSaved}>
                          Clear This Step
                        </Button>
                      </>
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