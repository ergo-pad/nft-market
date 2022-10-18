import React, { FC, useEffect, useMemo, useState } from "react";
import {
  Typography,
  Box,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Paper
} from "@mui/material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";

const AccordionSx = {
  p: "0 0 6px 0",
  minHeight: 0,
  "& .Mui-expanded": {
    m: "0px",
    minHeight: 0,
  },
  "& .MuiAccordionSummary-content": {
    m: "0 0 0 6px",
  },
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
};

interface IAccordionProps {
  title: string;
  children: React.ReactElement;
  noDivider?: boolean;
}

const FilterAccordionItem: FC<IAccordionProps> = ({
  title,
  children,
  noDivider,
}) => {
  return (
    <>
      <Accordion
        sx={{
          background: "transparent",
          boxShadow: "none",
          "&:before": {
            background: "transparent",
          },
        }}
        disableGutters
      >
        <AccordionSummary
          expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "14px" }} />}
          aria-controls={`panel-${title.replace(/\s/g, "")}`}
          id={`panel-${title.replace(/\s/g, "")}-header`}
          sx={AccordionSx}
        >
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup
            sx={{
              "& .MuiFormControlLabel-root .MuiTypography-root": {
                fontSize: "16px",
              },
            }}
          >
            {children}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      {!noDivider && (
        <Divider sx={{ background: "rgba(255,255,255,0.005)", my: "12px" }} />
      )}
    </>
  );
};

const collectionOptions = [
  "Ergopad Cubes",
  "Wrath of Gods",
  "Hello",
  "Is it me",
  "You're looking for?"
]

const FilterOptions = () => {
  const priceRange = [0, 500];
  const [ergPriceRange, setErgPriceRange] = useState<number[]>(priceRange);
  const [collectionChecks, setCollectionChecks] = useState<boolean[]>([])
  const [collectionSelectAll, setCollectionSelectAll] = useState<boolean>(true);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setErgPriceRange(newValue as number[]);
  };

  useMemo(() => {
    const array = Array.from(collectionOptions, () => true);
    setCollectionChecks(array)
  }, [collectionOptions])

  const collectionCheckHandleChange = (key: number) => {
    setCollectionChecks(collectionChecks => collectionChecks.map((item, i) => i === key ? !item : item))
  }

  const collectionCheckSelectAll = (all: boolean) => {
    setCollectionChecks(collectionChecks => collectionChecks.map(() => all ? true : false))
    setCollectionSelectAll(!collectionSelectAll)
  }

  useEffect(() => {
    const check = collectionChecks.every(Boolean)
    if (check) {
      setCollectionSelectAll(true)
    }
    if (!check) {
      setCollectionSelectAll(false)
    }
  }, [collectionCheckHandleChange])

  return (
    <Paper
    elevation={0}
      sx={{
        p: "24px",
      }}
    >
      <Typography variant="h6" sx={{ mb: '24px' }}>Filters</Typography>

      {/* FILTER BY COLLECTION */}
      <FilterAccordionItem title="Collections">
        <Box sx={{ mx: "6px" }}>
          {collectionOptions.map((option, i) => {
            return (
              <FormControlLabel
                key={i}
                checked={collectionChecks[i]}
                onChange={() => collectionCheckHandleChange(i)}
                control={<Checkbox sx={{ p: "6px 9px" }} size="small" />}
                label={option}
                sx={{ display: 'block' }}
              />
            )
          })}
          <FormControlLabel
            checked={collectionSelectAll}
            onChange={() => collectionCheckSelectAll(!collectionSelectAll)}
            control={<Checkbox sx={{ p: "6px 9px" }} size="small" />}
            label="Select All"
          />
        </Box>
      </FilterAccordionItem>

      {/* FILTER BY DAO SIZE */}
      <FilterAccordionItem title="Price Range">
        <Box sx={{ mx: "12px" }}>
          <Slider
            getAriaLabel={() => "Price Range"}
            value={ergPriceRange}
            onChange={handleChange}
            valueLabelDisplay="auto"
            min={priceRange[0]}
            max={priceRange[1]}
          />
        </Box>
      </FilterAccordionItem>

      {/* FILTER BY DATE CREATED */}
      <FilterAccordionItem title="Initiation Date">
        <Box sx={{ mx: "6px" }}>
          <FormControlLabel
            control={<Checkbox sx={{ p: "6px 9px" }} size="small" />}
            label="24 Hours"
          />
          <FormControlLabel
            control={<Checkbox sx={{ p: "6px 9px" }} size="small" />}
            label="Last week"
          />
          <FormControlLabel
            control={<Checkbox sx={{ p: "6px 9px" }} size="small" />}
            label="Past month"
          />
          <FormControlLabel
            control={<Checkbox sx={{ p: "6px 9px" }} size="small" />}
            label="Past year"
          />
          <FormControlLabel
            control={<Checkbox sx={{ p: "6px 9px" }} size="small" />}
            label="All time"
          />
        </Box>
      </FilterAccordionItem>
    </Paper>
  );
};

export default FilterOptions;
