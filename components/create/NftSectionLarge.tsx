import React, { FC, useState, useEffect } from "react";
import { Grid, Typography, Box, Button, Switch, useTheme, CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FileUploadAreaIpfs from "@components/forms/FileUploadAreaIpfs";
import { v4 as uuidv4 } from "uuid";
import { useCSVReader, useCSVDownloader } from "react-papaparse";
import { IFileUrl } from "@components/forms/FileUploadArea";
import {
  ITraitsData,
  INftData,
  IRoyaltyItem,
} from "@components/create/TokenDetailsForm";
import { IRarityData } from "@pages/mint";
import NftItem from "@components/create/NftItem";
import RoyaltySection from "@components/create/RoyaltySection";
import { ITokenDetailsData } from '@pages/mint';
import { resolveIpfs } from "@utils/assetsNew";
import { DataGrid, GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';

interface INftSectionProps {
  rarityData: IRarityData[];
  setRarityData: React.Dispatch<React.SetStateAction<IRarityData[]>>;
  traitData: ITraitsData[];
  setTraitData: React.Dispatch<React.SetStateAction<ITraitsData[]>>;
  nftData: INftData[];
  setNftData: React.Dispatch<React.SetStateAction<INftData[]>>;
  clearTriggerNftImages: boolean;
  setClearTriggerNftImages: React.Dispatch<React.SetStateAction<boolean>>;
  fungible: boolean;
  setFungible: React.Dispatch<React.SetStateAction<boolean>>;
  tokenDetailsData: ITokenDetailsData;
}

const NftSection: FC<INftSectionProps> = ({
  rarityData,
  setRarityData,
  traitData,
  setTraitData,
  nftData,
  setNftData,
  clearTriggerNftImages,
  setClearTriggerNftImages,
  fungible,
  setFungible,
  tokenDetailsData
}) => {
  const theme = useTheme();
  const { CSVReader } = useCSVReader();
  const [csvUpload, setCsvUpload] = useState<{ data: any[], errors: any[], meta: any[] }>({
    data: [],
    errors: [],
    meta: []
  });
  const [nftImages, setNftImages] = useState<IFileUrl[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<{ [key: string]: string }>({});
  const [backdrop, setBackdrop] = useState(false)
  const [royaltyData, setRoyaltyData] = useState<IRoyaltyItem[]>([
    {
      address: "",
      pct: 0,
      id: uuidv4(),
    },
  ]);
  const [openAllRoyaltiesWarningDialog, setOpenAllRoyaltiesWarningDialog] =
    useState(false);
  const { CSVDownloader, Type } = useCSVDownloader();
  const [header, setHeader] = useState<GridColDef[]>([])

  const toggleFungible = () => {
    setFungible(!fungible);
  };

  // useEffect(() => {
  //   setNftData((prev) =>
  //     prev.map((item, i) => {
  //       if (item.royaltyLocked) return item;
  //       else
  //         return {
  //           ...item,
  //           royalties: royaltyData,
  //         };
  //     })
  //   );
  // }, [royaltyData]);

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
      else { // if image not already displayed, add a new one. 
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
      setUploadedUrls(prevState => { return {} })
      // setClearTriggerNftImages(false); 
      // don't do that here, it's done in the FileUploadArea which is a component used elsewhere. 
      setRoyaltyData([{
        address: "",
        pct: 0,
        id: uuidv4(),
      }])
    }
  }, [clearTriggerNftImages]);

  const [render, setRender] = useState(false)
  const [newNftData, setNewNftData] = useState<INftData[]>([])

  const parseData = (data: ITokenDetailsData, royaltyData: IRoyaltyItem[]) => {
    const traitsFields = data.availableTraits.map((item, i) => {
      return "traits." + i + "." + item.traitName + "." + item.type
    })
    const maxLength = data.nfts.reduce((acc, item) => {
      if (item.royalties !== undefined) {
        const len = item.royalties.length;
        return len > acc ? len : acc;
      }
      else return acc
    }, 1);
    const higherNumber = Math.max(maxLength, royaltyData.length);
    const royaltiesFields = Array.from({ length: higherNumber }, (_, i) => [
      "royalties." + i + ".address",
      "royalties." + i + ".pct"
    ]).flat()
    const nftData = data.nfts.map((item, i) => {
      if (item.royaltyLocked)
        return [
          item.nftName,
          item.image,
          item.qty,
          item.description,
          ...traitsFields.map((_, i) => { return item.traits ? item.traits[i]?.value : "" }),
          item.rarity,
          item.explicit ? item.explicit : "false",
          ...royaltyData.flatMap((royalty, i) => {
            return item.royalties !== undefined && item.royalties[i].address !== "" ?
              [item.royalties[i].address, item.royalties[i].pct] : [royalty.address, royalty.pct]
          })
        ].flat()
    })

    return {
      "fields": [
        "nftName",
        "image",
        "qty",
        "description",
        ...traitsFields,
        "rarity",
        "explicit",
        ...royaltiesFields,
      ],
      "data": nftData
    }
  }

  const handleCSV = (csvString: string[], expectedHeader: string[]) => {
    const csvHeader = Array.isArray(csvString[0]) ? csvString[0] : csvString[0].split(',');
    console.log(csvHeader)
    if (!expectedHeader.every((item) => {
      if (item.includes('traits') || item.includes('royalties')) return true
      else return csvHeader.includes(item)
    })) {
      console.log('Expected: ')
      console.log(expectedHeader)
      console.log('Uploaded: ')
      console.log(csvHeader);
      return;
    }

    const nfts = csvString.map((line: string, i: number) => {
      if (i > 0) {
        const nftObject: any = {
          id: uuidv4(),
        };

        csvHeader.forEach((header, index) => {
          if (header.startsWith('traits.')) {
            const traitKey = header.split(".")[2]
            const traitType = header.split(".")[3]
            nftObject.traits = nftObject.traits || [];
            nftObject.traits.push({
              key: traitKey,
              value: line[index],
              type: traitType,
              id: uuidv4(),
            });
          } else if (header.startsWith('royalties.')) {
            const i = Number(header.split(".")[1])
            const key = header.split(".")[2]
            if (line[index] !== '') {
              nftObject.royalties = nftObject.royalties || [];
              nftObject.royalties[i] = {
                ...nftObject.royalties[i],
                [key]: line[index],
                id: key === "address" ? uuidv4() : nftObject.royalties[i].id
              }
            }
          } else if (header === 'rarity') {
            nftObject.rarity = line[index];
          } else if (header === 'explicit') {
            nftObject.explicit = line[index].toLowerCase() === 'true' ? true : false;
          } else if (header === 'royaltyLocked') {
            nftObject.royaltyLocked = line[index].toLowerCase() === 'true' ? true : false;
          } else {
            nftObject[header] = line[index];
          }
        });

        return nftObject;
      }
    }).filter(Boolean);

    console.log(nfts)
    return nfts;
  }

  const onCsvUpload = (results: { data: any[], errors: any[], meta: any[] }) => {
    const header = parseData(tokenDetailsData, royaltyData)
    const importedNftData = handleCSV(results.data, header.fields)
    if (importedNftData) {
      setBackdrop(true)
      const rarities = importedNftData.reduce((acc, obj) => {
        if (!acc.includes(obj.rarity)) {
          acc.push(obj.rarity);
        }
        return acc;
      }, []).map((item: string) => {
        return {
          rarity: item,
          id: uuidv4()
        }
      });
      const availableTraits: ITraitsData[] = results.data[0].flatMap((item: string, i: number) => {
        if (item.startsWith('traits.')) {
          const traitKey = item.split(".")[2]
          // @ts-ignore
          const traitType: "Property" | "Level" | "Stat" = ["Level", "Stat"].includes(item.split(".")[3]) ? item.split(".")[3] : "Property"
          return {
            traitName: traitKey,
            type: traitType,
            id: uuidv4(),
          }
        }
        else return []
      })
      const royalties: IRoyaltyItem[] = importedNftData.find(item => !item.royaltyLocked).royalties
      const hasQtyGreaterThanOne = importedNftData.some(item => parseInt(item.qty) > 1);
      if (hasQtyGreaterThanOne) setFungible(true)
      setRarityData(rarities)
      setTraitData(availableTraits)
      royalties !== undefined && royalties.length > 0 && setRoyaltyData(royalties)
      setNewNftData(importedNftData)
      setNftImages(importedNftData.map((item) => {
        return {
          ipfs: item.image,
          url: resolveIpfs(item.image)
        }
      }))
      setRender(true)
    }
  }

  useEffect(() => {
    if (csvUpload.data.length > 0) {
      onCsvUpload(csvUpload)
    }
  }, [csvUpload])

  useEffect(() => {
    setUploadedUrls(newNftData.reduce((acc: { [key: string]: any }, item) => {
      acc[item.id] = resolveIpfs(item.image);
      return acc;
    }, {}));
    const timer = setTimeout(() => {
      setNftData(newNftData)
      setRender(false)
      setBackdrop(false)
    }, 5000);
    return () => clearTimeout(timer);
  }, [render])

  return (
    <Box>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          opacity: backdrop ? '1' : '0',
          width: '100vw',
          height: '100vh',
          background: 'rgba(24,28,33,1)',
          zIndex: 999,
          color: '#fff',
          transition: 'opacity 500ms',
          pointerEvents: backdrop ? 'auto' : 'none'
        }}
      >
        <CircularProgress color="inherit" sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }} />
        Updating NFT list, please be patient. 
      </Box>
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

        <CSVDownloader
          type={Type.Button}
          filename={'filename'}
          bom={true}
          config={{
            delimiter: ';'
          }}
          data={() => {
            return parseData(tokenDetailsData, royaltyData)
          }}
        >
          Download
        </CSVDownloader>

        <Button onClick={() => console.log(csvUpload)}>
          Console log upload results
        </Button>
        <Button onClick={() => console.log(tokenDetailsData)}>
          Console log token details data
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
      <Typography variant="body2">
        NOTE: You are rate-limited to upload 20 images per 10 seconds, so with larger mints this can take some time. 1000 NFTs should take over 8 minutes. Feel free to contact the team for a manual option which can be much more efficient.
      </Typography>
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
      {/* <DataGrid
          rows={currentRows}
          columns={columns}
          autoHeight
          initialState={{
            // pagination: {
            //   paginationModel: {
            //     pageSize: 25,
            //   },
            // },
          }}
          rowHeight={64}
          getRowId={(row) => row.rank}
          // pageSizeOptions={[25, 50, 100]}
          // disableRowSelectionOnClick
          sx={{
            border: 'none',
            mb: 0,
            '& .MuiDataGrid-row': {
              '&:hover': {
                background: theme.palette.divider,
                // cursor: 'pointer',
              }
            },
            '& .MuiDataGrid-cell': {
              '&:focus': {
                outline: 'none',
              },
              '&:first-of-type': {
                pl: 2,
              },
              '&:last-child': {
                pr: 2,
              },
            },
            '& .MuiDataGrid-columnHeader': {
              '&:focus': {
                outline: 'none',
              },
              '&:first-of-type': {
                pl: 2,
              },
              '&:last-child': {
                pr: 2,
              },
            }
          }}
        /> */}
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


