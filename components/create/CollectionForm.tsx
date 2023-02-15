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
import { IFileUrl } from '@components/forms/FileUploadArea';

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

interface ICollectionFormProps {
  collectionData: ICollectionData;
  setCollectionData: React.Dispatch<React.SetStateAction<ICollectionData>>;
  clearForm: boolean;
  setClearForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const CollectionForm: FC<ICollectionFormProps> = ({ collectionData, setCollectionData, clearForm, setClearForm }) => {
  const theme = useTheme()
  const [collectionFeaturedImg, setCollectionFeaturedImg] = useState<IFileUrl[]>([])
  const [collectionBannerImg, setCollectionBannerImg] = useState<IFileUrl[]>([])
  const [collectionLogoImg, setCollectionLogoImg] = useState<IFileUrl[]>([])
  const [clearTriggerCollectionFeatured, setClearTriggerCollectionFeatured] = useState(false)
  const [clearTriggerCollectionBanner, setClearTriggerCollectionBanner] = useState(false)
  const [clearTriggerCollectionLogo, setClearTriggerCollectionLogo] = useState(false)
  const [expiryToggle, setExpiryToggle] = useState(false)
  const toggleExpiry = () => {
    setExpiryToggle(!expiryToggle)
  }

  // COLLECTION DATA STATES //
  const [mintExpiry, setMintExpiry] = useState<Dayjs | null>(dayjs())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollectionData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  useEffect(() => {
    setCollectionData(prev => ({ ...prev, featuredImageUrl: collectionFeaturedImg[0]?.url }))
  }, [JSON.stringify(collectionFeaturedImg)])
  useEffect(() => {
    setCollectionData(prev => ({ ...prev, bannerImageUrl: collectionBannerImg[0]?.url }))
  }, [JSON.stringify(collectionBannerImg)])
  useEffect(() => {
    setCollectionData(prev => ({ ...prev, collectionLogoUrl: collectionLogoImg[0]?.url }))
  }, [JSON.stringify(collectionLogoImg)])
  useEffect(() => {
    if (expiryToggle === false) {
      setCollectionData(prev => ({ ...prev, mintingExpiry: -1 }))
    }
    else if (mintExpiry !== null) setCollectionData(prev => ({ ...prev, mintingExpiry: mintExpiry.valueOf() }))
  }, [expiryToggle, mintExpiry])

  // CLEAR FORM //
  useEffect(() => {
    setClearTriggerCollectionFeatured(true) // this is a trigger to update child state
    setClearTriggerCollectionBanner(true) // this is a trigger to update child state
    setClearTriggerCollectionLogo(true) // this is a trigger to update child state
    setCollectionData(collectionDataInit) // this belongs to parent
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
            name="collectionName"
            value={collectionData.collectionName}
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
            value={collectionData.category}
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
            value={collectionData.description}
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
      <Grid container direction="row" alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="body2" sx={{ lineHeight: 1.3, mb: { xs: '12px', md: 0 } }}>
            The final date new tokens can be minted to this collection. To allow minting indefinitely, <Link
              onClick={() => setExpiryToggle(false)}
              sx={{
                '&:hover': { cursor: 'pointer' },
                fontSize: theme.typography.body2.fontSize,
                lineHeight: 1.3,
              }}
            >turn off the &quot;Set Expiry&quot; switch
            </Link>.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <DateTimePicker
            renderInput={
              (props: any) =>
                <TextField
                  // required
                  fullWidth
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
        </Grid>
      </Grid>
      <Button onClick={() => console.log(collectionData)}>Console log data</Button>
      <Button onClick={() => setClearForm(true)}>Clear Form</Button>
    </Box>
  );
};

export default CollectionForm;