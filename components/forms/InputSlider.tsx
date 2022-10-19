import React, { FC, useState, useEffect } from 'react';
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
  variant?: "filled" | "standard" | "outlined";
  id: string;
  label: string;
  dataIndex: number;
  index: number;
  data: IDataObject[];
  setData: React.Dispatch<React.SetStateAction<IDataObject[]>>;
}

const InputSlider: FC<IInputSliderProps> = ({ step, name, min, max, variant, id, label, dataIndex, index, data, setData }) => {
  const [value, setValue] = useState<number | string>('')
  const [sliderValue, setSliderValue] = useState<number>(0)

  const settingData = (value: number) => {
    const test = data[dataIndex].probabilities?.reduce((sum, value) => {
      return sum + value.probability;
    }, 0);
    const arrayItems = data[dataIndex].probabilities?.length
    const newArray = data[dataIndex].probabilities?.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          probability: Number(value)
        }
      }
      else if (test && arrayItems) {
        return {
          ...item,
          probability: item.probability - ((test - 1) / (arrayItems - 1))
        }
      }
      return item
    })
    const newData = data.map((item, i) => {
      if (i === dataIndex) {
        return {
          ...item,
          probabilities: newArray
        }
      }
      return item
    })
    setData(newData)
  }

  useEffect(() => {
    setValue(data[dataIndex].probabilities![index].probability);
    setSliderValue(data[dataIndex].probabilities![index].probability)
  }, [data[dataIndex].probabilities![index].probability])

  const handleSliderChange = (e: Event, newValue: number | number[]) => {
    setValue(Number(newValue));
    setSliderValue(Number(newValue))
    settingData(Number(newValue))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var regex = /^\d*\.?\d*$/;
    if (e.target.value.match(regex)) {
      setValue(e.target.value);
      if (Number(e.target.value) != NaN) {
        setSliderValue(Number(e.target.value))
        settingData(Number(e.target.value))
      }
    }
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
      setSliderValue(0)
      settingData(0)
    }
    else if (max && value > max) {
      setValue(max);
      setSliderValue(max)
      settingData(max)
    }
  };

  return (
    <Box>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={7}>
          <TextField
            fullWidth
            variant={variant ? variant : "filled"}
            value={value}
            id={id}
            label={label}
            name={name}
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              inputMode: 'numeric',
              step: 'any',
              min: min,
              max: max,
            }}
          />
        </Grid>
        <Grid item xs={5} sx={{ pr: '5px' }}>
          <Slider
            value={sliderValue}
            onChange={handleSliderChange}
            step={step ? step : 1}
            min={min ? min : 0}
            max={max}
            aria-labelledby="input-slider"
            sx={{ width: '100%' }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InputSlider;