import type { NextPage } from 'next'
import {
  Button,
  Container,
  Typography,
  Box,
  Grid
} from '@mui/material'
import Image from 'next/image'
import NextLink from 'next/link'
import Link from '@components/Link'
import ButtonLink from '@components/ButtonLink'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const Collections: NextPage = () => {
  return (
    <Container sx={{ my: '50px' }}>
      <Typography variant="h1">
        Collections
      </Typography>
      <Typography variant="body2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dui ac nec molestie condimentum aliquam viverra sed nisi. Eu, nisl, integer ultricies fames pharetra sem eu commodo. Nam tellus, ut vel egestas pulvina.
      </Typography>
      <Grid container spacing={3} alignItems="center" >
        <Grid item sm={6} xs={12}>
          <Box
            sx={{
              position: 'relative',
              background: '#000',
              height: '320px',
              borderRadius: '16px'
            }}
          >
            <Image
              src="/images/cube1.png"
              layout="fill"
              objectFit="contain"
            />
          </Box>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Box
            sx={{
              height: '100%',
              position: 'relative',
            }}
          >
            <Typography variant="h3">
              Genesis
            </Typography>
            <Typography variant="body2" sx={{ mb: '32px' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a, risus nec condimentum volutpat accumsan dui, tincidunt dolor. Id eu, dolor quam fames nisi.  Id eu, dolor quam fames nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Typography>
            <Button endIcon={<ArrowForwardIcon />} sx={{ mb: '24px' }}>
              Explore collection
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Collections
