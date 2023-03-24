// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage } from 'nft.storage'

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