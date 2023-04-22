import React, { FC, useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  useTheme,
  Collapse,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import PackTokenSection from "@components/create/PackTokenSection";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { IRarityData } from "@pages/mint";
import {
  saleInfoDataInit,
  ISaleInfoData,
  packTokenDataInit,
} from "@pages/mint";
import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

interface ISalesInfoProps {
  saleInfoData: ISaleInfoData;
  setSaleInfoData: React.Dispatch<React.SetStateAction<ISaleInfoData>>;
  clearForm: boolean;
  setClearForm: React.Dispatch<React.SetStateAction<boolean>>;
  rarityData: IRarityData[];
  saleFormValidation: {name: boolean;}
  setSaleFormValidation: React.Dispatch<React.SetStateAction<{name: boolean;}>>;
}

const SalesInfo: FC<ISalesInfoProps> = ({
  saleInfoData,
  setSaleInfoData,
  clearForm,
  setClearForm,
  rarityData,
  saleFormValidation,
  setSaleFormValidation
}) => {
  const [packTokenData, setPackTokenData] = useState([packTokenDataInit]);
  const [packToggle, setPackToggle] = useState(true);
  const [dateStart, setDateStart] = useState(
    new Date(new Date().getTime() + 8.64e7)
  );
  const [dateEnd, setDateEnd] = useState(
    new Date(new Date().getTime() + 2.6298e9)
  );
  const [nameDesc, setNameDesc] = useState({
    saleName: "",
    saleDescription: "",
  });

  const theme = useTheme();

  useEffect(() => {
    setSaleInfoData((prev) => ({
      ...prev,
      hasPacks: packToggle,
    }));
  }, [packToggle]);

  useEffect(() => {
    const timeout = setTimeout(
      () =>
        setSaleInfoData((prev) => ({
          ...prev,
          saleName: nameDesc.saleName,
          saleDescription: nameDesc.saleDescription,
        })),
      2000
    );
    return () => clearTimeout(timeout);
  }, [nameDesc.saleName, nameDesc.saleDescription]);

  useEffect(() => {
    setSaleInfoData((prev) => ({
      ...prev,
      dateEnd: new Date(dateEnd),
    }));
  }, [dateEnd]);

  useEffect(() => {
    setSaleInfoData((prev) => ({
      ...prev,
      dateStart: new Date(dateStart),
    }));
  }, [dateStart]);

  // SALE DATA STATES //
  const [createSale, setCreateSale] = useState(true);
  const toggleCreateSale = () => {
    setCreateSale(!createSale);
  };

  // CLEAR FORM //
  useEffect(() => {
    setSaleInfoData(saleInfoDataInit); // this belongs to parent
    setPackTokenData([packTokenDataInit]);
    setClearForm(false);
  }, [clearForm]);

  useEffect(() => {
    const timeout = setTimeout(
      () => setSaleInfoData((prev) => ({ ...prev, packs: packTokenData })),
      400
    );
    return () => clearTimeout(timeout);
  }, [JSON.stringify(packTokenData)]);

  const handleSelectChange = (e: SelectChangeEvent) => {
    setPackTokenData((prevArray) => {
      const newArray = prevArray.map((item, i) => {
        if (i === 0) {
          return {
            ...item,
            [e.target.name]: e.target.value, // key could be hardcoded as 'currency' since its the only one used here.
          };
        }
        return item;
      });
      return newArray;
    });
  };

  const handleChangeNum = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPackTokenData((prevArray) => {
      const newArray = prevArray.map((item, i) => {
        if (i === 0) {
          return {
            ...item,
            [e.target.name]: e.target.value,
          };
        }
        return item;
      });
      return newArray;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'saleName') setSaleFormValidation(prevState => {return { ...prevState, name: false }})
    setNameDesc((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Box>
      <Box>
        <Typography variant="h4">Sale info</Typography>
        <Typography variant="body2">
          If you choose not to setup a sale, the NFTs will be sent to the artist
          address as they&apos;re minted.
        </Typography>
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
          onClick={() => toggleCreateSale()}
        >
          <Grid item xs>
            <Typography variant="h5" sx={{ verticalAlign: "middle" }}>
              Create Sales Portal
            </Typography>
          </Grid>
          <Grid item xs="auto">
            <Typography
              sx={{
                display: "inline-block",
                mr: "6px",
                verticalAlign: "middle",
                color: createSale
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
              }}
            >
              Enable
            </Typography>
            <Switch
              focusVisibleClassName=".Mui-focusVisible"
              disableRipple
              checked={createSale}
            />
          </Grid>
        </Grid>
      </Box>
      <Collapse in={createSale}>
        <Grid container spacing={2} sx={{ mb: "24px" }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="filled"
              id="sale-name"
              label="Sale Name"
              name="saleName"
              value={nameDesc.saleName}
              onChange={handleChange}
              error={saleFormValidation.name}
            helperText={saleFormValidation.name ? "A sale already exists with this name" : null}
            />
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                renderInput={(props: any) => (
                  <TextField
                    // required
                    fullWidth
                    id="date-start"
                    name="date-start"
                    variant="filled"
                    {...props}
                    InputProps={{ ...props.InputProps, disableUnderline: true }}
                  />
                )}
                ampm={false}
                label="Date Start"
                value={dateStart}
                onChange={(newValue: any) => setDateStart(newValue)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                renderInput={(props: any) => (
                  <TextField
                    // required
                    fullWidth
                    id="date-end"
                    name="date-end"
                    variant="filled"
                    {...props}
                    InputProps={{ ...props.InputProps, disableUnderline: true }}
                  />
                )}
                ampm={false}
                label="Date End"
                value={dateEnd}
                onChange={(newValue: any) => setDateEnd(newValue)}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="filled"
              id="sale-description"
              label="Sale Description"
              name="saleDescription"
              multiline
              minRows={3}
              value={nameDesc.saleDescription}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Collapse in={!packToggle}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    id="price-per-token"
                    label="Price per token"
                    type="number"
                    name="price"
                    value={packTokenData[0].price}
                    onChange={handleChangeNum}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl variant="filled" fullWidth>
                    <InputLabel id="currency">Currency</InputLabel>
                    <Select
                      id="currency"
                      value={packTokenData[0].currency}
                      label="Currency"
                      name="currency"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value={"SigUSD"}>SigUSD</MenuItem>
                      <MenuItem value={"Erg"}>Erg</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Collapse>
          </Grid>
        </Grid>
        <PackTokenSection
          data={packTokenData}
          setData={setPackTokenData}
          rarityData={rarityData}
          packToggle={packToggle}
          setPackToggle={setPackToggle}
        />
      </Collapse>
      <Button onClick={() => console.log(saleInfoData)}>
        Console log data
      </Button>
      <Button onClick={() => setClearForm(true)}>Clear Form</Button>
    </Box>
  );
};

export default SalesInfo;
