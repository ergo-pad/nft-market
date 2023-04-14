import axios from 'axios';

/**
 * This uses nautilus source code from github parses it to figure out what the logo url will be.
 */

export const ASSET_URL = 'https://raw.githubusercontent.com/capt-nemo429/nautilus-wallet/master/public/icons/assets'
const MAPPER =
  'https://raw.githubusercontent.com/capt-nemo429/nautilus-wallet/master/src/mappers/assetIconMap.ts';
const ADDRESS_MAPPER_STORAGE_KEY = 'nautilus_address_mapper_324';
const TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

const getRawNautilusAddressMapper = async () => {
  try {
    if (localStorage.getItem(ADDRESS_MAPPER_STORAGE_KEY)) {
      const res = JSON.parse(
        localStorage.getItem(ADDRESS_MAPPER_STORAGE_KEY)
      );
      if (res.timeout > Date.now()) {
        return res.data;
      }
    }
    const res = await axios.get(MAPPER);
    const store = {
      timeout: Date.now() + TIMEOUT,
      data: res.data,
    };
    localStorage.setItem(ADDRESS_MAPPER_STORAGE_KEY, JSON.stringify(store));
    return res.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getNautilusAddressMapper = async () => {
  try {
    const rawMapper = await getRawNautilusAddressMapper();
    const json = JSON.parse(
      rawMapper
        .split('=')[1]
        .replaceAll('ERG_TOKEN_ID', '"ergid"')
        .replaceAll(/\[|\]|;/g, '')
    );
    return json;
  } catch (e) {
    console.log(e);
    return {};
  }
};
