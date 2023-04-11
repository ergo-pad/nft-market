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

// Packs or no packs? 
//    a) If packs, are there more than one pack type? 
//        i) Just one type: show collection featured image and display "Open right away"
//        ii) More than one type: pack list with info in place of featured image
//    b) No packs, but its a mint: 
//        - Display collection featured image, 
//        - No "Open right away" displayed
//    c) No packs, its an NFT: display NFT image as featured image. Give token properties as well

// UI needed: 
//    c) NFT info

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
  tokenId: string;
}> = (props) => {
  const apiCallFromAddress = {
    ...NftType,
    tokenId: props.tokenId,
    hasPackTokens: true
  }
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const [selected, setSelected] = useState<boolean[]>([])
  const [salesProps, setSalesProps] = useState({
    tokenName: '',
    openNow: false,
    price: 0,
    currency: 'Erg',
  })
  const [featuredImage, setFeaturedImage] = useState('/images/cube2.png')

  const [apiGetSaleById, setApiGetSaleById] = useState(apiGetSaleByIdNoPack)

  useEffect(() => {
    if (props.tokenId === 'packs') {
      setApiGetSaleById(apiGetSaleByIdThreePacks)
    }
    if (props.tokenId === 'single') {
      setApiGetSaleById(apiGetSaleByIdOnePack)
    }
  }, [props.tokenId])

  // NOTE CURRENCY IS NAN IF NOT ERG. NEEDS FIX LATER
  useEffect(() => {
    if (apiGetSaleById !== undefined && apiGetSaleById.packs.length > 1) {
      setSelected(apiGetSaleById.packs.map((_item, i) => i === 0 ? true : false))
      setSalesProps({
        tokenName: apiGetSaleById.packs[0].name,
        openNow: true,
        price: Number((apiGetSaleById.packs[0].price[0].amount * 0.000000001).toFixed(3)),
        currency: apiGetSaleById.packs[0].price[0].tokenId === '0000000000000000000000000000000000000000000000000000000000000000' ? 'Erg' : 'NaN',
      })
      setFeaturedImage(apiGetSaleById.packs[0].image)
    }
    else if (apiGetSaleById !== undefined && apiGetSaleById.packs.length === 1 && apiGetSaleById.packs[0].image !== '') {
      setSalesProps({
        tokenName: apiGetSaleById.packs[0].name,
        openNow: true,
        price: Number((apiGetSaleById.packs[0].price[0].amount * 0.000000001).toFixed(3)),
        currency: apiGetSaleById.packs[0].price[0].tokenId === '0000000000000000000000000000000000000000000000000000000000000000' ? 'Erg' : 'NaN',
      })
      setFeaturedImage(apiGetSaleById.packs[0].image)
    }
    else {
      setSalesProps({
        tokenName: apiGetSaleById.packs[0].name,
        openNow: false,
        price: Number((apiGetSaleById.packs[0].price[0].amount * 0.000000001).toFixed(3)),
        currency: apiGetSaleById.packs[0].price[0].tokenId === '0000000000000000000000000000000000000000000000000000000000000000' ? 'Erg' : 'NaN',
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

  const [loading, setLoading] = useState(true)
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
  useEffect(() => {
    if (props.tokenId.length === 64) fetchData(props.tokenId)
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
                {tokenDetails.r9 && tokenDetails.type === 'Image NFT' ?
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
              <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Grid item>
                  <Typography sx={boldTextSx}>
                    Collection:
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography color="text.secondary" sx={textSx}>
                    <Link href={apiCallFromAddress.collectionUrl}>
                      {apiCallFromAddress.collectionTitle}
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
              <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Grid item>
                  <Typography sx={boldTextSx}>
                    Artist:
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography color="text.secondary" sx={textSx}>
                    <Link href={'/users/' + apiCallFromAddress.artistAddress}>
                      {apiCallFromAddress.artistName}
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
              {apiGetSaleById.endTime && (
                <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                  <Grid item>
                    <Typography sx={boldTextSx}>
                      Sale End:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="text.secondary" sx={textSx}>
                      {dayjs(apiGetSaleById.endTime).toString()}
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

          {apiGetSaleById !== undefined && apiGetSaleById.packs.length > 1 && (
            <>
              <Paper sx={{ mb: 2, p: 2 }}>
                <Typography variant="h5">
                  Choose a pack
                </Typography>
                {apiGetSaleById.packs.map((item, i) => {
                  return (
                    <PackTokenSelector
                      key={i}
                      index={i}
                      packInfo={apiGetSaleById.packs[i]}
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
                  {apiGetSaleById.packs.map((pack, i) => {
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
            apiGetSaleById.packs.length === 1 &&
            apiGetSaleById.packs[0].image !== '' && (
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


















/// API NEEDED ////////
const ApiPriceConversion: { [key: string]: number } = {
  erg: 1.51,
  ergopad: 0.006
}
/// END API NEEDED ///

////////////////////////////////////////////////////////////////////////////////////////
// BEGIN SAMPLE DATA ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

const apiGetSaleByIdThreePacks = {
  "id": "3357bcf6-baa5-4337-a9a0-468364d8a1fd",
  "name": "Blitz TCG: 1st Edition",
  "description": "This is the sale description, added by the user. It can be as long or short as they choose, or left off. ",
  "startTime": "2023-01-10T11:41:57Z",
  "endTime": "2023-04-30T23:27:54Z",
  "sellerWallet": "9h7L7sUHZk43VQC3PHtSp5ujAWcZtYmWATBH746wi75C5XHi68b",
  "saleWallet": "3n7SxSJE7u1zXqj3JmTPYgnEv7ZGc8ULnfeWCDDgij11rrik43ZWTXAwJyGJondbZ6ssk1yQMbCTpkAd3oqXb2EJ6U1h1wk11asoHuFiF8qZs46eXqvfHUbvPkXa2YVM8bKw53UBsNwpmbV2MfEFi1uoC3hAJ2p4v1y75zxYG",
  "packs": [
    {
      "id": "53b93d59-5e46-4ef8-8f24-81e5704ad51e",
      "name": "Single",
      "image": "/images/nft1.png",
      "price": [
        {
          "id": "15b4c4f2-4415-4a3f-9777-b9f6bbed02eb",
          "tokenId": "0000000000000000000000000000000000000000000000000000000000000000",
          "amount": 7000000000,
          "packId": "53b93d59-5e46-4ef8-8f24-81e5704ad51e"
        }
      ],
      "content": [
        {
          "id": "44126fcf-140c-4270-89e9-dea71bed1944",
          "rarity": [
            {
              "odds": 20,
              "rarity": "_pt_rarity_Single NFT"
            }
          ],
          "amount": 1,
          "packId": "53b93d59-5e46-4ef8-8f24-81e5704ad51e"
        }
      ]
    },
    {
      "id": "a4b49f9c-9a68-406a-a6b2-f221e31592bd",
      "name": "3 Pack",
      "image": "/images/nft2.png",
      "price": [
        {
          "id": "fc2561d4-d35b-47a3-b082-1e71f946832e",
          "tokenId": "0000000000000000000000000000000000000000000000000000000000000000",
          "amount": 10000000000,
          "packId": "a4b49f9c-9a68-406a-a6b2-f221e31592bd"
        }
      ],
      "content": [
        {
          "id": "111df494-c887-4f3b-937e-99b13f65981a",
          "rarity": [
            {
              "odds": 100,
              "rarity": "Rare"
            },
            {
              "odds": 25,
              "rarity": "Common"
            }
          ],
          "amount": 1,
          "packId": "a4b49f9c-9a68-406a-a6b2-f221e31592bd"
        },
        {
          "id": "111df494-c887-4f3b-937e-99b13f65981a",
          "rarity": [
            {
              "odds": 100,
              "rarity": "_pt_rarity_3 Pack"
            },
          ],
          "amount": 2,
          "packId": "a4b49f9c-9a68-406a-a6b2-f221e31592bd"
        }
      ]
    },
    {
      "id": "a4b49f9c-9a68-406a-a6b2-f221e31592bd",
      "name": "5 Pack",
      "image": "/images/Frame_230048.png",
      "price": [
        {
          "id": "fc2561d4-d35b-47a3-b082-1e71f946832e",
          "tokenId": "0000000000000000000000000000000000000000000000000000000000000000",
          "amount": 15000000000,
          "packId": "a4b49f9c-9a68-406a-a6b2-f221e31592bd"
        }
      ],
      "content": [
        {
          "id": "111df494-c887-4f3b-937e-99b13f65981a",
          "rarity": [
            {
              "odds": 100,
              "rarity": "_pt_rarity_5 Pack"
            }
          ],
          "amount": 3,
          "packId": "a4b49f9c-9a68-406a-a6b2-f221e31592bd"
        }
      ]
    }
  ],
  "tokens": [],
  "initialNanoErgFee": 10000000000,
  "saleFeePct": 5
}

const apiGetSaleByIdOnePack = {
  "id": "3357bcf6-baa5-4337-a9a0-468364d8a1fd",
  "name": "Blockhead Single Pack",
  "description": "This is the sale description, added by the user. It can be as long or short as they choose, or left off. ",
  "startTime": "2023-01-10T11:41:57Z",
  "endTime": "2023-04-30T23:27:54Z",
  "sellerWallet": "9h7L7sUHZk43VQC3PHtSp5ujAWcZtYmWATBH746wi75C5XHi68b",
  "saleWallet": "3n7SxSJE7u1zXqj3JmTPYgnEv7ZGc8ULnfeWCDDgij11rrik43ZWTXAwJyGJondbZ6ssk1yQMbCTpkAd3oqXb2EJ6U1h1wk11asoHuFiF8qZs46eXqvfHUbvPkXa2YVM8bKw53UBsNwpmbV2MfEFi1uoC3hAJ2p4v1y75zxYG",
  "packs": [
    {
      "id": "53b93d59-5e46-4ef8-8f24-81e5704ad51e",
      "name": "Single NFT",
      "image": "/images/Frame_230048.png",
      "price": [
        {
          "id": "15b4c4f2-4415-4a3f-9777-b9f6bbed02eb",
          "tokenId": "0000000000000000000000000000000000000000000000000000000000000000",
          "amount": 7000000000,
          "packId": "53b93d59-5e46-4ef8-8f24-81e5704ad51e"
        }
      ],
      "content": [
        {
          "id": "44126fcf-140c-4270-89e9-dea71bed1944",
          "rarity": [
            {
              "odds": 20,
              "rarity": "_pt_rarity_Single NFT"
            }
          ],
          "amount": 1,
          "packId": "53b93d59-5e46-4ef8-8f24-81e5704ad51e"
        }
      ]
    }
  ],
  "tokens": [],
  "initialNanoErgFee": 10000000000,
  "saleFeePct": 5
}

const apiGetSaleByIdNoPack = {
  "id": "3357bcf6-baa5-4337-a9a0-468364d8a1fd",
  "name": "Sale Name",
  "description": "This is the sale description, added by the user. It can be as long or short as they choose, or left off. ",
  "startTime": "2023-01-10T11:41:57Z",
  "endTime": "2023-04-30T23:27:54Z",
  "sellerWallet": "9h7L7sUHZk43VQC3PHtSp5ujAWcZtYmWATBH746wi75C5XHi68b",
  "saleWallet": "3n7SxSJE7u1zXqj3JmTPYgnEv7ZGc8ULnfeWCDDgij11rrik43ZWTXAwJyGJondbZ6ssk1yQMbCTpkAd3oqXb2EJ6U1h1wk11asoHuFiF8qZs46eXqvfHUbvPkXa2YVM8bKw53UBsNwpmbV2MfEFi1uoC3hAJ2p4v1y75zxYG",
  "packs": [
    {
      "id": "53b93d59-5e46-4ef8-8f24-81e5704ad51e",
      "name": "Single NFT",
      "image": "",
      "price": [
        {
          "id": "15b4c4f2-4415-4a3f-9777-b9f6bbed02eb",
          "tokenId": "0000000000000000000000000000000000000000000000000000000000000000",
          "amount": 7000000000,
          "packId": "53b93d59-5e46-4ef8-8f24-81e5704ad51e"
        }
      ],
      "content": [
        {
          "id": "44126fcf-140c-4270-89e9-dea71bed1944",
          "rarity": [
            {
              "odds": 20,
              "rarity": "_pt_rarity_Single NFT"
            }
          ],
          "amount": 1,
          "packId": "53b93d59-5e46-4ef8-8f24-81e5704ad51e"
        }
      ]
    }
  ],
  "tokens": [],
  "initialNanoErgFee": 10000000000,
  "saleFeePct": 5
}

const collection = {
  address: "9asdfgEGZKHfKCUasdfvreqK6s6KiALNCFxojUa4Tbibw2Ajw1JFo",
  collectionName: "Ergopad NFTs",
  collectionLogo: "/images/collections/ergopad-logo.jpg",
  bannerUrl: undefined,
  description: "A psychological phenomenon known as the mere exposure effect is where we develop a preference just because we are familiar with things.",
  socialLinks: [],
  category: '',
  website: 'http://ergopad.io',
  totalQty: 3000
};

const NftType = {
  title: 'Monk & Fox #0017',
  description: 'This is the description of the token. Suspendisse a, risus nec condimentum volutpat accumsan dui, tincidunt dolor. Id eu, dolor quam fames nisi. Id eu, dolor quam fames nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  mintDate: new Date(1663353871000),
  tokenId: '9a8b5be32311f123c4e40f22233da12125c2123dcfd8d6a98e5a3659d38511c8',
  views: 124,
  category: 'Rare',
  collectionTitle: 'Wrath of Gods',
  collectionUrl: '/collections/wrath-of-gods',
  artistName: 'Paideia',
  artistAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
  artistLogoUrl: '/images/paideia-circle-logo.png',
  traits: [
    {
      traitName: 'Rarity',
      value: 'Common',
      qtyWithTrait: 2600
    },
    {
      traitName: 'Color',
      value: 'Blue',
      qtyWithTrait: 130
    },
    {
      traitName: 'Speed',
      value: '54',
      qtyWithTrait: 16
    },
    {
      traitName: 'Hair',
      value: 'Mohawk',
      qtyWithTrait: 521
    },
  ]
}


////////////////////////////////////////////////////////////////////////////////////////
// END SAMPLE DATA /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
