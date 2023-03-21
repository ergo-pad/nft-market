import React, { FC, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Box,
  Typography,
  useTheme
} from '@mui/material'
import Image from 'next/image';
import { useRouter } from 'next/router'

interface INftCardProps {
  pfpUrl?: string;
  name?: string;
  address: string;
}

const UserCard: FC<INftCardProps> = (props) => {
  const randomInteger = (min: number, max: number) => {
    return (min + Math.random() * (max - min)).toFixed();
  };
  const rand = useMemo(() => randomInteger(1, 18), [1, 18]);

  const theme = useTheme()
  return (
    <Card
      sx={{
        minWidth: '256px',
        maxWidth: '280px',
        mb: '6px',
        mx: 'auto'
      }}
    >
      <CardActionArea
        href={'/users/' + props.address}
      >
        <Box sx={{ position: 'relative', display: 'block', height: '205px' }}>
          <Image src={props.pfpUrl ? props.pfpUrl : `/images/placeholder/${rand}.jpg`} layout="fill" draggable="false" alt="placeholder" />
        </Box>
        <CardContent sx={{ position: 'relative' }}>
          <Typography
            sx={{
              fontWeight: '700',
              fontSize: '1.1rem',
              mb: '6px',
            }}
          >
            {props.name ? props.name : props.address}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default UserCard;