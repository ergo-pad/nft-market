import React, { FC, useMemo } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CardActionArea,
  Button,
  Box,
  Typography,
  useTheme
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Image from 'next/image';
import Link from '@components/Link';
import { ThemeContext } from '@emotion/react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useRouter } from 'next/router'

interface INftCardProps {
  imgUrl?: string;
  link?: string;
  name?: string;
  price?: string;
  rarity?: string;
  time?: string;
  collection?: string;
  collectionLink?: string;
  artist?: string;
  artistLogo?: string;
  artistLink?: string;
}

const NftCard: FC<INftCardProps> = ({ imgUrl, link, name, price, rarity, time, collection, collectionLink, artist, artistLogo, artistLink }) => {
  const router = useRouter();
  
  const randomInteger = (min: number, max: number) => {
    return (min + Math.random() * (max - min)).toFixed();
  };
  const rand = useMemo(() => randomInteger(1, 18), [1, 18]);

  const theme = useTheme()
  return (
    <Card
    elevation={0}
      sx={{
        minWidth: '276px',
        mb: '6px',
      }}
    >
      <CardActionArea
        onClick={() => {
          link && router.push(link);
        }}
      >
        <Box sx={{ position: 'relative', display: 'block', height: '205px' }}>
          <Image src={imgUrl ? imgUrl : `/images/placeholder/${rand}.jpg`} layout="fill" draggable="false" alt="logo" />
        </Box>
        {price && (
          <Box
            sx={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              p: '8px',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(6px)',
              color: '#fff',
              borderRadius: '6px',
            }}
          >
            <Typography sx={{ fontWeight: '700', }}>
              {price}
            </Typography>
          </Box>
        )}
        <CardContent sx={{ position: 'relative' }}>
          {rarity && (
            <Box
              sx={{
                position: 'absolute',
                top: '-16px',
                right: '16px',
                height: '28px',
                p: '2px 8px',
                background: theme.palette.primary.main,
                color: theme.palette.background.default,
                borderRadius: '50px',
              }}
            >
              <Typography sx={{ fontWeight: '700', }}>
                {rarity}
              </Typography>
            </Box>
          )}
          <Typography
            sx={{
              fontWeight: '700',
              fontSize: '1.1rem',
              mb: '6px',
            }}
          >
            {name}
          </Typography>
          <Box>
            <AccessTimeIcon
              sx={{
                verticalAlign: '-0.25em',
                mr: '5px',
              }}
            />
            <Typography
              sx={{
                display: 'inline-block',
              }}
            >
              {time}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          p: '16px',
        }}
      >
        <Grid2
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: '100%',
          }}
        >
          <Grid2>
            <Typography
              sx={{
                fontWeight: '700',
              }}
            >
              {collectionLink ? (
                <Link
                  href={collectionLink}
                  sx={{
                    color: theme.palette.text.secondary,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {collection}
                </Link>
              ) : (
                collection
              )}
              {' '}
              <Typography
                component="span"
                sx={{
                  fontStyle: 'italic'
                }}
              >
                by
                {' '}
                {artistLink ? (
                  <Link
                    href={artistLink}
                    sx={{
                      color: theme.palette.text.secondary,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {artist}
                  </Link>
                ) : (
                  artist
                )}
              </Typography>
            </Typography>
          </Grid2>
          <Grid2>
            {artistLink && artistLogo ? (
              <Link
                href={artistLink}
                sx={{
                  color: theme.palette.text.secondary,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  },
                }}
              >
                <Image src={artistLogo} layout="fixed" width={32} height={32} alt="Artist Logo" />
              </Link>
            ) : (
              ''
            )}
          </Grid2>
        </Grid2>
      </CardActions>
    </Card>
  );
};

export default NftCard;