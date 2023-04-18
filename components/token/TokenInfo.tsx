import React, { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material'
import Link from '@components/Link'
import { getAssetInfo, resolveIpfs } from '@utils/assetsNew';
import HideImageIcon from '@mui/icons-material/HideImage';
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import axios from 'axios';

const textSx = {
  mb: 0,
  fontSize: '16px',
  lineHeight: 1.25
}

const boldTextSx = {
  mb: 0,
  fontSize: '16px',
  lineHeight: 1.25,
  fontWeight: 700
}

interface JsonObject {
  [key: string]: any;
}

interface ICollection {
  name: string;
  link: string;
}

interface IArtist {
  name: string;
  link: string;
}

interface ITrait {
  name: string;
  value: any;
}

const flattenJSON = (jsonData: JsonObject): JsonObject => {
  const _flattenJSON = (obj: JsonObject = {}, res: JsonObject = {}): JsonObject => {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] !== 'object') {
        res[key] = obj[key];
      } else {
        _flattenJSON(obj[key], res);
      }
    });
    return res;
  };
  return _flattenJSON(jsonData);
};

const parseDescription = (description: string) => {
  try {
    return flattenJSON(JSON.parse(description));
  } catch (e) {
    try {
      // parse error some descriptions have unicode escape characters as the first character
      return flattenJSON(JSON.parse(description.slice(1)));
    } catch (e) {
      // description is a string
      return { description: description ? description : '' };
    }
  }
};

const TokenInfo: FC<{
  tokenId: string;
}> = (props) => {
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))

  const [loading, setLoading] = useState(true)
  const [tokenDetails, setTokenDetails] = useState<any>({})
  const [collection, setCollection] = useState<ICollection | undefined>(undefined)
  const [artist, setArtist] = useState<IArtist | undefined>(undefined)
  const [v2MetaData, setV2MetaData] = useState<JsonObject | undefined>(undefined)
  const [explicit, setExplicit] = useState(false)

  const fetchData = async (id: string) => {
    setLoading(true)
    const fetchedInfo = await getAssetInfo(id);
    const data = fetchedInfo.data
    console.log(data)
    const metaData = parseDescription(data.description)
    console.log(metaData)
    const filteredMetaData: any = {};
    for (let key in metaData) {
      if (key.toLowerCase() !== 'description') {
        filteredMetaData[key] = metaData[key];
      }
    }
    setTokenDetails({
      tokenId: props.tokenId,
      name: data.name,
      imgUrl: data.extraMetaData.link && resolveIpfs(data.extraMetaData.link),
      metaData: filteredMetaData,
      type: data.nftType,
      description: metaData.description ? metaData.description : metaData.Description
    })
    if (data.extraMetaData.standard === 2) {
      setCollection({
        name: data.extraMetaData.standard2Data?.collection?.name,
        link: '/collections/' + data.extraMetaData.standard2Data?.collection?.name,
      })
      const traits = data.extraMetaData.standard2Data.traits
      const flatTraits: Record<string, any> = Object.keys(traits).reduce((acc: Record<string, any>, curr: string) => {
        if (Array.isArray(traits[curr])) {
          (traits[curr] as ITrait[]).forEach((item: ITrait) => {
            if (item.name) {
              acc[item.name] = item.value;
            }
          });
        }
        return acc;
      }, {});
      const explicitValue = data.extraMetaData.standard2Data.additionalInfo.find((item: any) => item.key === "explicit");
      if (explicitValue) {
        const value = explicitValue.value;
        if (value === "\x01") setExplicit(true)
      } 
      console.log(flatTraits)
      setV2MetaData({
        ...flatTraits
      })
    }
    setLoading(false)
  }

  const fetchArtist = async (tokenId: string) => {
    if (tokenId) {
      let artist = null
      const cache = localStorage.getItem(`token-artist-${tokenId}`)
      if (cache) {
        artist = cache
      }
      else {
        const apiCall = await axios
          .get(process.env.ERGOPAD_API + `/asset/info/${tokenId}/minter`)
          .catch((err) => {
            console.log("ERROR FETCHING: ", err);
          });

        if (apiCall?.data) {
          artist = apiCall.data.minterAddress
          localStorage.setItem(`token-artist-${tokenId}`, artist)
        }
      }
      if (artist === null || artist === 'null') {
        setArtist(undefined);
      }
      else if (typeof artist === 'string') setArtist({
        name: artist,
        link: '/users/' + artist
      });
    }
  }

  // CHANGE THIS
  // check token info once the API knows if this is a sale or not
  // because the sale may be providing pack token images
  useEffect(() => {
    if (props.tokenId.length === 64) {
      fetchData(props.tokenId)
      fetchArtist(props.tokenId)
    }
    else setLoading(false)
  }, [props.tokenId])

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        columnSpacing={5}
        sx={{ mb: '24px' }}
      >
        <Grid
          item
          md={6}
          xs={12}
        >
          <Box
            sx={{
              position: 'relative',
              mb: '24px',
              width: '100%',
              transform: 'height 0.2s linear',
            }}
          >
            {loading ?
              <Box
                sx={{
                  width: '100%',
                  pb: '100%',
                }}
              >
                <Skeleton
                  variant="rectangular"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    width: '100%',
                    borderRadius: '8px',
                  }}
                />
              </Box>
              :
              <>
                {tokenDetails.imgUrl ?
                  <img
                    src={tokenDetails.imgUrl}
                    height='100%'
                    width='100%'
                    style={{
                      borderRadius: '8px',
                    }}
                    alt="cube"
                  />
                  :
                  <Box
                    sx={{
                      width: '100%',
                      pb: '100%',
                      background: theme.palette.background.paper,
                      borderRadius: '8px'
                    }}
                  >
                    {tokenDetails.type === 'AUDIO' ? (
                      <AudiotrackIcon
                        sx={{
                          position: 'absolute',
                          color: theme.palette.divider,
                          fontSize: '12rem',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    ) : (
                      <HideImageIcon
                        sx={{
                          position: 'absolute',
                          color: theme.palette.divider,
                          fontSize: '12rem',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    )}
                  </Box>
                }
              </>
            }
          </Box>

        </Grid>
        <Grid item md={6} xs={12}
          sx={{
            pr: { xs: 0, md: '24px' },
          }}
        >
          <Typography variant="h3" sx={{ mb: 1 }}>
            {tokenDetails.name}
          </Typography>
          <Typography variant="body2">
            {tokenDetails.description}
          </Typography>

          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ pb: '8px!important' }}>
              {collection && <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Grid item>
                  <Typography sx={boldTextSx}>
                    Collection:
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography color="text.secondary" sx={textSx}>
                    <Link href={collection.link}>
                      {collection.name}
                    </Link>
                  </Typography>
                </Grid>
              </Grid>}
              {artist && <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Grid item>
                  <Typography sx={boldTextSx}>
                    Artist:
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography color="text.secondary" sx={textSx}>
                    <Link href={artist.link}>
                      {artist.name}
                    </Link>
                  </Typography>
                </Grid>
              </Grid>}
              {tokenDetails.type && (
                <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                  <Grid item>
                    <Typography sx={boldTextSx}>
                      Token Type:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="text.secondary" sx={textSx}>
                      {tokenDetails.type}
                    </Typography>
                  </Grid>
                </Grid>
              )}
              {explicit && (
                <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                  <Grid item>
                    <Typography sx={boldTextSx}>
                      Explicit:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="text.secondary" sx={textSx}>
                      TRUE
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>

          {v2MetaData !== undefined && Object.keys(v2MetaData).length !== 0 && (
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ pb: '8px!important' }}>
                <Typography variant="h5">
                  V2 Metadata
                </Typography>
                {Object.keys(v2MetaData)
                  .filter((key) => !key.match(/^[0-9]+$/))
                  .map((key, i) => (
                    <Grid container justifyContent="space-between" key={i} sx={{ mb: 1 }}>
                      <Grid item>
                        <Typography sx={boldTextSx}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography color="text.secondary" sx={textSx}>
                          {v2MetaData[key]}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))
                }
              </CardContent>
            </Card>
          )}

          {tokenDetails.metaData !== undefined && Object.keys(tokenDetails.metaData).length !== 0 && (
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ pb: '8px!important' }}>
                <Typography variant="h5">
                  Token Metadata
                </Typography>
                {Object.keys(tokenDetails.metaData)
                  .filter((key) => !key.match(/^[0-9]+$/))
                  .map((key, i) => (
                    <Grid container justifyContent="space-between" key={i} sx={{ mb: 1 }}>
                      <Grid item>
                        <Typography sx={boldTextSx}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography color="text.secondary" sx={textSx}>
                          {tokenDetails.metaData[key]}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))
                }
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid >
    </>
  )
};

export default TokenInfo;