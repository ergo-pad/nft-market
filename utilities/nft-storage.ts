// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage } from 'nft.storage'

import axios from 'axios'
import { IFileData } from '@components/forms/FileUploadAreaIpfs'

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY

/**
  * Adds a file to nftstorage using Blob
  * @param {File} image the image file blob
  */
export const storeNFT = (image: File) => {
  // create a new NFTStorage client using the API key
  if (NFT_STORAGE_KEY === undefined) return console.error('Failed to upload to nft.storage: No API key in environment file.')
  else {
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })
    const result = nftstorage.storeBlob(image)

    // call client.store, passing in the image & metadata
    return result
  }
}

export const ipfsUpload = async (fileData: IFileData, onProgress: (progressEvent: ProgressEvent) => void) => {
  try {
    const formData = new FormData();
    formData.append("fileobject", fileData.currentFile, fileData.currentFile.name);
    let newProgressEvent: any = {}
    const res = await axios.post(
      `${process.env.API_URL}/nft/upload_file`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          newProgressEvent = { ...progressEvent, loaded: 50, total: 100 }
          onProgress(newProgressEvent);
        },
      }
    );

    const url = res.data.url;
    const ipfs = res.data.url.replace("https://cloudflare-ipfs.com/ipfs/", "ipfs://");
    onProgress({ ...newProgressEvent, loaded: 100, total: 100 });

    return { url, ipfs }
  } catch (e) {
    console.log(e);
  }
};
