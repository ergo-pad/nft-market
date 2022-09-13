import React, { FC } from 'react';
import type { NextPage } from 'next'
import {
  Grid,
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
  SvgIcon
} from '@mui/material'
import NftCard from '@components/NftCard';
import NextLink from 'next/link'
import Link from '@components/Link'
import Logo from '@components/svgs/Logo'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ButtonLink from '@components/ButtonLink'
import { DarkTheme } from '@styles/theme/theme';
import Image from 'next/image';
import CardSlider from '@components/CardSlider'
import DiamondIcon from '@components/svgs/DiamondIcon'
import { recentNfts } from '@components/placeholders/recentNfts'

const features = [
  {
    icon: <DiamondIcon sx={{ fontSize: '48px' }} />,
    title: 'Feature 1',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a, risus nec condimen tum volutpat accumsan.',
  },
  {
    icon: <DiamondIcon sx={{ fontSize: '48px' }} />,
    title: 'Feature 2',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a, risus nec condimen tum volutpat accumsan.',
  },
  {
    icon: <DiamondIcon sx={{ fontSize: '48px' }} />,
    title: 'Feature 3',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a, risus nec condimen tum volutpat accumsan.',
  },
  {
    title: 'Feature 4',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a, risus nec condimen tum volutpat accumsan.',
  },
]

const Home: NextPage = () => {
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  return (
    <>

      {/* HERO SECTION */}
      <Container sx={{ mb: '100px' }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          columnSpacing={5}
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
                  Decentra&shy;lized Utility Driven NFTs
                </Typography>
                <Typography variant="body2" sx={{ mb: '32px' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Typography>
                <Button variant="contained" endIcon={<ArrowForwardIcon />} sx={{ mb: '24px' }}>
                  Explore Marketplace
                </Button>
              </Box>
            </Box>
            <Grid
              container
              justifyContent="space-between"
              direction={{ xs: 'column', md: 'row' }}
              alignItems="center"
              spacing={{ xs: 4, md: 0 }}
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                py: { xs: '120px', md: '0' },
                pr: { xs: '0', md: '48px' }
              }}
            >
              <Grid
                item
                sx={{
                  // borderLeft: '1px solid rgba(144,144,144,0.5)',
                  flex: '1 1 auto',
                  position: 'relative',
                  textAlign: 'left'
                }}
              >
                <Box sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  display: 'inline-block',
                }}>
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '3.5rem',
                      fontWeight: 'bold',
                      mb: { xs: '-12px', md: '-16px' },
                    }}
                  >
                    2
                  </Typography>
                  <Typography>
                    Collections
                  </Typography>
                </Box>
              </Grid>
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
                  textAlign: 'center'
                }}
              >
                <Box sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  display: 'inline-block',
                }}>
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '3.5rem',
                      fontWeight: 'bold',
                      mb: { xs: '-12px', md: '-16px' },
                    }}
                  >
                    3566
                  </Typography>
                  <Typography>
                    NFTs
                  </Typography>
                </Box>
              </Grid>
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
                  textAlign: 'right'
                }}
              >
                <Box sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  display: 'inline-block',
                }}>
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '3.5rem',
                      fontWeight: 'bold',
                      mb: { xs: '-12px', md: '-16px' },
                    }}
                  >
                    60k+
                  </Typography>
                  <Typography>
                    Active Users
                  </Typography>
                </Box>
              </Grid>
            </Grid>
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
              <Card
                sx={{
                  position: 'absolute',
                  bottom: '48px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(6px)',
                  color: DarkTheme.palette.text.primary,
                  borderRadius: '16px',
                  width: '400px',
                  maxWidth: '80vw',
                }}
              >
                <CardContent sx={{ p: '24px' }}>
                  <Grid container spacing={1} sx={{ mb: '16px' }}>
                    <Grid item>
                      <Avatar>
                        <Logo
                          sx={{
                            color: theme.palette.text.primary,
                            fontSize: '16px',
                          }}
                        />
                      </Avatar>
                    </Grid>
                    <Grid item>
                      <Typography sx={{ fontWeight: '600' }}>
                        Genesis
                      </Typography>
                      <Typography>
                        by Ergopad
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography>
                        Price
                      </Typography>
                      <Typography sx={{ fontWeight: '600' }}>
                        10 Erg
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>
                        Remaining
                      </Typography>
                      <Typography sx={{ fontWeight: '600' }}>
                        153 cubes left
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#000',
                          color: '#fff',
                          '&:hover': {
                            backgroundColor: '#111',
                          },
                          width: '100%',
                        }}
                      >
                        Buy Cube
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        sx={{
                          fontSize: '14px',
                          backgroundColor: '#fff',
                          color: '#000',
                          '&:hover': {
                            backgroundColor: '#eee',
                          },
                          width: '100%',
                        }}
                      >
                        View Collection
                      </Button>
                    </Grid>
                  </Grid>


                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container >


      {/* PARTNER LOGOS */}
      <CardSlider uniqueId="partners" addMargin={24} noButton>
        <Image
          src="/images/logos.png"
          width={1404}
          height={51}
          layout="fixed"
          draggable="false"
        />
      </CardSlider>
      <Box sx={{ mb: '100px' }}></Box>


      {/* ABOUT SECTION */}
      <Container sx={{ mb: '100px' }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          columnSpacing={5}
          sx={{ mb: '100px' }}
        >
          <Grid
            item
            md={6}
            xs={12}
            sx={{
              height: '600px'
            }}
          >
            <Box
              sx={{
                position: 'relative',
                background: '#000',
                height: '100%',
                borderRadius: '16px'
              }}
            >
              <Image
                src="/images/cube2.png"
                layout="fill"
                objectFit="contain"
              />
            </Box>
          </Grid>
          <Grid item md={6} xs={12}
            sx={{
              pr: { xs: 0, md: '24px' },
              py: '24px',
            }}
          >
            <Box
              sx={{
                height: '100%',
                position: 'relative',
              }}
            >
              <Box

              >
                <Typography variant="h1">
                  About Ergo Cubes
                </Typography>
                <Typography variant="body2" sx={{ mb: '32px' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a, risus nec condimentum volutpat accumsan dui, tincidunt dolor. Id eu, dolor quam fames nisi.  Id eu, dolor quam fames nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
                <Button variant="contained" endIcon={<ArrowForwardIcon />} sx={{ mb: '24px' }}>
                  Learn More
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: '50px' }}>
          {features.map(({ icon, title, content }, i) => {
            return (
              <Grid item xs={12} sm={6} md={3} key={i} sx={{ mb: '50px' }}>
                {icon ? icon : <DiamondIcon sx={{ fontSize: '48px' }} />}
                <Typography variant="h6">
                  {title}
                </Typography>
                <Typography variant="body2">
                  {content}
                </Typography>
              </Grid>
            )
          })}
        </Grid>
      </Container>

      {/* RECENT NFTS */}
      <Box sx={{ mb: '100px' }}>
      <CardSlider uniqueId="recent-nfts" buttonTop addMargin={24} header={
        <Typography variant="h4">
          Recent NFTs
        </Typography>
      }>
        {recentNfts.map((props, i) => {
          return (
            <NftCard
              key={i}
              link={props.link}
              imgUrl={props.imgUrl}
              name={props.name}
              price={props.price}
              rarity={props.rarity}
              time={props.time}
              collection={props.collection}
              collectionLink={props.collectionLink}
              artist={props.artist}
              artistLink={props.artistLink}
              artistLogo={props.artistLogo}
            />
          )
        })}
      </CardSlider>
      </Box>

      {/* MINT YOUR OWN */}
      <Container>
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
              pr: { xs: 0, md: '24px' },
              py: '24px',
            }}
          >
            <Box
              sx={{
                height: '100%',
                position: 'relative',
              }}
            >
              <Box

              >
                <Typography variant="h1">
                  Launch Your Project
                </Typography>
                <Typography variant="body2" sx={{ mb: '32px' }}>
                  You can mass mint your own NFTs, create fungible tokens like our Cubes that users can open for unique NFTs, and create a sales portal through our website. You can even use our API and host your sale on your own website, with your own branding and graphics. 
                  </Typography>
                <Typography variant="body2" sx={{ mb: '32px' }}>
                  Everything is done through smart contracts, and the backend code is handled for you. Not only that, but your NFTs will be added to our marketplace. You can even promote your project for more views!
                </Typography>
                <Button variant="contained" endIcon={<ArrowForwardIcon />} sx={{ mb: '24px' }}>
                  Mint Now
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            sx={{
              height: '600px'
            }}
          >
            <Box
              sx={{
                position: 'relative',
                background: '#000',
                height: '100%',
                borderRadius: '16px'
              }}
            >
              <Image
                src="/images/nft-cube.png"
                layout="fill"
                objectFit="contain"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Home
