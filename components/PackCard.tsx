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
  useTheme
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Image from 'next/image';
import Link from '@components/Link';
import { ThemeContext } from '@emotion/react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useRouter } from 'next/router'
import OpenPacks from '@components/dialogs/OpenPacks';

interface IPackCardProps {
  imgUrl: string;
  link?: string;
  name: string;
  price?: string;
  rarity?: string;
  collection?: string;
  collectionLink?: string;
  artist: string;
  artistLogo?: string;
  artistLink?: string;
}

const PackCard: FC<IPackCardProps> = ({
  imgUrl,
  link,
  name,
  collection,
  collectionLink,
  artist,
}) => {
  const router = useRouter();

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
          onClick={() => {
            link && router.push(link);
          }}
        >
          <Box sx={{ position: 'relative', display: 'block', height: '205px' }}>
            <Image src={imgUrl ? imgUrl : `/images/placeholder/${rand}.jpg`} layout="fill" draggable="false" alt="placeholder" />
          </Box>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ mb: '6px' }}
            >
              {name}
            </Typography>
            <Box
              sx={{
                fontSize: '0.85rem'
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
                    },
                    zIndex: 100
                  }}
                >
                  {collection}
                </Link>
              ) : (
                collection
              )}
            </Box>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            onClick={() => setConfirmationOpen(true)}
          >
            Open
          </Button>
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