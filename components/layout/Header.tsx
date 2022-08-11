import React, { FC, useContext, useMemo } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AppBar from "@mui/material/AppBar";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import SvgIcon from "@mui/material/SvgIcon";
import Button from "@mui/material/Button";
import { useMediaQuery } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { DarkTheme, LightTheme } from "@theme/theme";
import { Theme } from '@mui/material';
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Zoom from "@mui/material/Zoom";
import Toolbar from "@mui/material/Toolbar";
import { useRouter } from "next/router";
import Link from '@components/Link'
import { IThemeContext, ThemeContext } from "@lib/ThemeContext";

const pages = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "About",
    link: "/about",
  },
  {
    name: "Education",
    link: "/education",
    disabled: true,
  },
  {
    name: "Projects",
    link: "/projects",
  },
  {
    name: "Blog",
    link: "/blog",
  },
  {
    name: "Dashboard",
    link: "/dashboard",
  },
];

interface INavItemProps {
  size: number;
  page: {
    name: string;
    link: string;
    disabled?: boolean;
  };
}

interface IHeaderProps {

}

const Header: FC<IHeaderProps> = ({ }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [navbarOpen, setNavbarOpen] = React.useState(false);

  const toggleTheme = () => {
    setTheme((prevTheme: Theme) => (prevTheme === LightTheme ? DarkTheme : LightTheme));
    let temp = theme === LightTheme ? "dark" : "light";
    localStorage.setItem('darkToggle', temp);
    console.log(temp)
  };

const NavigationListItem: React.FC<INavItemProps> = ({ size, page }) => {
  return (
    <Grid item>
      {page.disabled ? (
        <Typography
          sx={{
            // color: theme.palette.text.secondary,
          }}
        >
          {page.name}
        </Typography>
      ) : (
        <Box
          onClick={() => setNavbarOpen(false)}
        >
          <Link
            href={page.link}
          >
            {page.name}
          </Link>
        </Box>
      )}
    </Grid>
  );
};

const trigger = useScrollTrigger({
  disableHysteresis: true,
  threshold: 0,
});

return (
  <>
    <Box sx={{ mt: '90px' }}>

    </Box>
    <AppBar
      position="fixed"
      color="transparent"
      elevation={trigger && !navbarOpen ? 4 : 0}
      sx={{
        zIndex: "24",
        backdropFilter: `${trigger ? "blur(25px)" : ""}`,
        background: `${trigger
          ? "linear-gradient(130.4deg, rgba(7, 10, 17, 0.6) 14.89%, rgba(7, 10, 17, 0.3) 87.67%)"
          : ""
          }`,
      }}
    >
      <Container sx={{ px: "24px" }}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ minHeight: "70px" }}
        >
          <Grid
            item
            alignItems="center"
            sx={{
              height: { xs: "32px", md: "40px" },
              width: { xs: "32px", md: "40px" },
            }}
          >
            <Link href="/">
              <SvgIcon
                sx={{
                  cursor: "pointer",
                  color: theme.palette.primary.main,
                  fontSize: { xs: "32px", md: "40px" },
                  "&:hover": {
                    color: theme.palette.text.primary,
                  },
                }}
              >
                <rect width="3.56138" height="16.1036" rx="0.5" />
                <rect
                  x="12.6965"
                  y="7.89648"
                  width="3.56138"
                  height="16.1036"
                  rx="0.5"
                />
                <rect x="6.34839" width="3.56138" height="9.75509" rx="0.5" />
                <rect
                  x="6.34839"
                  y="14.2446"
                  width="3.56138"
                  height="9.75509"
                  rx="0.5"
                />
              </SvgIcon>
            </Link>
          </Grid>
          <Grid item>
            <Grid
              container
              justifyContent="flex-end"
              alignItems="center"
              spacing={6}
            >
              <Grid item sx={{ display: { xs: "none", md: "flex" } }}>
                <Grid
                  container
                  spacing={3}
                >
                  {pages.map((page, i) => (
                    <NavigationListItem size={13} key={i} page={page} />
                  ))}
                </Grid>
              </Grid>
              <Grid
                item
              // sx={{ display: { xs: "none", md: "flex" } }}
              >
                <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
                  {(theme === DarkTheme) ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Grid>
              <Grid item sx={{ display: { xs: "flex", md: "none" } }}>
                <Box
                  sx={{
                    zIndex: "25",
                    position: "relative",
                    width: "40px",
                    height: "40px",
                    color: "#fff",
                    // focus: 'outline-none',
                  }}
                  onClick={() => setNavbarOpen(!navbarOpen)}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      width: "20px",
                      transform: "translate(-50%, -50%)",
                      left: "50%",
                      top: "50%",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        height: "3px",
                        width: "28px",
                        borderRadius: "2px",
                        background: "#fff",
                        transition: "transform 100ms ease-in-out",
                        transform: `${navbarOpen ? "rotate(45deg)" : "translateY(6px)"
                          }`,
                      }}
                    ></Box>
                    <Box
                      sx={{
                        position: "absolute",
                        height: "3px",
                        width: "28px",
                        borderRadius: "2px",
                        background: "#fff",
                        transition: "transform 100ms ease-in-out",
                        transform: `${navbarOpen ? "rotate(-45deg)" : "translateY(-6px)"
                          }`,
                      }}
                    ></Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </AppBar>
  </>
);
};

export default Header;