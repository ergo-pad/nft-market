import React, { FC } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CardActionArea,
  Button,
  Typography,
  useTheme
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Image from 'next/image';
import Link from '@components/Link';
import { ThemeContext } from '@emotion/react';

interface INftCardProps {
  imgUrl?: string;
  name?: string;
  price?: string;
  views?: string;
  time?: string;
  collection?: string;
  collectionLink?: string;
  artist?: string;
  artistLogo?: string;
  artistLink?: string;
}

const NftCard: FC<INftCardProps> = ({ imgUrl, name, price, views, time, collection, collectionLink, artist, artistLogo, artistLink }) => {
  const theme = useTheme()
  return (
    <Card
      sx={{
        maxWidth: '276px',
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          alt=""
          height="205"
          image={imgUrl}
        />

        <CardContent>
          <Typography
            sx={{
              fontWeight: '700',
            }}
          >
            {name}
          </Typography>
          <Typography>
            {time}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid2
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: '100%'
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
                  }
                }}
              >
                <Image src={artistLogo} layout="fixed" width={32} height={32} />
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