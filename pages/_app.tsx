import '@styles/globals.css'
import type { AppProps } from 'next/app'
import React from "react";
import { DarkTheme, LightTheme } from "@theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import Layout from "@components/Layout";
import Head from "next/head";
import { AnimatePresence } from "framer-motion";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=yes"
        />
      </Head>
      <ThemeProvider theme={DarkTheme}>
        <CssBaseline />
        <AnimatePresence exitBeforeEnter>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AnimatePresence>
      </ThemeProvider>
    </>
  )
}

export default MyApp
