import type { NextPage } from 'next'
import {
  Grid,
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  useTheme
} from '@mui/material'
import NextLink from 'next/link'
import Link from '@components/Link'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ButtonLink from '@components/ButtonLink'

const Home: NextPage = () => {
  const theme = useTheme()
  return (
    <Container>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item md={6} xs={12}
          sx={{
            pr: { xs: 0, md: '24px' },
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
            background: theme.palette.mode == 'dark' ? '#000' : '#eee',
            height: '800px'
          }}>
          <Box
            sx={{
              position: 'relative',
              height: '100%',
            }}
          >
            <Card
              sx={{
                position: 'absolute',
                bottom: '48px',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            >
              <CardContent>
                <Typography>
                  Genesis by Ergopad
                </Typography>
                <Button>
                  Buy Cube
                </Button>
                <Button>
                  View Collection
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

    </Container >
  )
}

export default Home
