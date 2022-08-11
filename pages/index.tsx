import type { NextPage } from 'next'
import { Button, Container, Typography, Box } from '@mui/material'
import NextLink from 'next/link'
import Link from '@components/Link'
import ButtonLink from '@components/ButtonLink'

const Home: NextPage = () => {
  return (
    <Container sx={{ minHeight: '100vh' }}>
      <Typography color="primary">
        Primary Color
      </Typography>
      <Typography color="secondary">
        Secondary Color
      </Typography>
      <Typography color="text.primary">
        Text Primary
      </Typography>
      <Typography color="text.secondary">
        Text Secondary
      </Typography>
      <Box>
        <Link href="/page">Test Link</Link>
      </Box>
      <Box>
        <Link href="https://ergopad.io">External Link</Link>
      </Box>
      <Box>
        <Link href="/">Active Link</Link>
      </Box>
      <ButtonLink
        href="/page"
        variant="contained"
        size="small"
        sx={{
          mt: '55px',
        }}
      >
        Test Button Link
      </ButtonLink>
    </Container>
  )
}

export default Home
