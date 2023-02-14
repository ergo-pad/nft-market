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
import { IRarityData } from '@components/create/CollectionForm';
import { IFileUrl } from '@components/forms/FileUploadArea';

export interface ITokenDetailsData {
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

export const tokenDetailsDataInit: ITokenDetailsData = {
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

const packTokenDataInit = {
  id: uuidv4(),
  name: '',
  packAmount: 1,
  nftAmount: 1,
}

interface ITokenDetailsProps {
  tokenDetailsData: ITokenDetailsData;
  setTokenDetailsData: React.Dispatch<React.SetStateAction<ITokenDetailsData>>;
  clearForm: boolean;
  setClearForm: React.Dispatch<React.SetStateAction<boolean>>;
  rarityData: IRarityData[];
}

const TokenDetails: FC<ITokenDetailsProps> = ({ tokenDetailsData, setTokenDetailsData, clearForm, setClearForm, rarityData }) => {
  const theme = useTheme()
  const [clearTriggerNftImages, setClearTriggerNftImages] = useState(false)
  const [packTokenData, setPackTokenData] = useState([packTokenDataInit])
  const [nftImages, setNftImages] = useState<IFileUrl[]>([])
  const { CSVReader } = useCSVReader();
  const [csvUpload, setCsvUpload] = useState({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenDetailsData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  useEffect(() => {
    
  }, [JSON.stringify(nftImages)])

  // CLEAR FORM //
  useEffect(() => {
    setClearTriggerNftImages(true) // this is a trigger to update child state
    setTokenDetailsData(tokenDetailsDataInit) // this belongs to parent
    setClearForm(false)
  }, [clearForm])

  return (
    <Box>
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
      <Button onClick={() => console.log(tokenDetailsData)}>Console log data</Button>
      <Button onClick={() => setClearForm(true)}>Clear Form</Button>
    </Box>
  );
};

export default TokenDetails;