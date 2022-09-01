import React, { FC, useContext } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AppBar from "@mui/material/AppBar";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { DarkTheme, LightTheme } from "@theme/theme";
import { Theme, Fade } from '@mui/material';
import Box from "@mui/material/Box";
import Link from '@components/Link'
import { ThemeContext } from "@lib/ThemeContext";
import { useRouter } from 'next/router';
import Logo from '@components/svgs/Logo';

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
    name: "Marketplace",
    link: "/marketplace",
  },
  {
    name: "Collections",
    link: "/collections",
  },
  {
    name: "Activity",
    link: "/activity",
  },
  // {
  //   name: "Disabled",
  //   link: "/disabled",
  //   disabled: true,
  // },
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

  const router = useRouter();

  const toggleTheme = () => {
    setTheme((prevTheme: Theme) => (prevTheme === LightTheme ? DarkTheme : LightTheme));
    let temp = theme === LightTheme ? "dark" : "light";
    localStorage.setItem('darkToggle', temp);
    // console.log(temp)
  };

  const NavigationListItem: React.FC<INavItemProps> = ({ size, page }) => {
    return (
      <Grid item>
        <Box
          sx={{
            display: 'inline-block',
            // mt: '6px',
          }}
        >
          {page.disabled ? (
            <Typography
              sx={{
                color: theme.palette.text.secondary,
              }}
            >
              {page.name}
            </Typography>
          ) : (
            <Typography
              onClick={() => setNavbarOpen(false)}
            >
              <Link
                href={page.link}
                sx={{
                  color: router.pathname === page.link ? theme.palette.primary.main : theme.palette.text.primary,
                  textDecoration: router.pathname === page.link ? "underline" : "none",
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                {page.name}
              </Link>
            </Typography>
          )}
        </Box>
      </Grid>
    );
  };

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <>
      <AppBar
        position="fixed"
        // color="transparent"
        elevation={0}
        sx={{
          zIndex: "24",
          borderBottom: theme.palette.mode == 'dark' ? "1px solid #1d242f" : "1px solid rgba(140,140,140,0.2)",
          backdropFilter: `${trigger ? "blur(25px)" : ""}`,
          background:
            //`${trigger ? 
            theme.palette.mode == 'dark' ? "rgba(60,80,140,0.02)" : "rgba(140,140,140,0.05)",
          //: ""}`,
        }}
      >
        <Container sx={{ px: "24px" }}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ height: "89px" }}
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
                <Logo
                  sx={{
                    color: theme.palette.text.primary,
                    fontSize: { xs: "32px", md: "40px" },
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              </Link>
            </Grid>

            <Grid item>
              <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                spacing={{ xs: 1, md: 3 }}
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
                >
                  <IconButton onClick={toggleTheme} sx={{ color: theme.palette.text.primary }}>
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
                      color: theme.palette.text.primary,
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
                          background: theme.palette.text.primary,
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
                          background: theme.palette.text.primary,
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
      <Fade in={navbarOpen} style={{ transitionDuration: "400ms" }}>
        <Box
          sx={{
            zIndex: "35",
            position: "fixed",
            width: "40px",
            height: "40px",
            top: "14px",
            right: "24px",
            color: theme.palette.text.primary,
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
                background: theme.palette.text.primary,
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
                background: theme.palette.text.primary,
                transition: "transform 100ms ease-in-out",
                transform: `${navbarOpen ? "rotate(-45deg)" : "translateY(-6px)"
                  }`,
              }}
            ></Box>
          </Box>
        </Box>
      </Fade>
      <Fade in={navbarOpen} style={{ transitionDuration: "400ms" }}>
        <Box
          sx={{
            height: "100vh",
            width: "100vw",
            position: "fixed",
            bottom: "0px",
            zIndex: "25",
            background: theme.palette.background.default,
            backdropFilter: "blur(55px)",
            p: "24px",
            pb: "0",
          }}
        >
          <Grid
            container
            direction="column"
            justifyContent="flex-end"
            alignItems="flex-start"
            spacing={3}
            height="100%"
          >
            <Grid item>
              <Grid
                container
                spacing={3}
                direction="column"
                justifyContent="flex-end"
                alignItems="flex-start"
                sx={{

                }}
              >
                {pages.map((page, i) => (
                  <NavigationListItem size={20} key={i} page={page} />
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </>
  );
};

export default Header;