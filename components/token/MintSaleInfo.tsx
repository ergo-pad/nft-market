import React, { FC, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Paper,
  List,
  ListItem,
  Collapse,
  Skeleton
} from '@mui/material'
import Link from '@components/Link'
import DirectSalesCard from '@components/token/DirectSalesCard';
import dayjs from 'dayjs';
import PackTokenSelector from '@components/token/PackTokenSelector';
import { formatNumber } from '@utils/general';
import { getTokenData, IToken } from '@utils/assets';
import HideImageIcon from '@mui/icons-material/HideImage';
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import { ApiContext, IApiContext } from "@contexts/ApiContext";

interface ISale {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  sellerWallet: string;
  saleWallet: string;
  packs: IPack[];
  collection?: ICollection;
  artist?: IArtist;
}

interface IPack {
  id: string;
  name: string;
  image: string;
  price: IPrice[];
  content: IContent[];
}

interface IPrice {
  id: string;
  tokenId: string;
  amount: number;
  packId: string;
}

interface IContent {
  id: string;
  rarity: IRarity[];
  amount: number;
  packId: string;
}

interface IRarity {
  odds: number;
  rarity: string;
}

interface ICollection {
  id: string;
  artistId: string;
  name: string;
  tokenId: string | null;
  description: string;
  bannerImageUrl: string;
  featuredImageUrl: string;
  collectionLogoUrl: string;
  category: string;
  mintingExpiry: number;
  rarities: {
    image: string;
    rarity: string;
    description: string;
  }[];
  availableTraits: {
    max?: number;
    tpe: string;
    name: string;
    image: string;
    description: string;
  }[];
  saleId: string;
  status: string;
  mintingTxId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface IArtist {
  id: string;
  address: string;
  name: string;
  website: string;
  tagline: string;
  avatarUrl: string;
  bannerUrl: string;
  social: {
    url: string;
    socialNetwork: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ICollectionData {

}

// Packs or no packs? 
//    a) If packs, are there more than one pack type? 
//        i) Just one type: show collection featured image and display "Open right away"
//        ii) More than one type: pack list with info in place of featured image
//    b) No packs, but its a mint: 
//        - Display collection featured image, 
//        - No "Open right away" displayed
//    c) No packs, its an NFT: display NFT image as featured image. Give token properties as well

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
      return { Description: description ? description : '' };
    }
  }
};

const MintSaleInfo: FC<{
  saleId: string;
}> = (props) => {
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const [selected, setSelected] = useState<boolean[]>([])
  const [salesProps, setSalesProps] = useState({
    tokenName: '',
    openNow: false,
    price: 0,
    currency: 'Erg',
  })
  const [featuredImage, setFeaturedImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [apiGetSaleById, setApiGetSaleById] = useState<ISale>({
    id: "",
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    sellerWallet: "",
    saleWallet: "",
    packs: [{
      id: "",
      name: "",
      image: "",
      price: [
        {
          id: "",
          tokenId: "",
          amount: 1,
          packId: ""
        }
      ],
      content: [
        {
          id: "",
          rarity: [
            {
              odds: 100,
              rarity: ""
            }
          ],
          amount: 1,
          packId: ""
        }
      ]
    }]
  })
  const apiContext = useContext<IApiContext>(ApiContext);

  useEffect(() => {
    const fetchData = async () => {
      const currentSale: any = await apiContext.api.get(`/sale/${props.saleId}`)
      setApiGetSaleById(currentSale.data)
      setLoading(false)
    }
    fetchData();
  }, [props.saleId])

  useEffect(() => {
    if (apiGetSaleById !== undefined && apiGetSaleById.packs.length > 3) {
      setSelected(apiGetSaleById.packs.map((_item, i) => i === 0 ? true : false))
      setSalesProps({
        tokenName: apiGetSaleById.packs[0].name,
        openNow: true,
        price: Number((apiGetSaleById.packs[0].price[0].amount * 0.000000001).toFixed(3)),
        currency: apiGetSaleById.packs[0].price[0].tokenId === '0000000000000000000000000000000000000000000000000000000000000000' ? 'Erg' : 'SigUSD',
      })
      setFeaturedImage(apiGetSaleById.packs[0].image)
    }
    else if (apiGetSaleById !== undefined && apiGetSaleById.packs.length === 1 && apiGetSaleById.packs[0].image !== '') {
      setSalesProps({
        tokenName: apiGetSaleById.packs[0].name,
        openNow: true,
        price: Number((apiGetSaleById.packs[0].price[0].amount * 0.000000001).toFixed(3)),
        currency: apiGetSaleById.packs[0].price[0].tokenId === '0000000000000000000000000000000000000000000000000000000000000000' ? 'Erg' : 'SigUSD',
      })
      setFeaturedImage(apiGetSaleById.packs[0].image)
    }
    else {
      setSalesProps({
        tokenName: apiGetSaleById.packs[0].name,
        openNow: false,
        price: Number((apiGetSaleById.packs[0].price[0].amount * 0.000000001).toFixed(3)),
        currency: apiGetSaleById.packs[0].price[0].tokenId === '0000000000000000000000000000000000000000000000000000000000000000' ? 'Erg' : 'SigUSD',
      })
    }
  }, [apiGetSaleById])

  useEffect(() => {
    selected.map((item, i) => {
      if (item) {
        setSalesProps({
          tokenName: apiGetSaleById.packs[i].name,
          openNow: true,
          price: Number((apiGetSaleById.packs[i].price[0].amount * 0.000000001).toFixed(3)),
          currency: apiGetSaleById.packs[i].price[0].tokenId === '0000000000000000000000000000000000000000000000000000000000000000' ? 'Erg' : 'NaN',
        })
        setFeaturedImage(apiGetSaleById.packs[i].image)
      }
      return item
    })

  }, [selected.toString()])

  const [tokenDetails, setTokenDetails] = useState<any>({
    name: '',
    token: '',
    id: ''
  })

  const fetchData = async (id: string) => {
    setLoading(true)
    const fetchedInfo = await getTokenData(id);
    const formattedInfo = {
      ...fetchedInfo,
      r5: fetchedInfo.r5 ? parseDescription(fetchedInfo.r5) : {}
    }
    setTokenDetails(formattedInfo)
    setLoading(false)
    console.log(formattedInfo)
  }

  // CHANGE THIS
  // check token info once the API knows if this is a sale or not
  // because the sale may be providing pack token images
  // useEffect(() => {
  //   if (props.tokenId.length === 64) fetchData(props.tokenId)
  //   else setLoading(false)
  // }, [props.tokenId])

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
                {featuredImage ? (
                  <>
                    <img
                      src={featuredImage}
                      height='100%'
                      width='100%'
                      style={{
                        borderRadius: '8px',
                      }}
                      alt="cube"
                    />
                  </>
                ) : tokenDetails.r9 && tokenDetails.type === 'Image NFT' ?
                  <img
                    src={tokenDetails.r9}
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
                    {tokenDetails.type === 'Audio NFT' ? (
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
            {apiGetSaleById.name}
          </Typography>
          <Typography variant="body2">
            {apiGetSaleById.description}
          </Typography>

          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ pb: '8px!important' }}>
              {apiGetSaleById.collection && (
                <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                  <Grid item>
                    <Typography sx={boldTextSx}>
                      Collection:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="text.secondary" sx={textSx}>
                      <Link href={'/collections/' + apiGetSaleById.collection.id}>
                        {apiGetSaleById.collection.name}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              )}
              {apiGetSaleById.artist && (
                <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                  <Grid item>
                    <Typography sx={boldTextSx}>
                      Artist:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="text.secondary" sx={textSx}>
                      <Link href={'/users/' + apiGetSaleById.artist.address}>
                        {apiGetSaleById.artist.address}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              )}
              {apiGetSaleById.endTime && (
                <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                  <Grid item>
                    <Typography sx={boldTextSx}>
                      Sale End:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="text.secondary" sx={textSx}>
                      {dayjs(apiGetSaleById?.endTime).toString()}
                    </Typography>
                  </Grid>
                </Grid>
              )}
              {tokenDetails.name && (
                <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                  <Grid item>
                    <Typography sx={boldTextSx}>
                      Token Name:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="text.secondary" sx={textSx}>
                      {tokenDetails.name}
                    </Typography>
                  </Grid>
                </Grid>
              )}
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
            </CardContent>
          </Card>

          {tokenDetails.r5 && (
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ pb: '8px!important' }}>
                <Typography variant="h5">
                  Token Metadata
                </Typography>
                {Object.keys(tokenDetails.r5)
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
                          {tokenDetails.r5[key]}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))
                }
              </CardContent>
            </Card>
          )}

          {apiGetSaleById !== undefined && apiGetSaleById.packs.length > 3 && (
            <>
              <Paper sx={{ mb: 2, p: 2 }}>
                <Typography variant="h5">
                  Choose a pack
                </Typography>
                {apiGetSaleById.packs.filter((_item, i) => i % 3 === 0).map((item, i) => {
                  const packIndex = i * 3
                  return (
                    <PackTokenSelector
                      key={packIndex}
                      index={packIndex}
                      packInfo={apiGetSaleById.packs[packIndex]}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  )
                })}
              </Paper>
              <Paper sx={{ mb: 2, p: 2, }}>
                <Typography variant="h5">
                  Pack Contents
                </Typography>
                <List dense sx={{ transition: 'height 0.2s ease-out', height: '100%' }}>
                  {apiGetSaleById.packs.filter((_item, i) => i % 3 === 0).map((pack, index) => {
                    const i = index * 3
                    return (
                      <Collapse key={i} in={selected[i]}>
                        {pack.content.map((content, i) => {
                          const totalOdds = content.rarity.reduce(function (tot, arr) {
                            return tot + arr.odds;
                          }, 0);
                          return (
                            <React.Fragment key={i}>
                              {content.rarity.length === 1 ? (
                                <ListItem>
                                  <Typography>
                                    {content.amount} Randomly Selected {plural('Token', content.amount)}
                                  </Typography>
                                </ListItem>
                              ) : (
                                <>
                                  <ListItem>
                                    <Typography>
                                      {content.amount} {plural('Token', content.amount)} with Custom Probability
                                    </Typography>
                                  </ListItem>
                                  {content.rarity.map((item, i) => {
                                    return (
                                      <ListItem key={i} sx={{ pl: 4 }}>
                                        {item.odds / totalOdds * 100}% Chance of {item.rarity}
                                      </ListItem>
                                    )
                                  })}
                                </>
                              )
                              }
                            </React.Fragment>
                          )
                        })}
                      </Collapse>
                    )
                  })}
                </List>
              </Paper>
            </>
          )}
          {apiGetSaleById !== undefined &&
            apiGetSaleById.packs.length <= 3 &&
            (
              apiGetSaleById.packs[0].content.map((content, i) => {
                const totalOdds = content.rarity.reduce(function (tot, arr) {
                  return tot + arr.odds;
                }, 0);
                return (
                  <Paper sx={{ mb: 2, p: 2, }} key={i}>
                    <Typography variant="h5">
                      Pack Contents
                    </Typography>
                    {content.rarity.length === 1 ? (
                      <ListItem>
                        <Typography>
                          {content.amount} Randomly Selected {plural('Token', content.amount)}
                        </Typography>
                      </ListItem>
                    ) : (
                      <>
                        <ListItem>
                          <Typography>
                            {content.amount} {plural('Token', content.amount)} with Custom Probability
                          </Typography>
                        </ListItem>
                        {content.rarity.map((item, i) => {
                          return (
                            <ListItem key={i} sx={{ pl: 4 }}>
                              {formatNumber((item.odds / totalOdds * 100), 2)}% Chance of {item.rarity}
                            </ListItem>
                          )
                        })}
                      </>
                    )
                    }
                  </Paper>
                )
              })
            )}

          <Box sx={{ mb: 3 }}>
            <DirectSalesCard {...salesProps} />
          </Box>

        </Grid>
      </Grid >
    </>
  )
};

export default MintSaleInfo;

const plural = (str: string, num: number) => {
  if (num > 1) return str + 's'
  else return str
}





