import React, { FC } from 'react';
import {
  Grid,
  Container,
  Typography,
  Box,
  Avatar,
  useTheme,
  useMediaQuery,
  Paper,
  Divider
} from '@mui/material'
import Link from '@components/Link'
import Image from 'next/image';

interface IUserProfileProps {
  address?: string;
  username?: string;
  pfpUrl?: string;
  bannerUrl?: string;
  tagline?: string;
  website?: string;
  socialLinks?: {
    socialNetwork: string;
    url: string;
  }[];
  children?: React.ReactNode;
}

const UserProfile: FC<IUserProfileProps> = (
  {
    address,
    username,
    pfpUrl,
    bannerUrl,
    website,
    tagline,
    socialLinks,
    children
  }
) => {
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const lessLg = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <>
      <Box sx={{
        height: '260px',
        width: '100vw',
        overflow: 'hidden',
        display: 'block',
        position: 'relative'
      }}>
        <Image
          src={bannerUrl ? bannerUrl : "/images/placeholder/3.jpg"}
          layout="fill"
          objectFit="cover"
          height={260}
          width={3840}
          alt="Banner Image"
        />
      </Box>
      <Container sx={{ mb: '50px', mt: '24px' }}>
        <Grid container justifyContent="center">
          <Grid
            item
            lg={3}
            sx={{
              pr: lessLg ? '' : "24px",
              maxWidth: '560px',
              minWidth: 0
            }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'block',
                height: 'calc(100% + 100px)',
                mt: lessLg ? '-95px' : '-75px',
                textAlign: lessLg && upSm ? 'center' : 'left'
              }}
            >
              <Box
                sx={{
                  position: 'sticky',
                  top: '100px',
                  // height: '100%',
                  width: '100%'
                }}
              >
                <Paper
                  sx={{
                    p: lessLg ? '' : '24px',
                    pb: '24px',
                    top: 84,
                    width: '100%',
                    border: lessLg ? 'none' : '1px solid',
                    borderColor: theme.palette.divider,
                    background: lessLg ? 'none' : theme.palette.background.paper,
                    zIndex: '100'
                  }}
                >
                  <Avatar
                    alt={username ? username : address}
                    src={pfpUrl ? pfpUrl : ''}
                    sx={{
                      width: lessLg ? 180 : 120,
                      height: lessLg ? 180 : 120,
                      mx: 'auto',
                      mb: '24px',
                      bgcolor: theme.palette.primary.main
                    }}
                  />
                  {username && <Typography
                    sx={{
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      mb: '3px',
                      textAlign: 'center'
                    }}
                  >
                    {username}
                  </Typography>}

                  <Box
                    sx={{
                      display: 'inline-block',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      maxWidth: '100%',
                      mb: '16px'
                    }}>
                    <Link
                      sx={{
                        color: theme.palette.primary.main,
                        lineHeight: 1.5,
                        mb: '16px',
                        '&:hover': {
                          color: theme.palette.text.primary,
                        }
                      }}
                      href={'https://explorer.ergoplatform.com/en/addresses/' + address}
                    >
                      {address}
                    </Link>
                  </Box>

                  <Grid container sx={{ textAlign: 'center', width: '100%' }}>
                    <Grid item xs>
                      <Typography
                        sx={{
                          fontSize: '1.5rem',
                          fontWeight: '700'
                        }}
                      >
                        12
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.8rem',
                          color: theme.palette.text.secondary
                        }}
                      >
                        NFTs Owned
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <Typography
                        sx={{
                          fontSize: '1.5rem',
                          fontWeight: '700'
                        }}
                      >
                        6
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.8rem',
                          color: theme.palette.text.secondary
                        }}
                      >
                        NFTs Sold
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: '24px' }} />
                  {tagline &&
                    <Typography sx={{ mb: '12px' }}>
                      {tagline}
                    </Typography>
                  }

                  {website && (
                    <Typography sx={{ mb: '18px' }}>
                      {website}
                    </Typography>
                  )}

                  {socialLinks && socialLinks.length > 0 && socialLinks[0].url !== '' && (
                    <>
                      <Typography variant='h6' sx={{ mb: '6px' }}>
                        Social Links
                      </Typography>
                      {socialLinks.map((item, i) => {
                        return (
                          <Typography key={i}>
                            {item.url}
                          </Typography>
                        )
                      })}
                    </>
                  )}
                </Paper>
              </Box>
            </Box>
          </Grid>
          <Grid item lg={9} xs={12}>
            {children}
          </Grid>
        </Grid>
      </Container >
    </>
  )
}

export default UserProfile
