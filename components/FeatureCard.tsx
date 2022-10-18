import React, { FC, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
  useTheme
} from '@mui/material'
import Image from 'next/image';
import { useRouter } from 'next/router'

interface IFeatureCardProps {
  imgUrl?: string;
  title: string;
  description: string;
}

const FeatureCard: FC<IFeatureCardProps> = (props) => {
  const randomInteger = (min: number, max: number) => {
    return (min + Math.random() * (max - min)).toFixed();
  };
  const rand = useMemo(() => randomInteger(1, 18), [1, 18]);
  return (
    <Card
    elevation={0}
      sx={{
        width: '270px',
      }}
    >
      <CardMedia sx={{ height: '270px' }}>
        <Image src={props.imgUrl ? props.imgUrl : `/images/placeholder/${rand}.jpg`} layout="intrinsic" objectFit="cover" width={270} height={270} draggable="false" />
      </CardMedia>
      <CardContent>
        <Typography
          sx={{
            fontWeight: '700',
            fontSize: '1.1rem',
            mb: '6px',
          }}
        >
          {props.title}
        </Typography>
        <Typography
          sx={{
            whiteSpace: 'normal'
          }}
        >
          {props.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;