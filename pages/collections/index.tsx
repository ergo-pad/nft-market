import { FC, useMemo, useState, useEffect, useContext } from 'react'
import type { NextPage } from 'next'
import {
  Container,
  Typography,
  Box,
  Grid,
  Divider,
  useTheme
} from '@mui/material'
import Image from 'next/image'
import ButtonLink from '@components/ButtonLink'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CollectionList, { ICollectionRow } from '@components/collections/CollectionList'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from 'swiper';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ApiContext, IApiContext } from "@contexts/ApiContext";

const featuredCollections = [
  {
    imgUrl: '/images/cube1.png',
    logoUrl: '/images/ergopad-circle-logo.png',
    title: 'Genesis',
    artist: 'Ergopad',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dui ac nec molestie condimentum aliquam viverra sed nisi. Eu, nisl, integer ultricies fames pharetra sem eu commodo. Nam tellus, ut vel egestas pulvina.',
    link: '/collections/genesis',
  },
  {
    imgUrl: '/images/nft-cube.png',
    logoUrl: '/images/paideia-circle-logo.png',
    title: 'Wrath of the Gods',
    artist: 'Paideia',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dui ac nec molestie condimentum.',
    link: '/collections/wrath-of-the-gods',
  },
  {
    title: 'Placeholder Title',
    artist: 'Placeholder',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dui ac nec molestie condimentum.',
    link: '/collections/placeholder',
  },
]

interface ISkyHarborColl {
  id: number;
  name: string;
  first_mint_date: Date;
  addition_time: Date;
  current_mint_number: number;
  description: string;
  sys_name: string;
  card_image: string;
  banner_image: string;
  verified: boolean;
  website_link: string;
  discord_link: string;
  twitter_link: string;
}

interface ICollectionProps {
  imgUrl?: string;
  logoUrl?: string;
  title: string;
  artist: string;
  description: string;
  link: string;
}

const skyHarborAPI = 'https://skyharbor-server.net/api'

const Collection: FC<ICollectionProps> = (props) => {
  const randomInteger = (min: number, max: number) => {
    return (min + Math.random() * (max - min)).toFixed();
  };
  const rand = useMemo(() => randomInteger(1, 18), [1, 18]);
  return (
    <Grid container spacing={3} alignItems="center" sx={{ mb: '32px' }}>
      <Grid item sm={6} xs={12}>
        <Box
          sx={{
            position: 'relative',
            background: '#000',
            height: '320px',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <Image
            src={props.imgUrl ? props.imgUrl : `/images/placeholder/${rand}.jpg`}
            layout="fill"
            objectFit="cover"
            alt="placeholder"
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
          <Box
            sx={{
              mb: '24px'
            }}
          >
            <Box
              sx={{
                display: 'inline-block',
                verticalAlign: 'middle',
                mr: '8px',
                height: '32px',
                width: '32px',
                borderRadius: "32px",
                overflow: 'hidden',
              }}
            >
              <Image
                src={props.logoUrl ? props.logoUrl : `/images/placeholder/${rand}.jpg`}
                layout="fixed"
                height={32}
                width={32}
                alt="logo"
              />
            </Box>
            <Typography
              sx={{
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                display: 'inline-block',
              }}
            >
              By {props.artist}
            </Typography>
          </Box>
          <Typography variant="h5">
            {props.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: '32px',
              lineHeight: '1.5',
              whiteSpace: "normal",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "3",
              WebkitBoxOrient: "vertical",
            }}
          >
            {props.description}
          </Typography>
          <ButtonLink href={props.link} endIcon={<ArrowForwardIcon />}>
            Explore collection
          </ButtonLink>
        </Box>
      </Grid>
    </Grid>
  )
}

const Collections: NextPage = () => {
  const theme = useTheme()
  const [numberCollectionsShowing, setNumberCollectionsShowing] = useState(24)
  const apiContext = useContext<IApiContext>(ApiContext);

  const [loading, setLoading] = useState(true)
  const [skyHarborList, setSkyHarborList] = useState<any[]>([])

  useEffect(() => {
    let aggList: ICollectionRow[] = []
    const getCollectionRows = async () => {
      setLoading(true);
      try {
        const [collectionsRes, volumesRes] = await Promise.all([
          apiContext.api.get(`/collections`, skyHarborAPI),
          apiContext.api.get(`/metrics/topVolumes?limit=1000`, skyHarborAPI),
        ]);
        if (collectionsRes.data) {
          aggList = collectionsRes.data.map((item: ISkyHarborColl, i: number) => {
            if (item.verified === true) {
              return {
                rank: 9999 + i,
                collection: {
                  image: item.card_image,
                  name: item.name,
                  link: `/${item.sys_name}`,
                  sys_name: item.sys_name,
                },
                floorPrice: 0,
                volume: 0,
                items: 0,
                owners: 0,
              };
            } else {
              return null;
            }
          });
        }
        if (volumesRes.data) {
          volumesRes.data.forEach((volumeData: { collection: string; sum: string }, i: number) => {
            const aggItemIndex = aggList.findIndex((aggItem) => aggItem.collection.sys_name === volumeData.collection);
            if (aggItemIndex !== -1) {
              aggList[aggItemIndex].volume = Number(volumeData.sum) * 0.000000001;
              aggList[aggItemIndex].rank = i + 1;
            }
          });
        }
      } catch (e: any) {
        apiContext.api.error(e);
      }
      console.log(aggList)
      setSkyHarborList(aggList)
      setLoading(false);
    };
    getCollectionRows()
  }, []);

  return (
    <Container sx={{ mt: '30px', mb: '50px' }}>
      <Typography variant="h1">
        Collections
      </Typography>
      <Typography variant="body2" sx={{ mb: '48px' }}>
        Browse Ergo NFT and Fungible token collections.
      </Typography>
      <Box
        sx={{
          mb: 5,
          '& .swiper-button-next, .swiper-button-prev': {
            color: theme.palette.divider,
            '&:hover': {
              color: theme.palette.primary.main,
            }
          },
          '& .swiper-pagination-bullet': {
            background: theme.palette.text.secondary,
          },
          '& .swiper-pagination-bullet-active': {
            background: theme.palette.primary.main,
          }
        }}
      >
        <Swiper
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: true,
          }}
          loop={true}
          navigation={true}
          modules={[Pagination, Navigation, Autoplay]}
          className="mySwiper"
        >
          {featuredCollections.map((props, i) => {
            return (
              <SwiperSlide key={i}>
                <Collection
                  imgUrl={props.imgUrl}
                  logoUrl={props.logoUrl}
                  title={props.title}
                  artist={props.artist}
                  description={props.description}
                  link={props.link}
                />
              </SwiperSlide>
            )
          })}
        </Swiper>
      </Box>
      {skyHarborList.length > 0 && (
        <CollectionList
        setDisplayNumber={setNumberCollectionsShowing}
        collectionRows={skyHarborList}
      />
      )}
    </Container >
  )
}

export default Collections

const sampleRows = [
  { rank: 1, collection: { image: '/images/collections/ergopad-logo.jpg', name: 'Wrath of Gods', link: '/wrath' }, floorPrice: 10, volume: 2103, items: 3000, owners: 1475 },
  { rank: 2, collection: { image: '/images/character1.png', name: 'Cybercitizens', link: '/wrath' }, floorPrice: 0.00325, volume: 3256, items: 5000, owners: 5 },
  { rank: 3, collection: { image: '/images/character2.png', name: 'Ergnomes', link: '/wrath' }, floorPrice: 0.21, volume: 234, items: 280, owners: 22 },
  { rank: 4, collection: { image: '/images/character3.png', name: 'Inferno Black', link: '/wrath' }, floorPrice: 0.00012, volume: 666, items: 666, owners: 54 },
  { rank: 5, collection: { image: '/images/character4.png', name: 'Space Farmers', link: '/wrath' }, floorPrice: 62, volume: 723, items: 15, owners: 888888 },
  { rank: 6, collection: { image: '/images/cube1.png', name: 'WalrusDAO', link: '/wrath' }, floorPrice: 13, volume: 845, items: 873, owners: 7377 },
  { rank: 7, collection: { image: '/images/cube2.png', name: 'Mutant Apes', link: '/wrath' }, floorPrice: 20, volume: 123, items: 653, owners: 26 },
  { rank: 8, collection: { image: '/images/nft-cube.png', name: 'ErgoPixels', link: '/wrath' }, floorPrice: 70, volume: 66, items: 54, owners: 12 },
  { rank: 9, collection: { image: '/images/nft1.png', name: 'Ergo Mummies', link: '/wrath' }, floorPrice: 45, volume: 2000, items: 100000, owners: 1475 },
  { rank: 10, collection: { image: '/images/nft2.png', name: 'Aneta Angels', link: '/wrath' }, floorPrice: 12, volume: 1000, items: 5444, owners: 43 },
  { rank: 11, collection: { image: '/images/paideia-circle-logo.png', name: 'Bitmasks', link: '/wrath' }, floorPrice: 450, volume: 1500, items: 2555555, owners: 70 },
  { rank: 12, collection: { image: '/images/character1.png', name: 'Comet Degens', link: '/wrath' }, floorPrice: 28, volume: 16, items: 5252, owners: 7237 },
  { rank: 13, collection: { image: '/images/collections/ergopad-logo.jpg', name: 'Wrath of Gods', link: '/wrath' }, floorPrice: 10, volume: 2103, items: 3000, owners: 1475 },
  { rank: 14, collection: { image: '/images/character1.png', name: 'Cybercitizens', link: '/wrath' }, floorPrice: 15, volume: 3256, items: 5000, owners: 5 },
  { rank: 15, collection: { image: '/images/character2.png', name: 'Ergnomes', link: '/wrath' }, floorPrice: 12, volume: 234, items: 280, owners: 22 },
  { rank: 16, collection: { image: '/images/character3.png', name: 'Inferno Black', link: '/wrath' }, floorPrice: 100, volume: 666, items: 666, owners: 54 },
  { rank: 17, collection: { image: '/images/character4.png', name: 'Space Farmers', link: '/wrath' }, floorPrice: 62, volume: 723, items: 15, owners: 88888888 },
  { rank: 18, collection: { image: '/images/cube1.png', name: 'WalrusDAO', link: '/wrath' }, floorPrice: 13, volume: 845, items: 873, owners: 7377 },
  { rank: 19, collection: { image: '/images/cube2.png', name: 'Mutant Apes', link: '/wrath' }, floorPrice: 20, volume: 123, items: 653, owners: 26 },
  { rank: 20, collection: { image: '/images/nft-cube.png', name: 'ErgoPixels', link: '/wrath' }, floorPrice: 70, volume: 66, items: 54, owners: 12 },
  { rank: 21, collection: { image: '/images/nft1.png', name: 'Ergo Mummies', link: '/wrath' }, floorPrice: 45, volume: 2000, items: 100000, owners: 1475 },
  { rank: 22, collection: { image: '/images/nft2.png', name: 'Aneta Angels', link: '/wrath' }, floorPrice: 12, volume: 1000, items: 5444, owners: 43 },
  { rank: 23, collection: { image: '/images/paideia-circle-logo.png', name: 'Bitmasks', link: '/wrath' }, floorPrice: 450, volume: 1500, items: 2555555, owners: 70 },
  { rank: 24, collection: { image: '/images/character1.png', name: 'Comet Degens', link: '/wrath' }, floorPrice: 28, volume: 16, items: 5252, owners: 7237 },
  { rank: 25, collection: { image: '/images/collections/ergopad-logo.jpg', name: 'Wrath of Gods', link: '/wrath' }, floorPrice: 10, volume: 2103, items: 3000, owners: 1475 },
  { rank: 26, collection: { image: '/images/character1.png', name: 'Cybercitizens', link: '/wrath' }, floorPrice: 15, volume: 3256, items: 5000, owners: 5 },
  { rank: 27, collection: { image: '/images/character2.png', name: 'Ergnomes', link: '/wrath' }, floorPrice: 12, volume: 234, items: 280, owners: 22 },
  { rank: 28, collection: { image: '/images/character3.png', name: 'Inferno Black', link: '/wrath' }, floorPrice: 100, volume: 666, items: 666, owners: 54 },
  { rank: 29, collection: { image: '/images/character4.png', name: 'Space Farmers', link: '/wrath' }, floorPrice: 62, volume: 723, items: 15, owners: 888888 },
  { rank: 30, collection: { image: '/images/cube1.png', name: 'WalrusDAO', link: '/wrath' }, floorPrice: 13, volume: 845, items: 873, owners: 7377 },
  { rank: 31, collection: { image: '/images/cube2.png', name: 'Mutant Apes', link: '/wrath' }, floorPrice: 20, volume: 123, items: 653, owners: 26 },
  { rank: 32, collection: { image: '/images/nft-cube.png', name: 'ErgoPixels', link: '/wrath' }, floorPrice: 70, volume: 66, items: 54, owners: 12 },
  { rank: 33, collection: { image: '/images/nft1.png', name: 'Ergo Mummies', link: '/wrath' }, floorPrice: 45, volume: 2000, items: 100000, owners: 1475 },
  { rank: 34, collection: { image: '/images/nft2.png', name: 'Aneta Angels', link: '/wrath' }, floorPrice: 12, volume: 1000, items: 5444, owners: 43 },
  { rank: 35, collection: { image: '/images/paideia-circle-logo.png', name: 'Bitmasks', link: '/wrath' }, floorPrice: 450, volume: 1500, items: 2555555, owners: 70 },
  { rank: 36, collection: { image: '/images/character1.png', name: 'Comet Degens', link: '/wrath' }, floorPrice: 28, volume: 16, items: 5252, owners: 7237 },
];