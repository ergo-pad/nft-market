import React, { useContext, useState, useEffect } from "react";
import type { NextPage } from "next";
import {
  Container,
  useTheme,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Alert,
  Skeleton,
} from "@mui/material";
import { WalletContext } from "@contexts/WalletContext";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Link from "@components/Link";
import { stringToUrl } from "@utils/general";
import { ApiContext, IApiContext } from "@contexts/ApiContext";
import { getErgoWalletContext } from "@components/wallet/AddWallet";

const defaultCollection = {
  status: "NOT_AVAILABLE",
};

interface ISaleCollectionStatus {
  id: string;
  collectionID: string;
  saleName: string;
  collectionName?: string;
  collectionStatus: string;
  startDate: Date;
  endDate: Date;
  saleStatus: string;
  action?: string;
}

const ManageSales: NextPage = () => {
  const theme = useTheme();
  const { walletAddress, setAddWalletModalOpen } = useContext(WalletContext);
  const apiContext = useContext<IApiContext>(ApiContext);
  const [apiRows, setApiRows] = useState<ISaleCollectionStatus[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSales = async (walletAddress: string) => {
      setLoading(true);
      try {
        const sales = (
          await apiContext.api.get(`/sale?address=${walletAddress}`)
        ).data;
        const collections = (
          await apiContext.api.get(`/collection?address=${walletAddress}`)
        ).data;
        // join
        const joined = sales.map((sale: any) => {
          const collection =
            collections.filter(
              (collection: any) => collection.saleId == sale.id
            )[0] ?? defaultCollection;
          return {
            id: sale.id,
            collectionId: collection.id,
            saleName: sale.name,
            collectionName: collection.name,
            collectionStatus: collection.status,
            startDate: sale.startTime,
            endDate: sale.endTime,
            saleStatus: sale.status,
            action:
              collection.status === "MINTED" && sale.status === "PENDING"
                ? "BOOTSTRAP"
                : undefined,
          };
        });
        setApiRows(joined);
      } catch (e: any) {
        apiContext.api.error(e);
      }
      setLoading(false);
    };
    if (walletAddress) {
      getSales(walletAddress);
    }
  }, [walletAddress]);

  const bootstrap = async (saleId: string) => {
    try {
      const res = await apiContext.api.post("/sale/bootstrap", {
        saleId: saleId,
        sourceAddresses: [walletAddress],
      });
      const tx = res.data;
      const context = await getErgoWalletContext();
      const signedtx = await context.sign_tx(tx);
      const ok = await context.submit_tx(signedtx);
      apiContext.api.ok(`Submitted Transaction: ${ok}`);
      setApiRows(
        apiRows.map((row) => {
          if (row.id === saleId) {
            return {
              ...row,
              action: "PROCESSING",
            };
          }
          return row;
        })
      );
    } catch (e: any) {
      apiContext.api.error(e);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 60,
    },
    {
      field: "saleName",
      headerName: "Sale Name",
      renderCell: (params) => (
        <Box>
          <Link href={"/marketplace/sale/" + stringToUrl(params.value)}>
            {params.value}
          </Link>
        </Box>
      ),
      flex: 1,
      minWidth: 170,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      type: "dateTime",
      width: 140,
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: "endDate",
      headerName: "End Date",
      type: "dateTime",
      width: 140,
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: "collectionName",
      headerName: "Collection Name",
      renderCell: (params) => (
        <>
          <Link href={"/collections/" + stringToUrl(params.value)}>
            {params.value}
          </Link>
        </>
      ),
      flex: 1,
      minWidth: 200,
    },
    {
      field: "collectionStatus",
      headerName: "Collection Status",
      width: 220,
      renderCell: (params) => {
        const setSeverity = (input: string) => {
          if (input === "INITIALIZED") return "warning";
          if (
            input === "MINTING" ||
            input === "MINTING_NFTS" ||
            input === "REFUNDING"
          )
            return "info";
          if (input === "MINTED" || input === "REFUNDED") return "success";
          if (input === "FAILED" || input === "NOT_AVAILABLE") return "error";
        };
        return (
          <>
            <Alert
              sx={{ mb: 0, width: "100%" }}
              severity={setSeverity(params.value)}
            >
              {params.value}
            </Alert>
          </>
        );
      },
    },
    {
      field: "saleStatus",
      headerName: "Sale Status",
      width: 180,
      renderCell: (params) => {
        const setSeverity = (input: string) => {
          if (input === "PENDING") return "warning";
          if (input === "WAITING") return "info";
          if (input === "LIVE" || input === "SOLD OUT" || input === "FINISHED")
            return "success";
        };
        return (
          <>
            <Alert
              sx={{ mb: 0, width: "100%" }}
              severity={setSeverity(params.value)}
            >
              {params.value}
            </Alert>
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => {
        if (params.value !== undefined) {
          return (
            <>
              <Button
                disabled={params.value === "PROCESSING"}
                variant="contained"
                onClick={() => bootstrap(params.id.toString())}
              >
                {params.value}
              </Button>
            </>
          );
        }
      },
      width: 140,
    },
  ];

  return (
    <Container sx={{ mt: "30px", mb: "50px" }}>
      <Grid container sx={{ mb: "36px" }} alignItems="flex-end">
        <Grid item md={6}>
          <Typography variant="h1">Manage Sales</Typography>
          <Typography variant="body2" sx={{ mb: 0 }}>
            Use this panel to keep track of pending and active token sales and
            your minted collections.
          </Typography>
        </Grid>
        <Grid item md={6} sx={{ textAlign: "right" }}></Grid>
      </Grid>
      {walletAddress !== "" ? (
        <Paper sx={{ width: "100%" }}>
          {loading ? (
            <Skeleton variant="rectangular" height={260} />
          ) : (
            <DataGrid
              rows={apiRows}
              columns={columns}
              //disableColumnMenu
              autoHeight
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 25,
                  },
                },
              }}
              // rowHeight={64}
              disableRowSelectionOnClick
              sx={{
                border: "none",
                mb: 0,
                "& .MuiDataGrid-row": {
                  "&:hover": {
                    background: theme.palette.divider,
                    // cursor: 'pointer',
                  },
                },
                "& .MuiDataGrid-cell": {
                  "&:focus": {
                    outline: "none",
                  },
                  "&:first-of-type": {
                    pl: 2,
                  },
                  "&:last-child": {
                    pr: 2,
                  },
                },
                "& .MuiDataGrid-columnHeader": {
                  "&:focus": {
                    outline: "none",
                  },
                  "&:first-of-type": {
                    pl: 2,
                  },
                  "&:last-child": {
                    pr: 2,
                  },
                },
              }}
            />
          )}
        </Paper>
      ) : (
        <Box sx={{ textAlign: "center", py: "20vh" }}>
          <Typography variant="body2" sx={{ mb: "12px" }}>
            You must connect a wallet to use this feature.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setAddWalletModalOpen(true)}
          >
            Connect Now
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ManageSales;
