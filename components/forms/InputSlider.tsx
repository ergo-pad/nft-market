import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import { IDataObject } from '@components/create/PackTokenSection';

interface IInputSliderProps {
  step?: number;
  name: string;
  min?: number;
  max?: number;
  value: number;
  variant?: "filled" | "standard" | "outlined";
  data: IDataObject[];
}

const InputSlider: FC<IInputSliderProps> = (props) => {
  const [value, setValue] = React.useState<number | string | Array<number | string>>(
    1,
  );

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const e = {
      ...props,
      target: {
        value: newValue,
      },
    }
    // props.onChange(e);
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
            value={props.value}
            // id={props.id}
            // label={props.label}
            name={props.name}
            // onChange={props.onChange}
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
            value={props.value}
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