import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';

interface IInputSliderProps {
  label: string;
  min: number;
  max: number;
  id: string;
  step?: number;
  variant?: "filled" | "standard" | "outlined";
}

const InputSlider: FC<IInputSliderProps> = (props) => {
  const [value, setValue] = React.useState<number | string | Array<number | string>>(
    1,
  );

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 1) {
      setValue(1);
    } else if (value > 24) {
      setValue(24);
    }
  };

  return (
    <Box>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={7}>
          <TextField
            fullWidth
            variant={props.variant ? props.variant : "filled"}
            value={value}
            id={props.id}
            label={props.label}
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              inputMode: 'numeric',
              step: props.step ? props.step : 1,
              min: props.min,
              max: props.max,
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
        <Grid item xs={5} sx={{ pr: '5px' }}>
          <Slider
            value={typeof value === 'number' ? value : 1}
            onChange={handleSliderChange}
            min={props.min}
            max={props.max}
            aria-labelledby="input-slider"
            sx={{ width: '100%' }}
          />
        </Grid>

      </Grid>
    </Box>
  );
};

export default InputSlider;