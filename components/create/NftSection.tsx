import React, { FC, useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  Link,
  Icon,
  IconButton,
  useTheme,
  InputLabel,
  MenuItem,
  FormControl,
  Collapse
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FileUploadArea from '@components/forms/FileUploadArea'
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useCSVReader } from 'react-papaparse';
import { IFileUrl } from '@components/forms/FileUploadArea';
import { IRarityData, ITraitsData, INftData } from '@components/create/TokenDetailsForm';
import NftItem from './NftItem';
import { TransitionGroup } from 'react-transition-group';

interface INftSectionProps {
  rarityData: IRarityData[];
  traitData: ITraitsData[];
  nftData: INftData[];
  setNftData: React.Dispatch<React.SetStateAction<INftData[]>>;
  clearTriggerNftImages: boolean;
  setClearTriggerNftImages: React.Dispatch<React.SetStateAction<boolean>>;
}

const NftSection: FC<INftSectionProps> = ({ rarityData, traitData, nftData, setNftData, clearTriggerNftImages, setClearTriggerNftImages }) => {
  const theme = useTheme()
  const { CSVReader } = useCSVReader();
  const [csvUpload, setCsvUpload] = useState({})
  const [nftImages, setNftImages] = useState<IFileUrl[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    nftImages.map((item) => {
      const filter = nftData.filter((nft) => nft.image === item.ipfs)
      if (filter.length > 0) return
      else {
        const uuid = uuidv4()
        setNftData(prev => [...prev, {
          id: uuid,
          nftName: '',
          image: item.ipfs,
          description: '',
          traits: [
            {
              key: '', // the name of the trait type (eg: sex, speed, age)
              value: '', // the trait that this specific NFT has
              type: 'Property',
              id: uuidv4()
            }
          ],
          rarity: '',
          explicit: false, // default is false
        }])
        setUploadedUrls(prev => ({ ...prev, [uuid]: item.url }))
      }
      return
    })
  }, [nftImages])

  return (
    <Box>
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
      <Button onClick={() => { console.log(nftImages) }}>Console Log nftImage</Button>

      {nftData.map((_item, i) => {
        return (
          <NftItem
            rarityData={rarityData}
            traitData={traitData}
            nftData={nftData}
            setNftData={setNftData}
            nftImageUrls={uploadedUrls}
            setNftImageUrls={setUploadedUrls}
            index={i}
            key={i}
            id={nftData[i].id}
          />
        )
      })}
    </Box>
  );
};

export default NftSection;