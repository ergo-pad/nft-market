import React, { FC, useState, useEffect } from "react";
import { Grid, Typography, Box, Button, Switch, useTheme } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FileUploadAreaIpfs from "@components/forms/FileUploadAreaIpfs";
import { v4 as uuidv4 } from "uuid";
import { useCSVReader } from "react-papaparse";
import { IFileUrl } from "@components/forms/FileUploadArea";
import {
  ITraitsData,
  INftData,
  IRoyaltyItem,
} from "@components/create/TokenDetailsForm";
import { IRarityData } from "@pages/mint";
import NftItem from "@components/create/NftItem";
import RoyaltySection from "@components/create/RoyaltySection";

interface INftSectionProps {
  rarityData: IRarityData[];
  traitData: ITraitsData[];
  nftData: INftData[];
  setNftData: React.Dispatch<React.SetStateAction<INftData[]>>;
  clearTriggerNftImages: boolean;
  setClearTriggerNftImages: React.Dispatch<React.SetStateAction<boolean>>;
  fungible: boolean;
  setFungible: React.Dispatch<React.SetStateAction<boolean>>;
}

const NftSection: FC<INftSectionProps> = ({
  rarityData,
  traitData,
  nftData,
  setNftData,
  clearTriggerNftImages,
  setClearTriggerNftImages,
  fungible,
  setFungible,
}) => {
  const theme = useTheme();
  const { CSVReader } = useCSVReader();
  const [csvUpload, setCsvUpload] = useState({});
  const [nftImages, setNftImages] = useState<IFileUrl[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<{ [key: string]: string }>(
    {}
  );
  const [royaltyData, setRoyaltyData] = useState<IRoyaltyItem[]>([
    {
      address: "",
      pct: 0,
      id: uuidv4(),
    },
  ]);
  const [openAllRoyaltiesWarningDialog, setOpenAllRoyaltiesWarningDialog] =
    useState(false);

  const toggleFungible = () => {
    setFungible(!fungible);
  };

  useEffect(() => {
    setNftData((prev) =>
      prev.map((item, i) => {
        if (item.royaltyLocked) return item;
        else
          return {
            ...item,
            royalties: royaltyData,
          };
      })
    );
  }, [royaltyData]);

  const allRoyaltiesWarningDialog = () => {
    setOpenAllRoyaltiesWarningDialog(true);
  };

  const handleCloseAllRoyaltiesWarningDialog = () => {
    setOpenAllRoyaltiesWarningDialog(false);
  };

  const updateAllRoyalties = () => {
    setNftData((prev) =>
      prev.map((item, i) => {
        return {
          ...item,
          royalties: royaltyData,
          royaltyLocked: false,
        };
      })
    );
    handleCloseAllRoyaltiesWarningDialog();
  };

  useEffect(() => {
    nftImages.map((item) => {
      const filter = nftData.filter((nft) => nft.image === item.ipfs);
      if (filter.length > 0) return;
      else {
        const uuid = uuidv4();
        setNftData((prev) => [
          ...prev,
          {
            id: uuid,
            nftName: "",
            image: item.ipfs,
            qty: 1,
            description: "",
            traits: [
              {
                key: "", // the name of the trait type (eg: sex, speed, age)
                value: "", // the trait that this specific NFT has
                type: "Property",
                id: uuidv4(),
              },
            ],
            rarity: "",
            explicit: false, // default is false
            royalties: royaltyData,
            royaltyLocked: false,
          },
        ]);
        setUploadedUrls((prev) => ({ ...prev, [uuid]: item.url }));
      }
      return;
    });
  }, [nftImages]);

  useEffect(() => {
    if (clearTriggerNftImages === true) {
      setNftImages([]);
      setNftData([]);
      setUploadedUrls(prevState => {return {}})
      // setClearTriggerNftImages(false); 
      // don't do that here, it's done in the FileUploadArea which is a generally used component. 
    }
  }, [clearTriggerNftImages]);

  return (
    <Box>
      <Typography variant="h5">Provide CSV for Metadata</Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
        You can upload a CSV file to automatically set metadata for the NFTs you
        will upload. Download a sample CSV below which will include headings for
        the traits you set previously.
      </Typography>
      <Box
        sx={{
          mb: "24px",
        }}
      >
        <CSVReader
          onUploadAccepted={(results: any) => {
            setCsvUpload(results);
          }}
        >
          {({
            getRootProps,
            acceptedFile,
            ProgressBar,
            getRemoveFileProps,
          }: any) => (
            <>
              <Grid container sx={{ flexWrap: "nowrap", height: "56px" }}>
                <Grid item sx={{ flexGrow: "0" }}>
                  <Button
                    variant="contained"
                    disableElevation
                    {...getRootProps()}
                    sx={{
                      borderRadius: "6px 0 0 6px",
                      background: theme.palette.divider,
                      color: theme.palette.text.secondary,
                      display: "inline-block",
                      height: "100%",
                    }}
                  >
                    Browse file
                  </Button>
                </Grid>
                <Grid item sx={{ flexGrow: "1" }}>
                  <Box
                    type="button"
                    {...getRootProps()}
                    sx={{
                      display: "inline-block",
                      background:
                        theme.palette.mode == "dark"
                          ? "#242932"
                          : theme.palette.background.paper,
                      height: "100%",
                      width: "100%",
                      p: "12px",
                      verticalAlign: "middle",
                      "&:hover": {
                        background: theme.palette.divider,
                        cursor: "pointer",
                      },
                    }}
                  >
                    {acceptedFile && acceptedFile.name}
                  </Box>
                </Grid>
                <Grid item sx={{ flexGrow: "0" }}>
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      borderRadius: "0 6px 6px 0",
                      background: theme.palette.divider,
                      color: theme.palette.text.secondary,
                      display: "inline-block",
                      height: "100%",
                    }}
                    {...getRemoveFileProps()}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>

              <ProgressBar
                style={{ backgroundColor: theme.palette.primary.main }}
              />
            </>
          )}
        </CSVReader>

        <Button onClick={() => console.dir(csvUpload)}>
          Console log upload results
        </Button>
      </Box>

      <Typography variant="h5">Royalties</Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
        You can set royalties for all NFTs here. NFTs with custom royalties will
        retain them unless you use the &quot;Update All&quot; button below.
      </Typography>
      <RoyaltySection data={royaltyData} setData={setRoyaltyData} />
      <Box
        sx={{
          mb: "24px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <Button variant="contained" onClick={allRoyaltiesWarningDialog}>
          Update All NFT Royalties
        </Button>
      </Box>

      <Typography variant="h5">Upload Images</Typography>
      <FileUploadAreaIpfs
        multiple
        ipfsFlag
        title="NFT Images"
        fileUrls={nftImages}
        setFileUrls={setNftImages}
        clearTrigger={clearTriggerNftImages}
        setClearTrigger={setClearTriggerNftImages}
      />

      <Box sx={{ my: "24px" }}>
        <Grid
          container
          alignItems="center"
          sx={{
            width: "100%",
            mb: "0px",
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => toggleFungible()}
        >
          <Grid item xs>
            <Typography variant="h5" sx={{ verticalAlign: "middle" }}>
              Fungibility
            </Typography>
          </Grid>
          <Grid item xs="auto">
            <Typography
              sx={{
                display: "inline-block",
                mr: "6px",
                verticalAlign: "middle",
                color: fungible
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
              }}
            >
              Enable
            </Typography>
            <Switch
              focusVisibleClassName=".Mui-focusVisible"
              disableRipple
              checked={fungible}
            />
          </Grid>
        </Grid>
        <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
          Select this box to enable fungible tokens. This is useful if you are
          selling trading cards or other tokens which will have more than one
          copy of each token.
        </Typography>
      </Box>

      <Typography variant="h5">NFT Details</Typography>
      {nftData.map((item, i) => {
        return (
          <NftItem
            rarityData={rarityData}
            traitData={traitData}
            nftData={nftData}
            setNftData={setNftData}
            nftImageUrls={uploadedUrls}
            setNftImageUrls={setUploadedUrls}
            index={i}
            key={i}
            id={item.id}
            royaltyData={royaltyData}
            fungible={fungible}
          />
        );
      })}
      <Button
        onClick={() => {
          console.log(nftImages);
        }}
      >
        Console Log nftImage
      </Button>
      <Dialog
        open={openAllRoyaltiesWarningDialog}
        onClose={setOpenAllRoyaltiesWarningDialog}
        aria-labelledby="alert-all-royalties-warning"
        aria-describedby="alert-all-royalties-warning-description"
      >
        <DialogTitle id="alert-all-royalties-warning-title">
          {"WARNING: Updating ALL Royalties"}
        </DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <Box sx={{ mb: "12px" }}>
            This will remove any custom royalties you set, and make all NFTs
            have the same royalty settings.
          </Box>
          <Box>You cannot undo this action!</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={updateAllRoyalties}>Okay</Button>
          <Button onClick={handleCloseAllRoyaltiesWarningDialog} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NftSection;
