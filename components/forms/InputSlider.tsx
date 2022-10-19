import React, { FC, useState, useEffect } from 'react';
import {
  Checkbox,
  TextField,
  Slider,
  Grid,
  Box,
  Icon
} from '@mui/material';
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
  const [locked, setLocked] = useState(false)

  const settingData = (value: number) => {
    const total = data[dataIndex].probabilities?.reduce((sum, value) => {
      return sum + value.probability;
    }, 0);
    let amountLocked = data[dataIndex].probabilities?.reduce((sum, value) => {
      if (value.locked === true) return sum
      return sum++;
    }, 0);
    if (amountLocked == undefined) {
      amountLocked = 0
    }
    const arrayItems = data[dataIndex].probabilities!.length - amountLocked
    let newArray = data[dataIndex].probabilities?.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          probability: Number(value)
        }
      }
      else if (
        total &&
        arrayItems &&
        (item.probability - ((total - 1) / (arrayItems - 1))) >= 0 &&
        item.locked != true
      ) {
        return {
          ...item,
          probability: Number((item.probability - ((total - 1) / (arrayItems - 1))).toFixed(3))
        }
      }
      return item
    })
    let newArrayReduced: { rarity: string; probability: number; }[] = []
    if (newArray && (newArray.reduce((sum, value) => {
      return sum + value.probability;
    }, 0) > 1)) {
      let remainder = newArray.reduce((sum, value) => {
        return sum + value.probability;
      }, 0) - 1
      newArrayReduced = newArray.map((item, i) => {
        if (i === index) {
          return item
        }
        else if (remainder > item.probability) {
          remainder = remainder - item.probability
          return {
            ...item,
            probability: 0.000
          }
        }
        else if (remainder <= item.probability) {
          return {
            ...item,
            probability: item.probability - remainder
          }
        }
        return item
      })
    }
    const newData = data.map((item, i) => {
      if (i === dataIndex) {
        return {
          ...item,
          probabilities: newArrayReduced.length > 0 ? newArrayReduced : newArray
        }
      }
      return item
    })
    setData(newData)
  }

  useEffect(() => {
    if (data[dataIndex].probabilities![index].probability != NaN) {
      setValue(data[dataIndex].probabilities![index].probability);
      setSliderValue(data[dataIndex].probabilities![index].probability)
    }
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
      if (Number(e.target.value) != NaN && e.target.value !== '.') {
        setLocked(true)
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

  const handleLockedChange = () => {
    setLocked(!locked)
    let newArray = data[dataIndex].probabilities?.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          locked: !locked
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

  return (
    <Box>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={5}>
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
        <Grid item xs>
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
        <Grid item xs="auto">
          <Checkbox
            checked={locked}
            onChange={handleLockedChange}
            inputProps={{ 'aria-label': 'Checkbox demo' }}
            icon={<Icon>lock_outlined</Icon>}
            checkedIcon={<Icon>lock</Icon>}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InputSlider;