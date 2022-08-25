import React, { FC } from "react";
import SvgIcon from "@mui/material/SvgIcon";
import { SxProps } from "@mui/material";

const Logo: FC<{ sx?: SxProps }> = ({ sx }) => {
  return (
    <SvgIcon sx={sx} viewBox="0 0 100 100">
        <polygon points="0,0 100,0 50,100" />
    </SvgIcon>
  );
};

export default Logo;
