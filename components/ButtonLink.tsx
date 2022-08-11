import NextLink, { LinkProps } from 'next/link';
import { FC } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { sizeHeight } from '@mui/system';

const ButtonLink: FC<LinkProps & ButtonProps> = ({
  as,
  children,
  href,
  replace,
  scroll,
  shallow,
  classes,
  color,
  disabled,
  disableElevation,
  disableFocusRipple,
  endIcon,
  fullWidth,
  size,
  startIcon,
  sx,
  variant,
  ...rest
}) => (
  <NextLink
    as={as}
    href={href}
    passHref
    replace={replace}
    scroll={scroll}
    shallow={shallow}
  >
    <Button
      classes={classes}
      color={color}
      disabled={disabled}
      disableElevation={disableElevation}
      disableFocusRipple={disableFocusRipple}
      endIcon={endIcon}
      fullWidth={fullWidth}
      size={size}
      startIcon={startIcon}
      sx={sx}
      variant={variant}
    >
      {children}
    </Button>
  </NextLink>
);

export default ButtonLink;