import React, { FC, useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  Link,
  useTheme,
} from "@mui/material";
import FileUploadAreaIpfs from "@components/forms/FileUploadAreaIpfs";
import { IFileUrl } from "@components/forms/FileUploadAreaIpfs";
import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ICollectionData, collectionDataInit } from "@pages/mint";

interface ICollectionFormProps {
  collectionData: ICollectionData;
  setCollectionData: React.Dispatch<React.SetStateAction<ICollectionData>>;
  clearForm: boolean;
  setClearForm: React.Dispatch<React.SetStateAction<boolean>>;
  collectionFormValidation: { name: boolean; }
  setCollectionFormValidation: React.Dispatch<React.SetStateAction<{ name: boolean; }>>;
}

const CollectionForm: FC<ICollectionFormProps> = ({
  collectionData,
  setCollectionData,
  clearForm,
  setClearForm,
  collectionFormValidation,
  setCollectionFormValidation
}) => {
  const theme = useTheme();
  const [collectionFeaturedImg, setCollectionFeaturedImg] = useState<
    IFileUrl[]
  >([]);
  const [collectionBannerImg, setCollectionBannerImg] = useState<IFileUrl[]>(
    []
  );
  const [collectionLogoImg, setCollectionLogoImg] = useState<IFileUrl[]>([]);
  const [clearTriggerCollectionFeatured, setClearTriggerCollectionFeatured] =
    useState(false);
  const [clearTriggerCollectionBanner, setClearTriggerCollectionBanner] =
    useState(false);
  const [clearTriggerCollectionLogo, setClearTriggerCollectionLogo] =
    useState(false);
  const [expiryToggle, setExpiryToggle] = useState(false);
  const toggleExpiry = () => {
    setExpiryToggle(!expiryToggle);
  };

  useEffect(() => {
    if (collectionData) {
      setCollectionLogoImg([{
        url: collectionData.collectionLogoUrl,
        ipfs: collectionData.collectionLogoUrl.replace("https://cloudflare-ipfs.com/ipfs/", "ipfs://")
      }])
      setCollectionBannerImg([{
        url: collectionData.bannerImageUrl,
        ipfs: collectionData.bannerImageUrl.replace("https://cloudflare-ipfs.com/ipfs/", "ipfs://")
      }])
      setCollectionFeaturedImg([{
        url: collectionData.featuredImageUrl,
        ipfs: collectionData.featuredImageUrl.replace("https://cloudflare-ipfs.com/ipfs/", "ipfs://")
      }])
    }
  }, [])

  // COLLECTION DATA STATES //
  const [mintExpiry, setMintExpiry] = useState<Dayjs | null>(dayjs());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'collectionName') setCollectionFormValidation(prevState => { return { ...prevState, name: false } })
    setCollectionData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  useEffect(() => {
    setCollectionData((prev) => ({
      ...prev,
      featuredImageUrl: collectionFeaturedImg[0]?.ipfs,
    }));
  }, [JSON.stringify(collectionFeaturedImg)]);
  useEffect(() => {
    setCollectionData((prev) => ({
      ...prev,
      bannerImageUrl: collectionBannerImg[0]?.ipfs,
    }));
  }, [JSON.stringify(collectionBannerImg)]);
  useEffect(() => {
    setCollectionData((prev) => ({
      ...prev,
      collectionLogoUrl: collectionLogoImg[0]?.ipfs,
    }));
  }, [JSON.stringify(collectionLogoImg)]);
  useEffect(() => {
    if (expiryToggle === false) {
      setCollectionData((prev) => ({ ...prev, mintingExpiry: -1 }));
    } else if (mintExpiry !== null)
      setCollectionData((prev) => ({
        ...prev,
        mintingExpiry: mintExpiry.valueOf(),
      }));
  }, [expiryToggle, mintExpiry]);

  // CLEAR FORM //
  useEffect(() => {
    if (clearForm === true) {
      setClearTriggerCollectionFeatured(true); // this is a trigger to update child state
      setClearTriggerCollectionBanner(true); // this is a trigger to update child state
      setClearTriggerCollectionLogo(true); // this is a trigger to update child state
      setCollectionData(collectionDataInit); // this belongs to parent
      setClearForm(false);
    }
  }, [clearForm]);

  return (
    <Box>
      <Typography variant="h4">Collection Details</Typography>
      <Grid container spacing={2} sx={{ mb: "24px" }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="filled"
            id="collection-name"
            label="Collection Name"
            name="collectionName"
            value={collectionData.collectionName}
            onChange={handleChange}
            error={collectionFormValidation.name}
            helperText={collectionFormValidation.name ? "Choose a unique collection name" : null}
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
          <FileUploadAreaIpfs
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
          <FileUploadAreaIpfs
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
          <FileUploadAreaIpfs
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
          width: "100%",
        }}
      >
        <Grid item xs>
          <Typography variant="h5">Final Mint Date</Typography>
        </Grid>
        <Grid
          item
          xs="auto"
          onClick={() => toggleExpiry()}
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          <Typography
            sx={{
              verticalAlign: "middle",
              mb: 0,
              mr: "6px",
              display: "inline-block",
            }}
          >
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
          <Typography
            variant="body2"
            sx={{ lineHeight: 1.3, mb: { xs: "12px", md: 0 } }}
          >
            The final date new tokens can be minted to this collection. To allow
            minting indefinitely,{" "}
            <Link
              onClick={() => setExpiryToggle(false)}
              sx={{
                "&:hover": { cursor: "pointer" },
                fontSize: theme.typography.body2.fontSize,
                lineHeight: 1.3,
              }}
            >
              turn off the &quot;Set Expiry&quot; switch
            </Link>
            .
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <DateTimePicker
            renderInput={(props: any) => (
              <TextField
                // required
                fullWidth
                id="mintingExpiry"
                name="mintingExpiry"
                variant="filled"
                {...props}
                InputProps={{ ...props.InputProps, disableUnderline: true }}
              />
            )}
            ampm={false}
            disabled={!expiryToggle}
            label="Mint Expiry Date"
            value={mintExpiry}
            onChange={(newValue: any) => setMintExpiry(newValue)}
          />
        </Grid>
      </Grid>
      <Button onClick={() => console.log(collectionData)}>
        Console log data
      </Button>
      <Button onClick={() => setClearForm(true)}>Clear Form</Button>
    </Box>
  );
};

export default CollectionForm;
