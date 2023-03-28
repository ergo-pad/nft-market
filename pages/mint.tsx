import React, { useState, useEffect, useContext } from 'react';
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
} from '@mui/material'
import ArtistForm from '@components/create/ArtistForm'
import CollectionForm from '@components/create/CollectionForm'
import TokenDetailsForm, { ITraitsData, INftData } from '@components/create/TokenDetailsForm'
import SaleInfoForm from '@components/create/SaleInfoForm'
import { v4 as uuidv4 } from 'uuid';
import { WalletContext } from '@contexts/WalletContext';

const steps = [
  'Artist',
  'Collection Details',
  'Token Details',
  'Sale Info'
];

export interface IArtistData {
  address: string;
  name?: string;
  website?: string;
  tagline?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  social?: {
    socialNetwork: string;
    url: string;
  }[];
}

export const artistDataInit: IArtistData = {
  address: '',
  name: '',
  website: '',
  tagline: '',
  avatarUrl: '',
  bannerUrl: '',
  social: []
}

export interface ICollectionData {
  collectionName: string;
  description: string;
  bannerImageUrl: string;
  featuredImageUrl: string;
  collectionLogoUrl: string;
  category: string;
  mintingExpiry: number | -1; //unix timestamp of last date of expiry. If no expiry, must be -1. May not be undefined
}

export const collectionDataInit: ICollectionData = {
  collectionName: '',
  description: '',
  bannerImageUrl: '',
  featuredImageUrl: '',
  collectionLogoUrl: '',
  category: '',
  mintingExpiry: -1, //unix timestamp of last date of expiry. If no expiry, must be -1. May not be undefined
}

export interface IRarityData {
  rarity: string;
  id: string;
  image?: string;
}

export interface IPackData {
  id: string;
  packName: string;
  amountOfPacks: number;
  nftPerPack: {
    id: string;
    count: number | '';
    probabilities?: {
      rarityName: string;
      probability: number;
    }[]
  }[]
  price: number | '';
  currency: string;
}

export interface ISaleInfoData {
  packs: IPackData[];
  dateStart: Date;
  dateEnd: Date;
  hasPacks: boolean;
}

export interface ITokenDetailsData {
  nfts: INftData[]; // contains royalty info
  rarities: IRarityData[];
  availableTraits: ITraitsData[];
}

export const tokenDetailsDataInit: ITokenDetailsData = {
  nfts: [],
  rarities: [
    {
      rarity: '',
      id: uuidv4(),
    }
  ],
  availableTraits: [
    {
      traitName: '', // the name of the trait type (eg: sex, speed, age)
      id: uuidv4(),
      type: 'Property',
      // max: 1, // if trait is a Level or Stat, this is the highest possible value
    }
  ],
}

export const packTokenDataInit: IPackData = {
  id: uuidv4(),
  packName: '',
  amountOfPacks: 1,
  nftPerPack: [
    {
      id: uuidv4(),
      count: 1,
      probabilities: [
        {
          rarityName: '',
          probability: 1
        }
      ]
    }
  ],
  price: '',
  currency: 'SigUSD',
}

export const saleInfoDataInit: ISaleInfoData = {
  packs: [packTokenDataInit],  // If user chooses not to have packs, price for sale will be {packs[0].price}
  dateStart: new Date(new Date().getTime() + (8.64e+7)), 
  dateEnd: new Date(new Date().getTime() + (2.6298e+9)),
  hasPacks: false, // If false, packs[0].price is used for all NFT prices as mentioned above. 
}

const Mint: NextPage = () => {
  const theme = useTheme()
  // const upSm = useMediaQuery(theme.breakpoints.up('sm')) // not currently used
  const [activeStep, setActiveStep] = React.useState(0);
  const {
    walletAddress
  } = useContext(WalletContext);

  // FORM DATA STATES //
  const [artistData, setArtistData] = useState<IArtistData>(artistDataInit)
  const [collectionData, setCollectionData] = useState<ICollectionData>(collectionDataInit)
  const [tokenDetailsData, setTokenDetailsData] = useState<ITokenDetailsData>(tokenDetailsDataInit)
  const [saleInfoData, setSaleInfoData] = useState<ISaleInfoData>(saleInfoDataInit)
  useEffect(() => {
    const localStorageData = [
      localStorage.getItem('creation-artist-form'),
      localStorage.getItem('creation-collection-form'),
      localStorage.getItem('creation-token-details-form'),
      localStorage.getItem('creation-sale-info-form'),
    ]
    if (localStorageData[0] !== null) setArtistData(JSON.parse(localStorageData[0]))
    if (localStorageData[1] !== null) setCollectionData(JSON.parse(localStorageData[1]))
    if (localStorageData[2] !== null) setTokenDetailsData(JSON.parse(localStorageData[2]))
    if (localStorageData[3] !== null) setSaleInfoData(JSON.parse(localStorageData[3]))
  }, [])
  useEffect(() => {
    setArtistData((prev) => (
      {
        ...prev,
        address: walletAddress,
      }
    ))
  }, [walletAddress])

  // CLEAR FORM STATES //
  const [clearArtistForm, setClearArtistForm] = useState(false)
  const [clearCollectionForm, setClearCollectionForm] = useState(false)
  const [clearTokenDetailsForm, setClearTokenDetailsForm] = useState(false)
  const [clearSaleInfoForm, setClearSaleInfoForm] = useState(false)

  // OTHER STATES //
  const [rarityData, setRarityData] = useState<IRarityData[]>(tokenDetailsDataInit.rarities)

  // STEPPER LOGIC //
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
  const handleSaveStep = () => {
    if (activeStep === 0) {
      localStorage.setItem('creation-artist-form', JSON.stringify(artistData))
    }
    if (activeStep === 1) {
      localStorage.setItem('creation-collection-form', JSON.stringify(collectionData))
    }
    if (activeStep === 2) {
      localStorage.setItem('creation-token-details-form', JSON.stringify(tokenDetailsData))
    }
    if (activeStep === 3) {
      localStorage.setItem('creation-sale-info-form', JSON.stringify(saleInfoData))
    }
  }
  const handleClearSavedStep = () => {
    const newCompleted = stepperCompleted;
    newCompleted[activeStep] = false;
    setStepperCompleted(newCompleted);
    if (activeStep === 0) {
      setClearArtistForm(true)
      localStorage.removeItem('creation-artist-form')
    }
    if (activeStep === 1) {
      setClearCollectionForm(true)
      localStorage.removeItem('creation-collection-form')
    }
    if (activeStep === 2) {
      setClearTokenDetailsForm(true)
      localStorage.removeItem('creation-token-details-form')
    }
    if (activeStep === 3) {
      setClearSaleInfoForm(true)
      localStorage.removeItem('creation-sale-info-form')
    }
  }
  const handleStepperComplete = () => {
    handleSaveStep()
    const newCompleted = stepperCompleted;
    newCompleted[activeStep] = true;
    setStepperCompleted(newCompleted);
    handleStepperNext();
  };
  const handleStepperReset = () => {
    setActiveStep(0);
    setStepperCompleted({});
  };
  // END STEPPER LOGIC //

  return (
    <>
      <Container sx={{ my: '50px', mb: { xs: '-12px', md: 0 } }}>
        <Box>
          <Typography variant="h1">
            Mint New Tokens
          </Typography>
          <Typography variant="body2" sx={{ mb: '24px' }}>
            You can mint a single NFT, create your own collections, and even set up your own sales platform through this page.
          </Typography>
        </Box>
      </Container>

      <Box sx={{
        display: { xs: "block", lg: "none" },
        position: 'sticky',
        top: '60px',
        background: theme.palette.background.default,
        p: '12px',
        mb: '12px',
        zIndex: 60,
        borderBottom: `1px solid ${theme.palette.divider}`
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
            <Box sx={{ position: 'relative' }}>
              <Paper
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
                  <Typography variant="h4">
                    Artist Info
                  </Typography>
                  <ArtistForm
                    artistData={artistData}
                    setArtistData={setArtistData}
                    clearForm={clearArtistForm}
                    setClearForm={setClearArtistForm}
                  />
                </Collapse>
                <Collapse in={activeStep === 1}>
                  <CollectionForm
                    collectionData={collectionData}
                    setCollectionData={setCollectionData}
                    clearForm={clearCollectionForm}
                    setClearForm={setClearCollectionForm}
                  />
                </Collapse>
                <Collapse in={activeStep === 2}>
                  <TokenDetailsForm
                    tokenDetailsData={tokenDetailsData}
                    setTokenDetailsData={setTokenDetailsData}
                    clearForm={clearTokenDetailsForm}
                    setClearForm={setClearTokenDetailsForm}
                    rarityData={rarityData}
                    setRarityData={setRarityData}
                  />
                </Collapse>
                <Collapse in={activeStep === 3}>
                  <SaleInfoForm
                    saleInfoData={saleInfoData}
                    setSaleInfoData={setSaleInfoData}
                    clearForm={clearSaleInfoForm}
                    setClearForm={setClearSaleInfoForm}
                    rarityData={rarityData}
                  />
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
                        <Button onClick={handleClearSavedStep}>
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

export default Mint