import React, { useState, useEffect, useContext } from "react";
import type { NextPage } from "next";
import {
  Grid,
  Container,
  Typography,
  Box,
  useTheme,
  Collapse,
  Button,
  Paper,
  Stepper,
  Step,
  StepButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import ArtistForm from "@components/create/ArtistForm";
import CollectionForm from "@components/create/CollectionForm";
import TokenDetailsForm, {
  ITraitsData,
  INftData,
} from "@components/create/TokenDetailsForm";
import SaleInfoForm from "@components/create/SaleInfoForm";
import { v4 as uuidv4 } from "uuid";
import { WalletContext } from "@contexts/WalletContext";
import { ApiContext, IApiContext } from "@contexts/ApiContext";
import { getErgoWalletContext } from "@components/wallet/AddWallet";
import Link from "@components/Link";
import { slugify } from "@utils/general";

const SIGUSD_TOKEN_ID =
  "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04";

const steps = ["Artist", "Collection Details", "Token Details", "Sale Info"];

export interface IArtistData {
  address: string;
  name?: string;
  website?: string;
  tagline?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  social?: {
    socialNetwork: string;
    url: string;
  }[];
}

export const artistDataInit: IArtistData = {
  address: "",
  name: "",
  website: "",
  tagline: "",
  avatarUrl: "",
  bannerUrl: "",
  social: [],
};

export interface ICollectionData {
  collectionName: string;
  description: string;
  bannerImageUrl: string;
  featuredImageUrl: string;
  collectionLogoUrl: string;
  category: string;
  mintingExpiry: number | -1; //unix timestamp of last date of expiry. If no expiry, must be -1. May not be undefined
}

export const collectionDataInit: ICollectionData = {
  collectionName: "",
  description: "",
  bannerImageUrl: "",
  featuredImageUrl: "",
  collectionLogoUrl: "",
  category: "",
  mintingExpiry: -1, //unix timestamp of last date of expiry. If no expiry, must be -1. May not be undefined
};

export interface IRarityData {
  rarity: string;
  id: string;
  image?: string;
}

export interface IPackData {
  id: string;
  packName: string;
  amountOfPacks: number;
  image: string;
  nftPerPack: {
    id: string;
    count: number | "";
    probabilities?: {
      rarityName: string;
      probability: number;
    }[];
  }[];
  price: number | "";
  currency: string;
}

export interface ISaleInfoData {
  packs: IPackData[];
  dateStart: Date;
  dateEnd: Date;
  hasPacks: boolean;
  saleName: string;
  saleDescription: string;
}

export interface ITokenDetailsData {
  nfts: INftData[]; // contains royalty info
  rarities: IRarityData[];
  availableTraits: ITraitsData[];
}

export interface IMintResult {
  saleId?: string;
  collectionId?: string;
  transactionId?: string;
  status: string;
  errorMessage?: string;
}

const mintResultDataInit: IMintResult = {
  status: "NOT_INITIALIZED",
};

export const tokenDetailsDataInit: ITokenDetailsData = {
  nfts: [],
  rarities: [
    {
      rarity: "",
      id: uuidv4(),
    },
  ],
  availableTraits: [
    {
      traitName: "", // the name of the trait type (eg: sex, speed, age)
      id: uuidv4(),
      type: "Property",
      // max: 1, // if trait is a Level or Stat, this is the highest possible value
    },
  ],
};

export const packTokenDataInit: IPackData = {
  id: uuidv4(),
  packName: "",
  amountOfPacks: 1,
  image: "",
  nftPerPack: [
    {
      id: uuidv4(),
      count: 1,
      probabilities: [
        {
          rarityName: "",
          probability: 100,
        },
      ],
    },
  ],
  price: "",
  currency: "SigUSD",
};

export const saleInfoDataInit: ISaleInfoData = {
  packs: [packTokenDataInit], // If user chooses not to have packs, price for sale will be {packs[0].price}
  dateStart: new Date(new Date().getTime()),
  dateEnd: new Date(new Date().getTime() + 2.6298e9),
  hasPacks: false, // If false, packs[0].price is used for all NFT prices as mentioned above.
  saleName: "",
  saleDescription: "",
};

const Mint: NextPage = () => {
  const theme = useTheme();
  // const upSm = useMediaQuery(theme.breakpoints.up('sm')) // not currently used
  const [activeStep, setActiveStep] = React.useState(0);
  const { walletAddress } = useContext(WalletContext);
  const apiContext = useContext<IApiContext>(ApiContext);

  // FORM DATA STATES //
  const [artistData, setArtistData] = useState<IArtistData>(artistDataInit);
  const [collectionData, setCollectionData] =
    useState<ICollectionData>(collectionDataInit);
  const [tokenDetailsData, setTokenDetailsData] =
    useState<ITokenDetailsData>(tokenDetailsDataInit);
  const [saleInfoData, setSaleInfoData] =
    useState<ISaleInfoData>(saleInfoDataInit);
  useEffect(() => {
    const localStorageData = [
      localStorage.getItem("creation-artist-form"),
      localStorage.getItem("creation-collection-form"),
      localStorage.getItem("creation-token-details-form"),
      localStorage.getItem("creation-sale-info-form"),
    ];
    if (localStorageData[0] !== null)
      setArtistData(JSON.parse(localStorageData[0]));
    if (localStorageData[1] !== null)
      setCollectionData(JSON.parse(localStorageData[1]));
    if (localStorageData[2] !== null)
      setTokenDetailsData(JSON.parse(localStorageData[2]));
    if (localStorageData[3] !== null)
      setSaleInfoData(JSON.parse(localStorageData[3]));
  }, []);
  useEffect(() => {
    setArtistData((prev) => ({
      ...prev,
      address: walletAddress,
    }));
  }, [walletAddress]);
  const [collectionFormValidation, setCollectionFormValidation] = useState({
    name: false,
  });
  const [saleFormValidation, setSaleFormValidation] = useState({ name: false });

  // CLEAR FORM STATES //
  const [clearArtistForm, setClearArtistForm] = useState(false);
  const [clearCollectionForm, setClearCollectionForm] = useState(false);
  const [clearTokenDetailsForm, setClearTokenDetailsForm] = useState(false);
  const [clearSaleInfoForm, setClearSaleInfoForm] = useState(false);

  // OTHER STATES //
  const [rarityData, setRarityData] = useState<IRarityData[]>(
    tokenDetailsDataInit.rarities
  );
  const [resultData, setResultData] = useState<IMintResult>(mintResultDataInit);
  const [loading, setLoading] = useState<boolean>(false);

  // STEPPER LOGIC //
  useEffect(() => {
    if (stepperCompleted[activeStep] === true) {
      setStepperCompleted((prevState) => {
        return { ...prevState, [activeStep]: false };
      });
    }
  }, [activeStep]);
  const [stepperCompleted, setStepperCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const totalSteps = () => {
    return steps.length;
  };
  const completedSteps = () => {
    return Object.keys(stepperCompleted).length;
  };
  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };
  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };
  const handleStepperNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in stepperCompleted))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };
  const handleStepperBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };
  const handleSaveStep = () => {
    if (activeStep === 0) {
      localStorage.setItem("creation-artist-form", JSON.stringify(artistData));
    }
    if (activeStep === 1) {
      localStorage.setItem(
        "creation-collection-form",
        JSON.stringify(collectionData)
      );
    }
    if (activeStep === 2) {
      localStorage.setItem(
        "creation-token-details-form",
        JSON.stringify(tokenDetailsData)
      );
    }
    if (activeStep === 3) {
      localStorage.setItem(
        "creation-sale-info-form",
        JSON.stringify(saleInfoData)
      );
    }
  };
  const handleClearSavedStep = () => {
    const newCompleted = stepperCompleted;
    newCompleted[activeStep] = false;
    setStepperCompleted(newCompleted);
    if (activeStep === 0) {
      setClearArtistForm(true);
      localStorage.removeItem("creation-artist-form");
    }
    if (activeStep === 1) {
      setClearCollectionForm(true);
      localStorage.removeItem("creation-collection-form");
    }
    if (activeStep === 2) {
      setClearTokenDetailsForm(true);
      localStorage.removeItem("creation-token-details-form");
    }
    if (activeStep === 3) {
      setClearSaleInfoForm(true);
      localStorage.removeItem("creation-sale-info-form");
    }
  };
  const handleStepperComplete = async () => {
    // made it an object so we can add more validation later,
    // but for now we know we're just checking name uniqueness for a collection here
    if (activeStep === 1) {
      const doesCollectionNameExist = async () => {
        try {
          const slug = slugify(collectionData.collectionName);
          const res = await apiContext.api.get(`/collection/${slug}`);
          if (res.data) return true;
        } catch (e: any) {
          if (e.response.data.includes("empty result")) return false;
        }
      };
      const bool = await doesCollectionNameExist();
      if (bool) {
        setCollectionFormValidation((prevState) => {
          return {
            ...prevState,
            name: true,
          };
        });
        apiContext.api.error("Please choose a unique collection name");
        return false;
      } else {
        setCollectionFormValidation((prevState) => {
          return {
            ...prevState,
            name: false,
          };
        });
      }
    }
    if (activeStep === 3) {
      const doesSaleNameExist = async () => {
        try {
          const slug = slugify(saleInfoData.saleName);
          const res = await apiContext.api.get(`/sale/${slug}`);
          if (res.data) return true;
        } catch (e: any) {
          if (e.response.data.includes("empty result")) return false;
        }
      };
      const bool = await doesSaleNameExist();
      if (bool) {
        setSaleFormValidation((prevState) => {
          return {
            ...prevState,
            name: true,
          };
        });
        apiContext.api.error("Please choose a unique sale name");
        return false;
      } else {
        setSaleFormValidation((prevState) => {
          return {
            ...prevState,
            name: false,
          };
        });
      }
    }
    handleSaveStep();
    const newCompleted = stepperCompleted;
    newCompleted[activeStep] = true;
    setStepperCompleted(newCompleted);
    handleStepperNext();
  };
  const handleStepperReset = () => {
    setActiveStep(0);
    setStepperCompleted({});
  };
  // END STEPPER LOGIC //

  // SUBMIT FORM //
  const submit = async () => {
    setLoading(true);
    try {
      const artistCreated = await createArtistData(artistData);
      const saleCreated = await createSaleData(saleInfoData, walletAddress);
      const collectionCreated = await createCollectionData(
        collectionData,
        tokenDetailsData,
        artistCreated.id,
        saleCreated.sale.id
      );
      const nftUpdated = await createNftData(
        collectionCreated.id,
        tokenDetailsData
      );
      const tx = await getMintTx(collectionCreated.id);
      const context = await getErgoWalletContext();
      const signedtx = await context.sign_tx(tx);
      const ok = await context.submit_tx(signedtx);
      apiContext.api.ok(`Submitted Transaction: ${ok}`);
      // todo: show this data nicely in ok thank you page
      setResultData({
        saleId: saleCreated.sale.id,
        collectionId: collectionCreated.id,
        transactionId: ok,
        status: "MINTING",
      });
    } catch (e: any) {
      setResultData({ ...resultData, status: "ERRORED" });
      console.error(e);
    }
    setLoading(false);
  };

  const createArtistData = async (data: IArtistData) => {
    try {
      const verificationToken = await getAuthToken(data.address);
      const updateUserData = {
        ...data,
        pfpUrl: data.avatarUrl,
        socials: data.social ?? [],
        verificationToken: verificationToken,
        id: crypto.randomUUID(),
      };
      const res = await apiContext.api.post("/user", updateUserData);
      apiContext.api.ok("Artist Data Created");
      return res.data;
    } catch (e: any) {
      apiContext.api.error(e);
    }
  };

  const createSaleData = async (data: ISaleInfoData, address: string) => {
    try {
      const backendPacks = data.packs.map((pack) => {
        return {
          name: pack.packName,
          image: pack.image,
          price: [
            {
              tokenId: pack.currency === "SigUSD" ? SIGUSD_TOKEN_ID : null,
              amount:
                pack.currency === "Erg"
                  ? Number(pack.price ?? 0) * 1000000000
                  : Number(pack.price ?? 0) * 100,
            },
          ],
          content: pack.nftPerPack.map((packEntry) => {
            return {
              amount: Number(packEntry.count ?? 0),
              rarity: packEntry.probabilities
                ? packEntry.probabilities.map((rarity) => {
                    return {
                      rarity: rarity.rarityName,
                      odds: Number(rarity.probability),
                    };
                  })
                : [
                    {
                      rarity: "",
                      odds: 100,
                    },
                  ],
            };
          }),
          tpe: "COMBINED", // what are other fields ??
          count: Number(pack.amountOfPacks),
        };
      });
      const saleData = {
        name: data.saleName,
        description: data.saleDescription,
        startTime: data.dateStart,
        endTime: data.dateEnd,
        sellerWallet: address,
        password: "dummy_password",
        packs: backendPacks,
        tokens: [],
        sourceAddresses: [address],
      }
      console.log('Sale data: ')
      console.log(saleData)
      const res = await apiContext.api.post("/sale", saleData);
      apiContext.api.ok("Sale Data Created");
      return res.data;
    } catch (e: any) {
      apiContext.api.error(e);
    }
  };

  const createCollectionData = async (
    data: ICollectionData,
    tokens: ITokenDetailsData,
    artistId: string,
    saleId: string
  ) => {
    try {
      const collectionData = {
        artistId: artistId,
        name: data.collectionName,
        description: data.description,
        bannerImageUrl: data.bannerImageUrl,
        featuredImageUrl: data.featuredImageUrl,
        collectionLogoUrl: data.collectionLogoUrl,
        category: data.category,
        mintingExpiry: data.mintingExpiry,
        rarities: tokens.rarities.map((rarity) => {
          return {
            rarity: rarity.rarity ?? "",
            image: rarity.image ?? "",
            description: "", // todo: add description to IRarityData
          };
        }),
        availableTraits: tokens.availableTraits.map((trait) => {
          return {
            name: trait.traitName,
            tpe: trait.type.toUpperCase(),
            description: "", // todo: add description to ITraitData
            image: "", // // todo: add image to ITraitData,
            max: trait.max,
          };
        }),
        saleId: saleId,
      }
      console.log('collection data:')
      console.log(collectionData)
      const res = await apiContext.api.post("/collection", collectionData);
      apiContext.api.ok("Collection Data Created");
      return res.data;
    } catch (e: any) {
      apiContext.api.error(e);
    }
  };

  const createNftData = async (
    collectionId: string,
    tokens: ITokenDetailsData
  ) => {
    try {
      const data = tokens.nfts.map((nft) => {
        return {
          collectionId: collectionId,
          amount: Number(nft.qty),
          name: nft.nftName,
          image: nft.image,
          description: nft.description ?? "",
          traits:
            nft.traits &&
            nft.traits[0].key !== undefined &&
            nft.traits[0].key !== ""
              ? nft.traits.map((trait) => {
                  return {
                    name: trait.key,
                    tpe: trait.type.toUpperCase(),
                    valueString:
                      typeof trait.value === "string" ? trait.value : null,
                    valueInt:
                      typeof trait.value === "number" ? trait.value : null,
                  };
                })
              : [],
          rarity: nft.rarity ?? "",
          explicit: nft.explicit,
          royalty:
            nft.royalties &&
            nft.royalties[0].address !== undefined &&
            nft.royalties[0].address !== ""
              ? nft.royalties.map((royalty) => {
                  return {
                    address: royalty.address,
                    royaltyPct: Number(royalty.pct),
                  };
                })
              : [],
        };
      })
      console.log('nft data: ')
      console.log(data)
      const res = await apiContext.api.post("/nft", data);
      apiContext.api.ok("NFT Data Created");
      return res.data;
    } catch (e: any) {
      apiContext.api.error(e);
    }
  };

  const getMintTx = async (collectionId: string) => {
    try {
      const res = await apiContext.api.get(`/collection/${collectionId}/mint`);
      apiContext.api.ok("Mint Transaction Created");
      return res.data;
    } catch (e: any) {
      apiContext.api.error(e);
    }
  };

  const getAuthToken = async (address: string) => {
    const authResp = await apiContext.api.post("/auth", {
      address: address,
    });
    const auth = authResp.data;
    const context = await getErgoWalletContext();
    const response = await context.auth(address, auth.signingMessage);
    response.proof = Buffer.from(response.proof, "hex").toString("base64");
    const verifyResp = await apiContext.api.post(
      auth.verificationUrl,
      response
    );
    const verify = verifyResp.data;
    return verify.verificationToken;
  };
  // END SUBMIT FORM //

  return (
    <>
      <Container sx={{ mt: "30px", mb: { xs: "-12px", md: 0 } }}>
        <Box>
          <Typography variant="h1">Mint New Tokens</Typography>
          <Typography variant="body2" sx={{ mb: "24px" }}>
            You can mint a single NFT, create your own collections, and even set
            up your own sales platform through this page.
          </Typography>
        </Box>
      </Container>
      <Box
        sx={{
          display: { xs: "block", lg: "none" },
          position: "sticky",
          top: "60px",
          background: theme.palette.background.default,
          p: "12px",
          mb: "12px",
          zIndex: 60,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* STEPPER MOBILE */}
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, i) => (
            <Step key={label} completed={stepperCompleted[i]}>
              <StepButton
                color="inherit"
                onClick={handleStep(i)}
                sx={{
                  "& .MuiStepLabel-root .MuiStepLabel-labelContainer .MuiStepLabel-label":
                    {
                      mb: 0,
                    },
                }}
              >
                <Collapse
                  orientation="horizontal"
                  in={activeStep === i}
                  sx={{
                    maxHeight: "28px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </Collapse>
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Container sx={{ mb: "50px" }}>
        <Grid container>
          <Grid
            item
            lg={3}
            xl={2}
            sx={{ pr: "24px", display: { xs: "none", lg: "flex" } }}
          >
            <Box sx={{ position: "relative", width: "100%" }}>
              <Paper
                elevation={0}
                sx={{
                  position: "sticky",
                  p: "24px",
                  top: 84,
                  width: "100%",
                  zIndex: "100",
                }}
              >
                {/* STEPPER DESKTOP */}
                <Stepper
                  nonLinear
                  activeStep={activeStep}
                  orientation="vertical"
                >
                  {steps.map((label, index) => (
                    <Step
                      key={label}
                      completed={stepperCompleted[index]}
                      sx={{
                        "& .MuiStepLabel-root .MuiStepLabel-labelContainer .MuiStepLabel-label":
                          {
                            mb: 0,
                          },
                      }}
                    >
                      <StepButton color="inherit" onClick={handleStep(index)}>
                        {label}
                      </StepButton>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
            </Box>
          </Grid>
          <Grid item lg={9} xs={12} xl={10} sx={{ flex: "1 1 auto" }}>
            {allStepsCompleted() ? (
              <>
                <Typography variant="h4">Summary</Typography>
                <Typography sx={{ mt: 2, mb: 2 }}>
                  All steps completed - We are creating the required stuff in
                  the background now. You can track the status on your{" "}
                  <Link href="/manage-sales">Sales Management page</Link>.
                </Typography>
                <Divider sx={{ mb: 1 }} />
                {loading ? (
                  <Grid
                    sx={{ display: "flex", justifyContent: "center", py: 4 }}
                  >
                    <CircularProgress />
                  </Grid>
                ) : (
                  <>
                    {resultData.saleId && (
                      <Typography variant="h6" sx={{ my: 1 }}>
                        Sale Id: {resultData.saleId}
                      </Typography>
                    )}
                    {resultData.collectionId && (
                      <Typography variant="h6" sx={{ my: 1 }}>
                        Collection Id: {resultData.collectionId}
                      </Typography>
                    )}
                    {resultData.transactionId && (
                      <Typography variant="h6" sx={{ my: 1 }}>
                        Transaction Id:{" "}
                        <Link
                          href={
                            "https://explorer.ergoplatform.com/en/transactions/" +
                            resultData.transactionId
                          }
                        >
                          {resultData.transactionId}
                        </Link>
                      </Typography>
                    )}
                    {resultData.status && (
                      <Typography variant="h6" sx={{ my: 1 }}>
                        Status: {resultData.status}
                      </Typography>
                    )}
                  </>
                )}
                <Divider sx={{ mt: 1 }} />
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleStepperReset}>Reset</Button>
                  <Button onClick={() => submit()}>Submit</Button>
                </Box>
              </>
            ) : (
              <>
                <Collapse in={activeStep === 0} mountOnEnter unmountOnExit>
                  <Typography variant="h4">Artist Info</Typography>
                  <ArtistForm
                    artistData={artistData}
                    setArtistData={setArtistData}
                    clearForm={clearArtistForm}
                    setClearForm={setClearArtistForm}
                  />
                </Collapse>
                <Collapse in={activeStep === 1} mountOnEnter unmountOnExit>
                  <CollectionForm
                    collectionData={collectionData}
                    setCollectionData={setCollectionData}
                    clearForm={clearCollectionForm}
                    setClearForm={setClearCollectionForm}
                    collectionFormValidation={collectionFormValidation}
                    setCollectionFormValidation={setCollectionFormValidation}
                  />
                </Collapse>
                <Collapse in={activeStep === 2} mountOnEnter unmountOnExit>
                  <TokenDetailsForm
                    tokenDetailsData={tokenDetailsData}
                    setTokenDetailsData={setTokenDetailsData}
                    clearForm={clearTokenDetailsForm}
                    setClearForm={setClearTokenDetailsForm}
                    rarityData={rarityData}
                    setRarityData={setRarityData}
                  />
                </Collapse>
                <Collapse in={activeStep === 3} mountOnEnter unmountOnExit>
                  <SaleInfoForm
                    saleInfoData={saleInfoData}
                    setSaleInfoData={setSaleInfoData}
                    clearForm={clearSaleInfoForm}
                    setClearForm={setClearSaleInfoForm}
                    rarityData={rarityData}
                    saleFormValidation={saleFormValidation}
                    setSaleFormValidation={setSaleFormValidation}
                  />
                </Collapse>
                <Box sx={{ pt: 2, textAlign: "center" }}>
                  <Button
                    variant="contained"
                    disabled={activeStep === 0}
                    onClick={handleStepperBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Button
                    disabled={activeStep === totalSteps() - 1}
                    variant="contained"
                    onClick={handleStepperNext}
                    sx={{ mr: 1 }}
                  >
                    Next
                  </Button>
                  {activeStep !== steps.length &&
                    (stepperCompleted[activeStep] ? (
                      <>
                        <Typography
                          variant="caption"
                          sx={{ display: "inline-block" }}
                        >
                          Step {activeStep + 1} already completed
                        </Typography>
                        <Button onClick={handleClearSavedStep}>
                          Clear This Step
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => {
                          handleStepperComplete();
                          if (completedSteps() === totalSteps()) submit();
                        }}
                      >
                        {completedSteps() === totalSteps() - 1
                          ? "Finish"
                          : "Save Step"}
                      </Button>
                    ))}
                  {collectionFormValidation.name && (
                    <Typography sx={{ mt: "6px" }}>
                      You must choose a unique collection name
                    </Typography>
                  )}
                  {saleFormValidation.name && (
                    <Typography sx={{ mt: "6px" }}>
                      You must choose a unique sale name
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Mint;
