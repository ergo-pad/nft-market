import React, { FC, useState, useContext, useEffect } from 'react';
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
import { useCSVReader } from 'react-papaparse'
import { ITraitData } from '@pages/create';

export interface ICollectionData {
  name: string;
  description: string;
  bannerImageUrl: string;
  featuredImageUrl: string;
  collectionLogoUrl: string;
  category: string;
  mintingExpiry: number | -1; //unix timestamp of last date of expiry. If no expiry, must be -1. May not be undefined
  rarities?: {
    rarity: string;
    description?: string;
    image?: string;
  }[];
  availableTraits?: {
    name: string; // the name of the trait type (eg: sex, speed, age)
    description?: string; // used only on our front-end and not required
    image?: string; // this is only used on our front-end and not required. 
    type: 'Property' | 'Level' | 'Stat';
    max?: number; // if trait is a Level or Stat, this is the highest possible value
  }[];
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
      description: '',
      image: '',
    }
  ],
  availableTraits: [
    {
      name: '', // the name of the trait type (eg: sex, speed, age)
      description: '', // used only on our front-end and not required
      image: '', // this is only used on our front-end and not required. 
      type: 'Property',
      // max: 1, // if trait is a Level or Stat, this is the highest possible value
    }
  ],
}

interface ICollectionFormProps { 
  rarityData: ITraitData[];
  setRarityData: React.Dispatch<React.SetStateAction<ITraitData[]>>;
  traitData: ITraitData[];
  setTraitData: React.Dispatch<React.SetStateAction<ITraitData[]>>;
}

const CollectionForm: FC<ICollectionFormProps> = ({ rarityData, setRarityData, traitData, setTraitData }) => {
  const [collectionFeaturedImg, setCollectionFeaturedImg] = useState([''])
  const [collectionBannerImg, setCollectionBannerImg] = useState([''])
  const [clearTriggerCollectionFeatured, setClearTriggerCollectionFeatured] = useState(false)
  const [clearTriggerCollectionBanner, setClearTriggerCollectionBanner] = useState(false)

  return (
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
            fileUrls={collectionBannerImg}
            setFileUrls={setCollectionBannerImg}
            expectedImgHeight={320}
            expectedImgWidth={564}
            clearTrigger={clearTriggerCollectionBanner}
            setClearTrigger={setClearTriggerCollectionBanner}
          />
        </Grid>
        <Grid item xs={12}>
          <FileUploadArea
            title="Collection Featured Image"
            fileUrls={collectionFeaturedImg}
            setFileUrls={setCollectionFeaturedImg}
            expectedImgHeight={320}
            expectedImgWidth={564}
            clearTrigger={clearTriggerCollectionFeatured}
            setClearTrigger={setClearTriggerCollectionFeatured}
          />
        </Grid>
      </Grid>
      <RaritySection data={rarityData} setData={setRarityData} />
      <TraitSection data={traitData} setData={setTraitData} />
    </Box>
  );
};

export default CollectionForm;