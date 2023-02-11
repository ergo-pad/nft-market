import React, { FC, useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  Link,
  useTheme
} from '@mui/material'
import FileUploadArea from '@components/forms/FileUploadArea'
import { v4 as uuidv4 } from 'uuid';
import RaritySection from '@components/create/RaritySection'
import TraitSection from '@components/create/TraitSection';
import dayjs, { Dayjs } from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export interface IRarityData {
  rarity: string;
  id: string;
  description?: string;
  image?: string;
}

export interface ITraitsData {
  name: string; // the name of the trait type (eg: sex, speed, age)
  id: string;
  description?: string; // used only on our front-end and not required
  image?: string; // this is only used on our front-end and not required. 
  type: 'Property' | 'Level' | 'Stat';
  max?: number; // if trait is a Level or Stat, this is the highest possible value
}

export interface ICollectionData {
  name: string;
  description: string;
  bannerImageUrl: string;
  featuredImageUrl: string;
  collectionLogoUrl: string;
  category: string;
  mintingExpiry: number | -1; //unix timestamp of last date of expiry. If no expiry, must be -1. May not be undefined
  rarities: IRarityData[];
  availableTraits: ITraitsData[];
}

export const collectionDataInit: ICollectionData = {
  name: '',
  description: '',
  bannerImageUrl: '',
  featuredImageUrl: '',
  collectionLogoUrl: '',
  category: '',
  mintingExpiry: -1, //unix timestamp of last date of expiry. If no expiry, must be -1. May not be undefined
  rarities: [
    {
      rarity: '',
      id: uuidv4(),
      description: '',
      // image: '',
    }
  ],
  availableTraits: [
    {
      name: '', // the name of the trait type (eg: sex, speed, age)
      id: uuidv4(),
      description: '', // used only on our front-end and not required
      // image: '', // this is only used on our front-end and not required. 
      type: 'Property',
      // max: 1, // if trait is a Level or Stat, this is the highest possible value
    }
  ],
}

interface ICollectionFormProps {
  collectionData: ICollectionData;
  setCollectionData: React.Dispatch<React.SetStateAction<ICollectionData>>;
  clearForm: boolean;
  setClearForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const CollectionForm: FC<ICollectionFormProps> = ({ collectionData, setCollectionData, clearForm, setClearForm }) => {
  const theme = useTheme()
  const [collectionFeaturedImg, setCollectionFeaturedImg] = useState([''])
  const [collectionBannerImg, setCollectionBannerImg] = useState([''])
  const [collectionLogoImg, setCollectionLogoImg] = useState([''])
  const [clearTriggerCollectionFeatured, setClearTriggerCollectionFeatured] = useState(false)
  const [clearTriggerCollectionBanner, setClearTriggerCollectionBanner] = useState(false)
  const [clearTriggerCollectionLogo, setClearTriggerCollectionLogo] = useState(false)
  const [expiryToggle, setExpiryToggle] = useState(false)
  const toggleExpiry = () => {
    setExpiryToggle(!expiryToggle)
  }

  // COLLECTION DATA STATES //
  const [rarityData, setRarityData] = useState<IRarityData[]>(collectionDataInit.rarities)
  const [traitData, setTraitData] = useState<ITraitsData[]>(collectionDataInit.availableTraits)
  const [mintExpiry, setMintExpiry] = useState<Dayjs | null>(dayjs())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollectionData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  useEffect(() => {
    const rarities = rarityData.map((item) => {
      return item
    })
    setCollectionData(prev => ({ ...prev, rarities: rarities }))
  }, [JSON.stringify(rarityData)])
  useEffect(() => {
    const traits = traitData.map((item) => {
      return item
    })
    setCollectionData(prev => ({ ...prev, availableTraits: traits }))
  }, [JSON.stringify(traitData)])
  useEffect(() => {
    setCollectionData(prev => ({ ...prev, featuredImageUrl: collectionFeaturedImg[0] }))
  }, [JSON.stringify(collectionFeaturedImg)])
  useEffect(() => {
    setCollectionData(prev => ({ ...prev, bannerImageUrl: collectionBannerImg[0] }))
  }, [JSON.stringify(collectionBannerImg)])
  useEffect(() => {
    setCollectionData(prev => ({ ...prev, collectionLogoUrl: collectionLogoImg[0] }))
  }, [JSON.stringify(collectionLogoImg)])
  useEffect(() => {
    if (expiryToggle === false) {
      setCollectionData(prev => ({ ...prev, mintingExpiry: -1 }))
    }
    else if (mintExpiry !== null) setCollectionData(prev => ({ ...prev, mintingExpiry: mintExpiry.valueOf() }))
  }, [expiryToggle, mintExpiry])

  // CLEAR FORM //
  useEffect(() => {
    setClearTriggerCollectionFeatured(true)
    setClearTriggerCollectionBanner(true)
    setClearTriggerCollectionLogo(true)
    // clear rarity data state
    // clear trait data state
    // clear collectionData
    setClearForm(false)
  }, [clearForm])



  return (
    <Box>
      <Typography variant="h4">
        Collection Details
      </Typography>

      <Grid container spacing={2} sx={{ mb: '24px' }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="filled"
            id="collection-name"
            label="Collection Name"
            name="name"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="filled"
            id="collection-category"
            label="Collection Category"
            name="category"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="filled"
            id="collection-description"
            label="Collection Description"
            name="description"
            onChange={handleChange}
            multiline
            minRows={3}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FileUploadArea
            title="Collection Logo Image"
            fileUrls={collectionLogoImg}
            setFileUrls={setCollectionLogoImg}
            expectedImgHeight={256}
            expectedImgWidth={256}
            type="avatar"
            clearTrigger={clearTriggerCollectionLogo}
            setClearTrigger={setClearTriggerCollectionLogo}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FileUploadArea
            title="Collection Featured Image"
            fileUrls={collectionFeaturedImg}
            setFileUrls={setCollectionFeaturedImg}
            // expectedImgHeight={800}
            // expectedImgWidth={500}
            clearTrigger={clearTriggerCollectionFeatured}
            setClearTrigger={setClearTriggerCollectionFeatured}
          />
        </Grid>
        <Grid item xs={12}>
          <FileUploadArea
            title="Collection Banner Image"
            fileUrls={collectionBannerImg}
            setFileUrls={setCollectionBannerImg}
            expectedImgHeight={315}
            expectedImgWidth={851}
            clearTrigger={clearTriggerCollectionBanner}
            setClearTrigger={setClearTriggerCollectionBanner}
          />
        </Grid>
      </Grid>
      <RaritySection data={rarityData} setData={setRarityData} />
      <TraitSection data={traitData} setData={setTraitData} />

      <Grid
        container
        alignItems="center"
        sx={{
          width: '100%',
        }}
      >
        <Grid item xs>
          <Typography variant="h5">
            Final Mint Date
          </Typography>
        </Grid>
        <Grid
          item
          xs="auto"
          onClick={() => toggleExpiry()}
          sx={{
            '&:hover': {
              cursor: 'pointer'
            }
          }}
        >
          <Typography sx={{ verticalAlign: 'middle', mb: 0, mr: '6px', display: 'inline-block' }}>
            Set Expiry Date
          </Typography>
          <Switch
            focusVisibleClassName=".Mui-focusVisible"
            disableRipple
            checked={expiryToggle}
          />
        </Grid>
      </Grid>
      <Typography variant="body2" sx={{ lineHeight: 1.3, mb: '12px', }}>
        Set the last date that new tokens can be minted to this collection. If you want to be able to mint tokens to this collection indefinitely, <Link
          onClick={() => setExpiryToggle(false)}
          sx={{
            '&:hover': { cursor: 'pointer' },
            fontSize: theme.typography.body2.fontSize,
            lineHeight: 1.3,
          }}
        >turn off the "Set Expiry" switch
        </Link>.
      </Typography>
      <Box sx={{ mb: '24px', textAlign: 'center', width: '100%' }}>
        <DateTimePicker
          renderInput={
            (props: any) =>
              <TextField
                // required
                id="mintingExpiry"
                name="mintingExpiry"
                variant="filled"
                {...props}
                InputProps={{ ...props.InputProps, disableUnderline: true }}
              />
          }
          ampm={false}
          disabled={!expiryToggle}
          label="Mint Expiry Date"
          value={mintExpiry}
          onChange={(newValue: any) => setMintExpiry(newValue)}
        />
      </Box>
      <Button onClick={() => console.log(collectionData)}>Console log data</Button>
    </Box>
  );
};

export default CollectionForm;