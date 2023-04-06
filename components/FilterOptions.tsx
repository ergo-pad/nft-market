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

/* Filters

- Price min/max
- Marketplace
- Options: Show Explicit
- Collection -> Search bar with drop-down (complex)
- Sale type: mint, auction, sale, not for sale
- Token type: pack, utility, art, gaming

*/

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
          border: 'none',
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

const saleStatus = [
  "Mint",
  "Sale",
  "Auction",
  "Not For Sale",
]

const FilterOptions = () => {
  const priceRange = [0, 500];
  const [ergPriceRange, setErgPriceRange] = useState<number[]>(priceRange);
  const [saleStatusChecks, setSaleStatusChecks] = useState<boolean[]>([])
  const [saleStatusSelectAll, setSaleStatusSelectAll] = useState<boolean>(true);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setErgPriceRange(newValue as number[]);
  };

  useMemo(() => {
    const array = Array.from(saleStatus, () => true);
    setSaleStatusChecks(array)
  }, [saleStatus])

  const saleStatusCheckHandleChange = (key: number) => {
    setSaleStatusChecks(saleStatusChecks => saleStatusChecks.map((item, i) => i === key ? !item : item))
  }

  const saleStatusCheckSelectAll = (all: boolean) => {
    setSaleStatusChecks(saleStatusChecks => saleStatusChecks.map(() => all ? true : false))
    setSaleStatusSelectAll(!saleStatusSelectAll)
  }

  useEffect(() => {
    const check = saleStatusChecks.every(Boolean)
    if (check) {
      setSaleStatusSelectAll(true)
    }
    if (!check) {
      setSaleStatusSelectAll(false)
    }
  }, [saleStatusCheckHandleChange])

  return (
    <>
      <Typography variant="h6" sx={{ mb: '24px' }}>Filter</Typography>

      {/* FILTER BY SALE STATUS */}
      <FilterAccordionItem title="Sale Status">
        <Box sx={{ mx: "6px" }}>
          {saleStatus.map((option, i) => {
            return (
              <FormControlLabel
                key={i}
                checked={saleStatusChecks[i]}
                onChange={() => saleStatusCheckHandleChange(i)}
                control={<Checkbox sx={{ p: "6px 9px" }} size="small" />}
                label={option}
                sx={{ display: 'block' }}
              />
            )
          })}
          <FormControlLabel
            checked={saleStatusSelectAll}
            onChange={() => saleStatusCheckSelectAll(!saleStatusSelectAll)}
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
      <FilterAccordionItem title="Initiation Date" noDivider>
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
    </>
  );
};

export default FilterOptions;
