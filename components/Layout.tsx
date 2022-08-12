import React from "react";
import Head from "next/head";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import { calcLength, motion } from "framer-motion";
import { useRouter } from "next/router";
import { Grid, Box } from "@mui/material";

const variants = {
  hidden: { opacity: 0, x: 0, y: 500 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Template</title>
      </Head>
      <Header />
      <motion.main
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ type: "linear" }}
        className=""
        key={router.route}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            pt: '90px', // give space for floating navbar
          }}
        >
          <Box sx={{ flexGrow: '1' }}>
            {children}
          </Box>
          <Footer />
        </Box>
      </motion.main>
    </>
  );
};

export default Layout;