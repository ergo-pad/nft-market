import React from 'react';
import type { NextPage } from 'next'
import {
  Grid,
  Container,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Paper,
  Icon
} from '@mui/material'
import FeatureCard from '@components/FeatureCard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ButtonLink from '@components/ButtonLink'
import Image from 'next/image';
import CardSlider from '@components/CardSlider'

interface IDataTypeProps {
  title: string;
  description: string;
  mintDate: Date;
  artistName: string;
  artistUrl: string;
  artistAddress: string;
  saleUrl?: string;
  stats: {
    title: string;
    stat: number | string;
  }[];
  details: {
    title: string;
    detail: number | string;
  }[];
  traitDescription: string;
  traits: {
    title: string;
    imgUrl?: string;
    description: string;
  }[];
  rarityDescription: string;
  rarity: {
    title: string;
    imgUrl?: string;
    description: string;
  }[]
}

const dataType = {
  title: 'Genesis',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  mintDate: new Date(1663353871),
  artistName: 'Ergopad',
  artistUrl: '/',
  artistAddress: 'FZbgi29c2pjq2Gjd55hhff7ywV8eyHuJ',
  saleUrl: '/',
  stats: [
    {
      title: 'NFT Cubes',
      stat: 1200
    },
    {
      title: 'Traits',
      stat: 4
    },
    {
      title: 'Layers',
      stat: 4
    }
  ],
  details: [
    {
      title: 'Remaining Cubes',
      detail: 115
    },
    {
      title: 'Opened Cubes',
      detail: 832
    },
    {
      title: 'Unopened Cubes',
      detail: 1200 - 832
    }
  ],
  traitDescription: 'The NFTs you unlock will can have traits from various styles. You can have a fully matched charatcer, a fully mismatched character, or any combination. ',
  traits: [
    {
      title: 'Ninja Style',
      imgUrl: '/images/character1.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      title: 'Samurai Style',
      imgUrl: '/images/character2.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      title: 'Dragon Style',
      imgUrl: '/images/character3.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      title: 'Gaisha Style',
      imgUrl: '/images/character4.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ],
  rarityDescription: 'Rarity will be denoted by a border color. NFTs with fewer traits will be more rare, based on multiples. 4 traits with 4 types will produce 16 unique NFTs for that character. 4 traits with 2 types will produce 8. Rarity is determined by number of unique NFTs per character. ',
  rarity: [
    {
      title: 'Common',
      // imgUrl: '/images/character1.png',
      description: 'Commons have up to 16 different variations per character.',
    },
    {
      title: 'Uncommon',
      // imgUrl: '/images/character2.png',
      description: 'Uncommons have 3 traits with 4 variations each, meaning an uncommon will be 1 of 12.',
    },
    {
      title: 'Rare',
      // imgUrl: '/images/character3.png',
      description: 'Rare NFTs will have 2 traits with 4 variations each. These will be 1 of 8',
    },
    {
      title: 'Ultra Rare',
      // imgUrl: '/images/character4.png',
      description: 'These NFTs can have 1 trait with 4 variations, resulting in a 1 of 4 possibility',
    },
    {
      title: 'Legendary',
      // imgUrl: '/images/character4.png',
      description: 'These NFTs can have 1 trait with 2 variations, resulting in a 1 of 2',
    },
    {
      title: 'Unique',
      // imgUrl: '/images/character4.png',
      description: 'These NFTs can are one of a kind, with no possible variations',
    },
  ],
}

///////////////////////////////////////
// UPDATED TEST DATA //////////////////
///////////////////////////////////////
/* 
interface ITraitsProps {
  category: string;
  traits: {
    title: string;
    description: string;
    imageUrl: string;
  }[]
}

traits: [
  {
    category: 'Rarity',
    traits: [
      {
        title: 'Common',
        description: 'The most basic and standard cards',
        imageUrl: '',
      },
      {
        title: 'Uncommon',
        description: 'Cards that inherently have more depth, restrictions, or specific uses',
        imageUrl: '',
      },
      {
        title: 'Rare',
        description: 'Cards that are likely General-specific and improve General-based strategies',
        imageUrl: '',
      },
      {
        title: 'Legendary',
        description: 'Cards likely key for end-game strategy or that bring overwhelming change',
        imageUrl: '',
      },
    ]
  },
  {
    category: 'Edition',
    traits: [
      {
        title: '1st Edition (1ED)',
        description: '1ED version of sets will have a very limited production and provide players with unique cosmetic experiences in-game',
        imageUrl: '',
      },
      {
        title: 'Unlimited Edition (UED)',
        description: 'UED run will allow players to acquire all cards necessary for competitive play, albeit with less exclusivity and thus less collectible value. UED packs will be purchasable throughout the entirety of the competitive season in which they were introduced.',
        imageUrl: '',
      }
    ]
  },
  {
    category: 'Level Bracket',
    traits: [
      {
        title: 'Starter',
        description: 'Level 1 cards',
        imageUrl: '',
      },
      {
        title: 'Low',
        description: 'Level 2-4 cards',
        imageUrl: '',
      },
      {
        title: 'Mid',
        description: 'Level 5-7 cards',
        imageUrl: '',
      },
      {
        title: 'Upper',
        description: 'Level 8-10 cards',
        imageUrl: '',
      }
    ]
  },
],
*/

const Collection: NextPage<IDataTypeProps> = (props) => {
  const theme = useTheme()
  props = dataType;
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  return (
    <>
      <Container sx={{ mb: '100px' }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          columnSpacing={5}
          sx={{ mb: '100px' }}
        >
          <Grid item md={6} xs={12}
            sx={{
              // pr: { xs: 0, md: '24px' },
              py: '24px',
            }}
          >
            <Box
              sx={{
                height: { xs: 'calc(100vh - 120px)', md: '100%' },
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: { xs: 'absolute', md: 'relative' },
                  bottom: 0,
                }}
              >
                <Typography variant="h1">
                  {props.title}
                </Typography>
                <Box
                  sx={{
                    mb: '24px'
                  }}
                >
                  <Box
                    sx={{
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      mr: '8px',
                      height: '32px',
                      width: '32px',
                      borderRadius: "32px",
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src="/images/ergopad-circle-logo.png"
                      layout="fixed"
                      height={32}
                      width={32}
                    />
                  </Box>
                  <Typography
                    sx={{
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      display: 'inline-block',
                    }}
                  >
                    By {props.artistName}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: '24px' }}>
                  {props.description}
                </Typography>
                <Grid
                  container
                  justifyContent="space-between"
                  direction={{ xs: 'column', md: 'row' }}
                  alignItems="center"
                  spacing={{ xs: 4, md: 0 }}
                  sx={{
                    textAlign: { xs: 'center', md: 'left' },
                    py: { xs: '120px', md: '0' },
                    pr: { xs: '0', md: '48px' },
                    mb: '24px'
                  }}
                >
                  {props.stats.map((stat, i) => {
                    const statSx = {
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '3.5rem',
                      fontWeight: 'bold',
                      mb: '-12px',
                    }
                    if (i === 0) return (
                      <Grid
                        item
                        sx={{
                          flex: '1 1 auto',
                          position: 'relative',
                          textAlign: 'left'
                        }}
                        key={i}
                      >
                        <Box sx={{
                          textAlign: { xs: 'center', md: 'left' },
                          display: 'inline-block',
                        }}>
                          <Typography
                            sx={statSx}
                          >
                            {stat.stat}
                          </Typography>
                          <Typography>
                            {stat.title}
                          </Typography>
                        </Box>
                      </Grid>
                    )
                    if ((i === 1) || (i === 2)) return (
                      <Grid
                        item
                        sx={{
                          '&::before, ::after ': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            mt: '-10%',
                            height: '60%',
                            width: '1px',
                            background: { xs: 'none', md: 'rgba(144,144,144,0.2)' },
                          },
                          flex: '1 1 auto',
                          position: 'relative',
                          textAlign: i === 1 ? 'center' : 'right'
                        }}
                        key={i}
                      >
                        <Box sx={{
                          textAlign: { xs: 'center', md: 'left' },
                          display: 'inline-block',
                        }}>
                          <Typography
                            sx={statSx}
                          >
                            {stat.stat}
                          </Typography>
                          <Typography>
                            {stat.title}
                          </Typography>
                        </Box>
                      </Grid>
                    )
                    else return
                  })}
                </Grid>
                {props.saleUrl && (
                  <ButtonLink href={props.saleUrl} variant="contained" endIcon={<ArrowForwardIcon />} sx={{ mb: '24px' }}>
                    Buy Now
                  </ButtonLink>
                )}

              </Box>
            </Box>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            sx={{
              height: upSm ? '800px' : '600px'
            }}>
            <Box
              sx={{
                position: 'relative',
                height: '100%',
                background: '#000',
                borderRadius: '0 0 16px 16px'
              }}
            >
              <Image
                src="/images/cube1.png"
                layout="fill"
                objectFit="contain"
              />
            </Box>
          </Grid>
        </Grid>

        {/* GENERAL INFO */}
        <Paper sx={{ p: '24px', maxWidth: '650px', mx: 'auto' }}>
          <Typography
            sx={{
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              display: 'inline-block',
              mb: '16px',
            }}
          >
            General Information
          </Typography>
          <Box
            sx={{
              mb: '6px',

            }}
          >
            <Icon sx={{ verticalAlign: 'middle' }}>calendar_today</Icon> Minted Date: {props.mintDate.toDateString()}
          </Box>
          <Box
            sx={{
              mb: '24px',
            }}
          >
            <Icon sx={{ verticalAlign: 'middle' }}>account_balance_wallet</Icon> Artist Address: {props.artistAddress}
          </Box>
          <Grid
            container
            spacing={1}
            justifyContent="space-around"
          >
            {props.details.map((props, i) => {
              return (
                <Grid item key={i}>
                  <Paper
                    sx={{
                      px: '16px',
                      py: '12px',
                      textAlign: 'center'
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '1.5rem',
                        fontWeight: '700'
                      }}
                    >
                      {props.detail}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.8rem',
                        color: theme.palette.text.secondary
                      }}
                    >
                      {props.title}
                    </Typography>
                  </Paper>
                </Grid>
              )
            })}
          </Grid>
        </Paper>
      </Container>

      {/* TRAITS */}
      <Box sx={{ mb: '100px' }}>
        <CardSlider uniqueId="traits" buttonTop addMargin={24} header={
          <>
            <Typography variant="h4">
              Traits
            </Typography>
            <Typography>
              {props.traitDescription}
            </Typography>
          </>
        }>
          {props.traits.map((props, i) => {
            return (
              <FeatureCard
                key={i}
                title={props.title}
                imgUrl={props.imgUrl}
                description={props.description}
              />
            )
          })}
        </CardSlider>
      </Box>

      {/* RARITY */}
      <Box sx={{ mb: '100px' }}>
        <CardSlider uniqueId="rarities" buttonTop addMargin={24} header={
          <>
            <Typography variant="h4">
              Rarity
            </Typography>
            <Typography>
              {props.rarityDescription}
            </Typography>
          </>
        }>
          {props.rarity.map((props, i) => {
            return (
              <FeatureCard
                key={i}
                title={props.title}
                imgUrl={props.imgUrl}
                description={props.description}
              />
            )
          })}
        </CardSlider>
      </Box>
    </>
  )
}

export default Collection