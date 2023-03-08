import type { NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import ArtistForm from "@components/create/ArtistForm";
import { IArtistData, artistDataInit } from "@pages/create";
import UserProfile from "@components/UserProfile";
import { getErgoWalletContext } from "@components/wallet/AddWallet";
import { ApiContext, IApiContext } from "@contexts/ApiContext";
import { WalletContext } from "@contexts/WalletContext";

const UserSettings: NextPage = () => {
  const apiContext = useContext<IApiContext>(ApiContext);
  const [userData, setUserData] = useState<IArtistData>(artistDataInit);
  const [clearUserForm, setClearUserForm] = useState(false);

  const { walletAddress } = useContext(WalletContext);
  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      address: walletAddress,
    }));
  }, [walletAddress]);

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

  const handleSubmit = async () => {
    try {
      const verificationToken = await getAuthToken(userData.address);
      const updateUserData = {
        ...userData,
        pfpUrl: userData.avatarUrl,
        social: userData.social ?? [],
        verificationToken: verificationToken,
        id: crypto.randomUUID(),
      };
      await apiContext.api.post("/user", updateUserData);
      apiContext.api.ok("User Details Updated");
    } catch (e: any) {
      apiContext.api.error(e);
    }
  };

  return (
    <UserProfile
      address={userData.address}
      username={userData.name}
      pfpUrl={userData.avatarUrl}
      bannerUrl={userData.bannerUrl}
      tagline={userData.tagline}
      website={userData.website}
      socialLinks={userData.social}
    >
      <Typography variant="h4">Update Your Profile</Typography>
      <Typography variant="body2">
        Change your user profile here. You must sign with your wallet to verify
        the changes.
      </Typography>
      <ArtistForm
        artistData={userData}
        setArtistData={setUserData}
        clearForm={clearUserForm}
        setClearForm={setClearUserForm}
        disableArtist={true}
      />
      <Box sx={{ width: "100%", textAlign: "right" }}>
        <Button variant="contained" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Box>
    </UserProfile>
  );
};

export default UserSettings;
