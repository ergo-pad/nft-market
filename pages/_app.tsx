import React, { useState, useEffect } from "react";
import '@styles/globals.css'
import type { AppProps } from 'next/app'
import { DarkTheme, LightTheme } from "@theme/theme";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery, Theme } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import Layout from "@components/Layout";
import Head from "next/head";
import { AnimatePresence } from "framer-motion";
import { ColorizeSharp } from "@mui/icons-material";
import { ThemeContext } from "@lib/ThemeContext";

function MyApp({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState(LightTheme);

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
      <ThemeProvider theme={theme}>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <CssBaseline />
          <AnimatePresence exitBeforeEnter>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AnimatePresence>
        </ThemeContext.Provider>
      </ThemeProvider>
    </>
  )
}

export default MyApp