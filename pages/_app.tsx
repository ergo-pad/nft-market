import React, { useState, useEffect } from "react";
import '@styles/globals.css'
import type { AppProps } from 'next/app'
import { DarkTheme, LightTheme } from "@theme/theme";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery, Theme } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import Layout from "components/Layout";
import Head from "next/head";
import { AnimatePresence } from "framer-motion";
import { ColorizeSharp } from "@mui/icons-material";
import { ThemeContext } from "@contexts/ThemeContext";
import { WalletContext } from '@contexts/WalletContext'
import { UserContext } from "@contexts/UserContext";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function MyApp({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState(LightTheme);
  const [walletAddress, setWalletAddress] = useState('')
  const [dAppWallet, setDAppWallet] = useState({
    connected: false,
    name: '',
    addresses: [''],
  })
  const [expanded, setExpanded] = useState<string | false>(false);
  const [addWalletModalOpen, setAddWalletModalOpen] = useState(false)
  const [userInfo, setUserInfo] = useState({ address: '' })

  useEffect(() => {
    setTheme(localStorage.getItem('darkToggle') === 'dark' ? DarkTheme : LightTheme)
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=yes"
        />
      </Head>
      <LocalizationProvider
            // @ts-ignore
            dateAdapter={AdapterDayjs}
          >
      <ThemeProvider theme={theme}>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <WalletContext.Provider
            value={{
              walletAddress,
              setWalletAddress,
              dAppWallet,
              setDAppWallet,
              addWalletModalOpen,
              setAddWalletModalOpen,
              expanded,
              setExpanded
            }}
          >
            <UserContext.Provider value={{ userInfo, setUserInfo }}>
              <CssBaseline enableColorScheme />
              <AnimatePresence exitBeforeEnter>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </AnimatePresence>
            </UserContext.Provider>
          </WalletContext.Provider>
        </ThemeContext.Provider>
      </ThemeProvider>
      </LocalizationProvider>
    </>
  )
}

export default MyApp