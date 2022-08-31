import type { NextPage } from 'next'
import { Grid, Container, Typography, Box, useTheme } from '@mui/material'
import NextLink from 'next/link'
import Link from '@components/Link'
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
          <Typography variant="h1">
            Decentralized Utility Driven NFTs
          </Typography>
          <Typography variant="subtitle1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
        </Grid>
        <Grid item md={6} xs={12} sx={{ background: theme.palette.mode == 'dark' ? '#000' : '#fff', width: '100vw', height: '100vh' }}>

        </Grid>
      </Grid>

    </Container>
  )
}

export default Home
