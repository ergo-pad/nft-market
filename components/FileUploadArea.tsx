import React, { ChangeEvent, FC, useState } from 'react';
import {
  Grid,
  Container,
  Typography,
  Box,
  FormControl,
  Input,
  useTheme,
  InputLabel
} from '@mui/material'

interface IFileUploadAreaProps {
  fileData: File;
  setFileData: React.Dispatch<React.SetStateAction<File>>
}

const FileUploadArea: FC<IFileUploadAreaProps> = ({ fileData, setFileData }) => {
  const theme = useTheme()

  const onFileChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    if ('files' in event.target && event.target.files != undefined) {
      setFileData(event.target.files?.[0]);
    }
  }

  return (
    <Box sx={{
      background: theme.palette.background.paper,
      borderRadius: '12px',
      p: '12px',
      display: 'block',
      position: 'relative',
      // border: `1px solid ${theme.palette.divider}`,
      mb: '24px',
    }}>
      <FormControl
        sx={{
          // m: '12px',
          borderRadius: '12px',
          width: '100%',
          border: `2px dashed ${theme.palette.divider}`,
          '&:hover': {
            background: theme.palette.action.hover,
          }
        }}
      >
        <Input
          type="file"
          id="file"
          title=""
          onChange={onFileChange}
          inputProps={{
            accept: "image/*"
          }}
          sx={{
            zIndex: 10,
            opacity: 0,
            '& input': {
              width: '100%',
              height: '100px',
              '& title': {
                display: 'none',
              }
            },
            '&::before': {
              display: 'none',
            },
            '&::after': {
              display: 'none',
            }
          }}
        />
        
      </FormControl>
      <Typography
          sx={{
            textAlign: 'center',
            position: 'absolute', 
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1
          }}
        >
          Drag and drop an image or click to choose.
        </Typography>
    </Box>
  );
};

export default FileUploadArea;