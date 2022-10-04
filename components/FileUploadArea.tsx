import React, { ChangeEvent, FC, useState } from 'react';
import {
  Grid,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  InputAdornment,
  FilledInput,
  TextField,
  ToggleButtonGroup,
  Switch,
  ToggleButton,
  SelectChangeEvent,
  Input,
  FormHelperText
} from '@mui/material'

interface IFileUploadAreaProps {
  fileData: File;
  setFileData: React.Dispatch<React.SetStateAction<File>>
}

const FileUploadArea: FC<IFileUploadAreaProps> = ({ fileData, setFileData }) => {
  const onFileChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    if ('files' in event.target) {
      setFileData({ selectedFile: event.target.files?.[0] });
    }
  }

  return (
    <>
      <FormControl sx={{ background: '#000' }}>
        <Input
          type="file"
          id="collection-logo-upload"
          aria-describedby="collection-logo-upload-helper-text"
          onChange={onFileChange}
          sx={{
            background: '#000',
            opacity: 0,
            '&: hover': {
              opacity: 1
            }
          }}
        />
        {/* <FormHelperText id="collection-logo-upload-helper-text">Upload Logo</FormHelperText> */}
      </FormControl>
    </>
  );
};

export default FileUploadArea;