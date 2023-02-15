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
import PackTokenSection from '@components/create/PackTokenSection';
import { useCSVReader } from 'react-papaparse';
import { IFileUrl } from '@components/forms/FileUploadArea';

export interface IRarityData {
  rarity: string;
  id: string;
  description?: string;
  image?: string;
}

export interface ITraitsData {
  traitName: string; // the name of the trait type (eg: sex, speed, age)
  id: string;
  description?: string; // used only on our front-end and not required
  image?: string; // this is only used on our front-end and not required. 
  type: 'Property' | 'Level' | 'Stat';
  max?: number; // if trait is a Level or Stat, this is the highest possible value
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

export interface ITokenDetailsData {
  packs: IPackData[];
  nfts: {
    nftName: string;
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
  rarities: IRarityData[];
  availableTraits: ITraitsData[];
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

export const tokenDetailsDataInit: ITokenDetailsData = {
  packs: [packTokenDataInit],
  nfts: [
    {
      nftName: '',
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
      traitName: '', // the name of the trait type (eg: sex, speed, age)
      id: uuidv4(),
      description: '', // used only on our front-end and not required
      // image: '', // this is only used on our front-end and not required. 
      type: 'Property',
      // max: 1, // if trait is a Level or Stat, this is the highest possible value
    }
  ],
}

interface ITokenDetailsProps {
  tokenDetailsData: ITokenDetailsData;
  setTokenDetailsData: React.Dispatch<React.SetStateAction<ITokenDetailsData>>;
  clearForm: boolean;
  setClearForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const TokenDetails: FC<ITokenDetailsProps> = ({ tokenDetailsData, setTokenDetailsData, clearForm, setClearForm }) => {
  const theme = useTheme()
  const [rarityData, setRarityData] = useState<IRarityData[]>(tokenDetailsDataInit.rarities)
  const [traitData, setTraitData] = useState<ITraitsData[]>(tokenDetailsDataInit.availableTraits)
  const [clearTriggerNftImages, setClearTriggerNftImages] = useState(false)
  const [packTokenData, setPackTokenData] = useState([packTokenDataInit])
  const [nftImages, setNftImages] = useState<IFileUrl[]>([])
  const { CSVReader } = useCSVReader();
  const [csvUpload, setCsvUpload] = useState({})

  useEffect(() => {
    const rarities = rarityData.map((item) => {
      return item
    })
    setTokenDetailsData(prev => ({ ...prev, rarities: rarities }))
  }, [JSON.stringify(rarityData)])
  useEffect(() => {
    const traits = traitData.map((item) => {
      return item
    })
    setTokenDetailsData(prev => ({ ...prev, availableTraits: traits }))
  }, [JSON.stringify(traitData)])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenDetailsData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  useEffect(() => {

  }, [JSON.stringify(nftImages)])

  // CLEAR FORM //
  useEffect(() => {
    setClearTriggerNftImages(true) // this is a trigger to update child state
    setRarityData(tokenDetailsDataInit.rarities) // this is a local state
    setTraitData(tokenDetailsDataInit.availableTraits) // this is a local state
    setTokenDetailsData(tokenDetailsDataInit) // this belongs to parent
    setClearForm(false)
  }, [clearForm])

  return (
    <Box>
      <Box>
        <Typography variant="h4">
          Token details
        </Typography>
        <RaritySection data={rarityData} setData={setRarityData} />
        <PackTokenSection data={packTokenData} setData={setPackTokenData} rarityData={rarityData} />
        <TraitSection data={traitData} setData={setTraitData} />
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
        <FileUploadArea
          multiple
          ipfsFlag
          title="NFT Images"
          fileUrls={nftImages}
          setFileUrls={setNftImages}
          clearTrigger={clearTriggerNftImages}
          setClearTrigger={setClearTriggerNftImages}
        />
      </Box>
      <Box>
        {nftImages.map((item, i) => {
          return (
            <Grid container spacing={1} sx={{ mb: '16px' }} alignItems="stretch" key={i}>
              <Grid item xs={12} sm={3}>
                {/* */}

              </Grid>
              <Grid item container direction="column" justifyContent="space-between" spacing={1} xs={12} sm={9}>
                {/* <Grid item>
                  <Grid
                    container
                    spacing={1}
                    alignItems="center"
                  >
                    <Grid item xs>
                      <TextField
                        fullWidth
                        variant="filled"
                        id="nft-name"
                        name="nftName"
                        label="Rarity"
                        value={data[i].rarity}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs="auto" sx={{ display: i === 0 ? 'none' : 'flex' }}>
                      <IconButton onClick={() => removeItem(i)}>
                        <Icon>
                          delete
                        </Icon>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sx={{ flexGrow: 1 }}>
                  <TextField
                    fullWidth
                    variant="filled"
                    id="rarity-description"
                    name="description"
                    label="Description"
                    value={data[i].description}
                    onChange={handleChange}
                    multiline
                    minRows={2}
                    sx={{
                      flex: '0 1 100%',
                      height: '100%',
                      '& .MuiInputBase-root': {
                        flex: '0 1 100%',
                      }
                    }}
                  />
                </Grid> */}
              </Grid>
            </Grid>
          )
        })}
      </Box>
      <Button onClick={() => console.log(tokenDetailsData)}>Console log data</Button>
      <Button onClick={() => setClearForm(true)}>Clear Form</Button>
    </Box>
  );
};

export default TokenDetails;