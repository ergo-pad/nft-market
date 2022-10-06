import React, { ChangeEvent, FC, useState } from 'react';
import {
  Grid,
  Container,
  Typography,
  Box,
  FormControl,
  Input,
  useTheme,
  InputLabel,
  SxProps
} from '@mui/material'
import Image from 'next/image'
import { bytesToSize } from '@utilities/general'

interface IFileData {
  currentFile: File;
  previewImage: string;
  progress: number;
  message: string;
}

interface IFileUploadAreaProps {
  fileData: IFileData;
  setFileData: React.Dispatch<React.SetStateAction<IFileData>>;
  title?: string;
  boxWidth?: string;
  boxMaxWidth?: string;
  expectedImgHeight?: number;
  expectedImgWidth?: number;
  placeholderImgUrl?: string;
  type?: 'banner' | 'avatar' | false;
  multiple?: boolean;
  sx?: SxProps;
}

const FileUploadArea: FC<IFileUploadAreaProps> = ({
  fileData,
  setFileData,
  title,
  boxWidth,
  boxMaxWidth,
  expectedImgHeight,
  expectedImgWidth,
  placeholderImgUrl,
  type,
  multiple,
  sx
}) => {
  const theme = useTheme()

  const onFileChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    if ('files' in event.target && event.target.files?.[0] != undefined) {
      setFileData({
        currentFile: event.target.files[0],
        previewImage: URL.createObjectURL(event.target.files[0]),
        progress: 0,
        message: ""
      })
    }
    else {
      setFileData({
        currentFile: {} as File,
        previewImage: "",
        progress: 0,
        message: ""
      })
    }
  }

  return (
    <Box sx={sx && sx}>
      <Box sx={{
        background: theme.palette.background.paper,
        borderRadius: '12px',
        p: '12px',
        display: 'block',
        position: 'relative',
        width: boxWidth ? boxWidth : '100%',
        maxWidth: boxMaxWidth ? boxMaxWidth : '100%',
      }}>
        {title && <InputLabel htmlFor="file" sx={{ mb: '12px' }}>
          {title}
        </InputLabel>}
        <FormControl
          sx={{
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
                height: '160px',
                '&:hover': {
                  cursor: 'pointer',
                },
              },
              '&::before': {
                display: 'none',
              },
              '&::after': {
                display: 'none',
              }
            }}
          />
          <Box
            sx={{
              textAlign: 'center',
              position: 'absolute',
              width: '100%',
              p: '24px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}
          >
            {fileData?.previewImage != '' && fileData?.currentFile.name != undefined ?
              <Box sx={{ width: '90%', textAlign: 'left', mx: 'auto' }}>
                <Box
                  sx={{
                    width: '120px',
                    height: '120px',
                    position: 'relative',
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    borderRadius: type === 'avatar' ? '500px' : '12px',
                    overflow: 'hidden'
                  }}
                >
                  <Image src={fileData.previewImage} layout="fill" objectFit="contain" />
                </Box>
                <Box sx={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  textAlign: 'left',
                  ml: '12px'
                }}>
                  <Typography>
                    {fileData.currentFile.name}
                  </Typography>
                  <Typography>
                    {bytesToSize(fileData.currentFile.size)}
                  </Typography>
                </Box>
              </Box> :
              <>
                <Typography sx={{ color: theme.palette.text.secondary, }}>
                  Drag and drop an image or click to choose.
                </Typography>
                <Typography sx={{ color: theme.palette.text.secondary, }}>
                  Recommended dimensions: {' ' + expectedImgWidth + 'px Wide by ' + expectedImgHeight + 'px High'}
                </Typography>
              </>
            }
          </Box>
        </FormControl>
      </Box>
    </Box>
  );
};

export default FileUploadArea;