import axios from 'axios'
import { getArtist } from './get-artist';

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
  amount: number;
  amountUSD: number;
  bx?: { address: string; txId: string | undefined; outputTransactionId: string; }
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

function assetListArray(data: any) {
  const tokenObject = data.tokens;
  const keys = Object.keys(tokenObject);
  const res = [];
  for (let i = 0; i < keys.length; i++) {
    const token = tokenObject[keys[i]];
    const amount = +(parseFloat(token.amount) * Math.pow(10, -token.decimals));
    const price = token.price * amount;
    const obj = {
      token: token.name ? token.name.substring(0, 3).toUpperCase() : '',
      name: token.name ? token.name : '',
      id: token.tokenId,
      amount: amount,
      amountUSD: price,
    };
    res.push(obj);
  }
  const ergoValue = {
    token: 'ERG',
    name: 'Ergo',
    id: 'ergid',
    amount: data.balance,
    amountUSD: data.price * data.balance,
  };
  res.unshift(ergoValue);
  return res;
}

const getIssuingBoxPromise = (id: string) => {
  const box = localStorage.getItem(generateIssueingBoxStorageKey(id));
  if (box === null) {
    return axios
      .get(`https://api.ergoplatform.com/api/v0/assets/${id}/issuingBox`)
      .catch((err) => {
        console.log("ERROR FETCHING: ", err);
      });
  }
  return JSON.parse(box);
};

const generateIssueingBoxStorageKey = (id: string) => {
  return `issuing_box_${id}_87126`;
};

const setIssuingBox = (id: string, res: { data: any; }) => {
  if (res?.data) {
    localStorage.setItem(
      generateIssueingBoxStorageKey(id),
      JSON.stringify(res)
    );
  }
};

function toUtf8String(hex: string) {
  if (!hex) {
    hex = '';
  }
  var str = '';
  for (var i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

export function resolveIpfs(url: string) {
  const ipfsPrefix = 'ipfs://';
  if (!url.startsWith(ipfsPrefix) && url.startsWith('http://')) return 'https://' + url.substring(7);
  else if (!url.startsWith(ipfsPrefix)) return url;
  else return url.replace(ipfsPrefix, `https://cloudflare-ipfs.com/ipfs/`);
}

export async function getWalletData(addresses: string[]): Promise<IAssetList | undefined> {
  const balances = await axios
    .post(`${process.env.ERGOPAD_API}/asset/balances/`, {
      addresses: addresses,
    })
    .catch((err) => {
      console.log('ERROR FETCHING: ', err);
      return {
        data: {
          assets: [],
          audioNfts: [],
          imgNfts: [],
        },
      };
    });
  const balance = reduceBalances(balances.data);

  if (balance) {
    // create list of assets
    const initialAssetList = assetListArray(balance);

    const newImgNftList: any[] = [];
    const newAudNftList: any[] = [];
    const newAssetList = [];

    /**
     * Collect promises from ergoplatform and resolve them asynchronously
     */
    const assetListPromises = [];
    const indexMapper: { [key: string]: number } = {};
    for (let i = 0; i < initialAssetList.length; i++) {
      if (initialAssetList[i].id != 'ergid') {
        const promise = getIssuingBoxPromise(initialAssetList[i].id);
        indexMapper[initialAssetList[i].id] = i;
        assetListPromises.push(promise);
      } else {
        newAssetList[newAssetList.length] = initialAssetList[i];
      }
    }

    // resolve the promises
    const resolvedAssetList = await Promise.all(assetListPromises);
    resolvedAssetList.forEach((res) => {
      if (res?.data) {
        const data = res?.data;
        const i = indexMapper[data[0].assets[0].tokenId];
        // cache issuing box
        setIssuingBox(initialAssetList[i].id, res);
        const tokenObject = {
          name: data[0].assets[0].name,
          ch: data[0].creationHeight,
          description: toUtf8String(data[0].additionalRegisters.R5).substring(2),
          r7: data[0].additionalRegisters.R7,
          r9: data[0].additionalRegisters?.R9
            ? resolveIpfs(toUtf8String(data[0].additionalRegisters?.R9).substring(2))
            : undefined,
          r5: toUtf8String(data[0].additionalRegisters.R5).substring(2),
          ext: toUtf8String(data[0].additionalRegisters.R9)
            .substring(2)
            .slice(-4),
          token: initialAssetList[i].token,
          id: initialAssetList[i].id,
          amount: initialAssetList[i].amount,
          amountUSD: initialAssetList[i].amountUSD
            ? initialAssetList[i].amountUSD
            : '',
        };

        // if audio NFT
        if (
          tokenObject.ext == '.mp3' ||
          tokenObject.ext == '.ogg' ||
          tokenObject.ext == '.wma' ||
          tokenObject.ext == '.wav' ||
          tokenObject.ext == '.aac' ||
          tokenObject.ext == 'aiff' ||
          tokenObject.r7 == '0e020102'
        ) {
          newAudNftList[newAudNftList.length] = tokenObject;
        }
        // if image NFT
        else if (
          tokenObject.ext == '.png' ||
          tokenObject.ext == '.gif' ||
          tokenObject.ext == '.jpg' ||
          tokenObject.ext == 'jpeg' ||
          tokenObject.ext == '.bmp' ||
          tokenObject.ext == '.svg' ||
          tokenObject.ext == '.raf' ||
          tokenObject.ext == '.nef' ||
          tokenObject.r7 == '0e020101' ||
          tokenObject.r7 == '0e0430313031'
        ) {
          newImgNftList[newImgNftList.length] = tokenObject
        } else {
          newAssetList[newAssetList.length] = tokenObject;
        }
      }
    });

    return {
      assets: newAssetList,
      audioNfts: newAudNftList,
      imgNfts: newImgNftList
    }
  }
}


