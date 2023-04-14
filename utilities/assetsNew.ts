import axios from 'axios'

export interface IAssetList {
  assets: IToken[],
  audioNfts: IToken[],
  imgNfts: IToken[],
}

interface IBalances {
  addresses: {
    [key: string]: {
      balance: number;
      tokens:
      {
        tokenId: string;
        amount: number;
        decimals: number;
        name: string;
        tokenType: string;
        price: number;
      }[]
    }
  },
  total: number;
  price: number;
}

export interface IToken {
  name: string;
  ch?: number;
  description?: string;
  r7?: string;
  r9?: string;
  r5?: string;
  ext?: string;
  token: string;
  id: string;
  amount?: number;
  amountUSD?: number;
  bx?: { address: string; txId: string | undefined; outputTransactionId: string; }
  type?: string;
  remainingVest?: number;
}

const reduceBalances = (balances: IBalances) => {
  try {
    if (Object.keys(balances).length === 0) {
      return null;
    }
    const ret: {
      balance: number;
      tokens: {
        tokenId: string;
        amount: number;
        decimals: number;
        name: string;
        tokenType: string;
        price: number;
      }[];
      price: number
    } = {
      balance: 0,
      tokens: [],
      price: 1,
    };
    // aggregate amount of Ergo across all addresses
    const ergo = Object.keys(balances.addresses)
      .map((address) => balances.addresses[address].balance ?? 0.0)
      .reduce((a, c) => a + c, 0);
    ret.balance = ergo;
    ret.price = balances.price;
    // aggregate tokens
    const tokenMap: {
      [key: string]: {
        tokenId: string;
        amount: number;
        decimals: number;
        name: string;
        tokenType: string;
        price: number;
      }
    } = {};
    Object.keys(balances.addresses).forEach((address) => {
      const tokens = balances.addresses[address].tokens ?? [];
      tokens.forEach((token) => {
        if (tokenMap[token.tokenId]) {
          tokenMap[token.tokenId].amount += token.amount;
        } else {
          tokenMap[token.tokenId] = token;
        }
      });
    });
    const tokens = Object.values(tokenMap);
    ret.tokens = tokens;
    return ret;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getAssetInfo = (id: string) => {
  const box = localStorage.getItem(generateAssetInfoStorageKey(id));
  if (box === null) {
    return axios
      .get(`${process.env.ERGOPAD_API}/asset/info/${id}`)
      .catch((err) => {
        console.log("ERROR FETCHING: ", err);
      });
  }
  return JSON.parse(box);
};

const generateAssetInfoStorageKey = (id: string) => {
  return `token_info_${id}_81151`;
};

const setAssetInfo = (id: string, res: { data: any; }) => {
  if (res?.data) {
    localStorage.setItem(
      generateAssetInfoStorageKey(id),
      JSON.stringify(res)
    );
  }
};

export const getWalletList = async (addresses: string[]): Promise<any> => {
  const balances = await axios
    .post(`${process.env.ERGOPAD_API}/asset/balances/`, {
      addresses: addresses,
    })
    .catch((err) => {
      console.log('ERROR FETCHING: ', err);
      return {
        data: {},
      };
    });
  const balance = reduceBalances(balances.data);
  if (balance) return balance.tokens
  else return []
}

export const tokenListInfo = async (tokens: any[]) => {
  // create list of assets
  const initialAssetList = await Promise.all(tokens.map(async (item, i) => {
    const res = await getAssetInfo(item.tokenId);
    if (res?.data) {
      setAssetInfo(item.tokenId, res)
      return {
        ...item,
        description: res.data.description,
        type: res.data.nftType,
        artist: res.data.minterAddress,
        imgUrl: res.data.extraMetaData?.link,
        collection: res.data.extraMetaData?.standard2Data?.collection?.name,
        loading: false
      }
    }
    return item;
  }));
  return initialAssetList
}