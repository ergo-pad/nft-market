import React, { FC, useMemo, useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CardActionArea,
  Button,
  Box,
  Typography,
  useTheme,
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import Image from 'next/image';
import Link from '@components/Link';
import { useRouter } from 'next/router'
import OpenPacks from '@components/dialogs/OpenPacks';

interface IPackCardProps {
  imgUrl: string;
  link: string;
  name: string;
  collection?: string;
  collectionLink?: string;
  artist: string;
}

const PackCard: FC<IPackCardProps> = ({
  imgUrl,
  link,
  name,
  collection,
  collectionLink,
  artist,
}) => {
  const randomInteger = (min: number, max: number) => {
    return (min + Math.random() * (max - min)).toFixed();
  };
  const rand = useMemo(() => randomInteger(1, 18), [1, 18]);
  const theme = useTheme()
  const [confirmationOpen, setConfirmationOpen] = useState(false)

  return (
    <>
      <Card
        elevation={0}
        sx={{
          minWidth: '276px',
          mb: '6px',
        }}
      >
        <CardActionArea
          onClick={() => setConfirmationOpen(true)}
        >
          <Box sx={{
            position: 'relative',
            display: 'block',
            height: '235px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: theme.palette.divider
          }}>
            <Image
              src={imgUrl ? imgUrl : `/images/placeholder/${rand}.jpg`}
              layout="fill"
              objectFit="cover"
              draggable="false"
              alt="nft image"
            />
          </Box>
          <CardContent>
            <Typography
              sx={{
                fontWeight: '600',
                fontSize: '1.27rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {name}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions
          sx={{
            p: '16px',
            pt: 0
          }}
        >
          <Box
            sx={{
              fontWeight: '700',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
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
              sx={{
                fontStyle: 'italic',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              by
              {' '}
              <Link
                href={'/users/' + artist.replace(/\s/g, "-").toLowerCase()}
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
            </Typography>
          </Box>
        </CardActions>

      </Card>
      <OpenPacks
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        packs={[{
          name: name,
          collection: collection ? collection : undefined,
          artist: artist,
          imgUrl: imgUrl,
        }]}
      />
    </>
  );
};

export default PackCard;