import React, { FC } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button
} from '@mui/material'

interface INftCardProps {
  imgUrl?: string;
  children?: React.ReactNode;
}

const NftCard: FC<INftCardProps> = ({ imgUrl, children }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        alt=""
        height="240"
        image={imgUrl}
      />
      <CardContent>
        {children}
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default NftCard;