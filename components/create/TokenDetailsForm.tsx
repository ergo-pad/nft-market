import React, { FC, useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
} from '@mui/material'
import { v4 as uuidv4 } from 'uuid';
import RaritySection from '@components/create/RaritySection'
import TraitSection from '@components/create/TraitSection';
import PackTokenSection from '@components/create/PackTokenSection';
import NftSection from '@components/create/NftSection';

export interface IRarityData {
  rarity: string;
  id: string;
  description?: string;
  image?: string;
}

export interface ITraitsData {
  traitName: string; // the name of the trait type (eg: sex, speed, age)
  id: string;
  description?: string; // used only on our front-end and not required
  image?: string; // this is only used on our front-end and not required. 
  type: 'Property' | 'Level' | 'Stat';
  max?: number; // if trait is a Level or Stat, this is the highest possible value
}

export interface IRoyaltyItem {
  id: string;
  address: string;
  pct: number;
}

export interface IPackData {
  id: string;
  packName: string;
  amountOfPacks: number;
  nftPerPack: {
    id: string;
    count: number | '';
    probabilities?: {
      rarityName: string;
      probability: number;
    }[]
  }[]
  price: number | '';
  currency: string;
}

export interface INftData {
  id: string;
  nftName: string;
  image: string;
  description?: string;
  traits?: {
    key: string; // the name of the trait type (eg: sex, speed, age)
    value: string | number; // the trait that this specific NFT has
    type: 'Property' | 'Level' | 'Stat';
    id: string;
    max?: number;
  }[];
  rarity?: string;
  explicit: boolean; // default is false
  royalties?: {
    address: string;
    pct: number;
    id: string;
  }[]
  royaltyLocked: boolean; // default is false
};

export interface ITokenDetailsData {
  packs: IPackData[];
  nfts: INftData[];
  rarities: IRarityData[];
  availableTraits: ITraitsData[];
}

export const packTokenDataInit: IPackData = {
  id: uuidv4(),
  packName: '',
  amountOfPacks: 1,
  nftPerPack: [
    {
      id: uuidv4(),
      count: 1,
      probabilities: [
        {
          rarityName: '',
          probability: 1
        }
      ]
    }
  ],
  price: '',
  currency: 'SigUSD',
}

export const tokenDetailsDataInit: ITokenDetailsData = {
  packs: [packTokenDataInit],
  nfts: [],
  rarities: [
    {
      rarity: '',
      id: uuidv4(),
      description: '',
      // image: '',
    }
  ],
  availableTraits: [
    {
      traitName: '', // the name of the trait type (eg: sex, speed, age)
      id: uuidv4(),
      description: '', // used only on our front-end and not required
      // image: '', // this is only used on our front-end and not required. 
      type: 'Property',
      // max: 1, // if trait is a Level or Stat, this is the highest possible value
    }
  ],
}

interface ITokenDetailsProps {
  tokenDetailsData: ITokenDetailsData;
  setTokenDetailsData: React.Dispatch<React.SetStateAction<ITokenDetailsData>>;
  clearForm: boolean;
  setClearForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const TokenDetails: FC<ITokenDetailsProps> = ({ tokenDetailsData, setTokenDetailsData, clearForm, setClearForm }) => {
  // const theme = useTheme()
  const [rarityData, setRarityData] = useState<IRarityData[]>(tokenDetailsDataInit.rarities)
  const [traitData, setTraitData] = useState<ITraitsData[]>(tokenDetailsDataInit.availableTraits)
  const [clearTriggerNftImages, setClearTriggerNftImages] = useState(false)
  const [packTokenData, setPackTokenData] = useState([packTokenDataInit])
  const [nftData, setNftData] = useState<INftData[]>([])

  useEffect(() => {
    setTokenDetailsData(prev => ({ ...prev, rarities: rarityData }))
  }, [JSON.stringify(rarityData)])
  useEffect(() => {
    const timeout = setTimeout(() => setTokenDetailsData(prev => ({ ...prev, availableTraits: traitData })), 400);
    return () => clearTimeout(timeout);
  }, [JSON.stringify(traitData)])
  useEffect(() => {
    const timeout = setTimeout(() => setTokenDetailsData(prev => ({ ...prev, packs: packTokenData })), 400);
    return () => clearTimeout(timeout);
  }, [JSON.stringify(packTokenData)])
  useEffect(() => {
    setTokenDetailsData(prev => ({ ...prev, nfts: nftData }))
  }, [JSON.stringify(nftData)])

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setTokenDetailsData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  // }
  // useEffect(() => {

  // }, [JSON.stringify(nftImages)])

  // CLEAR FORM //
  useEffect(() => {
    setClearTriggerNftImages(true) // this is a trigger to update child state
    setRarityData(tokenDetailsDataInit.rarities) // this is a local state
    setTraitData(tokenDetailsDataInit.availableTraits) // this is a local state
    setPackTokenData([packTokenDataInit])
    setTokenDetailsData(tokenDetailsDataInit) // this belongs to parent
    setClearForm(false)
  }, [clearForm])

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">
          Token details
        </Typography>
        <RaritySection
          data={rarityData}
          setData={setRarityData}
        />
        <PackTokenSection
          data={packTokenData}
          setData={setPackTokenData}
          rarityData={rarityData}
        />
        <TraitSection
          data={traitData}
          setData={setTraitData}
        />
        <NftSection
          rarityData={rarityData}
          traitData={traitData}
          nftData={nftData}
          setNftData={setNftData}
          clearTriggerNftImages={clearTriggerNftImages}
          setClearTriggerNftImages={setClearTriggerNftImages}
        />
      </Box>

      <Button onClick={() => console.log(tokenDetailsData)}>Console log data</Button>
      <Button onClick={() => setClearForm(true)}>Clear Form</Button>
    </Box>
  );
};

export default TokenDetails;