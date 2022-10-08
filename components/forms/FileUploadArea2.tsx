import React, { ChangeEvent, FC, useState } from 'react';
import {
  Grid,
  Container,
  Typography,
  Button,
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
  fileData: IFileData[];
  setFileData: React.Dispatch<React.SetStateAction<IFileData[]>>;
  title?: string;
  expectedImgHeight?: number;
  expectedImgWidth?: number;
  placeholderImgUrl?: string;
  type?: 'banner' | 'avatar' | false;
  multiple?: boolean;
  sx?: SxProps;
}

const FileUploadArea2: FC<IFileUploadAreaProps> = ({
  fileData,
  setFileData,
  title,
  expectedImgHeight,
  expectedImgWidth,
  placeholderImgUrl,
  type,
  multiple,
  sx
}) => {
  const theme = useTheme()
  const [dropHover, setDropHover] = useState('')

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropHover('#f00')
    e.stopPropagation();
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropHover('')
    e.stopPropagation();
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropHover('')
    onFileChange(e)
    e.stopPropagation();
  };

  const onFileChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | React.DragEvent<HTMLDivElement>): void => {
    if ('files' in event.target && event.target.files?.[0] != undefined) {
      Array.from(event.target.files).forEach((file: File, i: number) => {
        if (i === 0) { // make sure to erase the existing empty object first
          setFileData([{
            currentFile: file,
            previewImage: URL.createObjectURL(file),
            progress: 0,
            message: ""
          }])
        }
        else {
          setFileData(files => [...files, {
            currentFile: file,
            previewImage: URL.createObjectURL(file),
            progress: 0,
            message: ""
          }])
        }
      })
    }
    else {
      setFileData([{
        currentFile: {} as File,
        previewImage: "",
        progress: 0,
        message: ""
      }])
    }
    console.log(fileData)
  }

  const [isLoading, setIsLoading] = React.useState(false);
  const inputFileRef = React.useRef<HTMLInputElement | null>(null);

  const handleOnClick = async () => {

    /* If file is not selected, then show alert message */
    if (fileData[0].currentFile.name == undefined) {
      console.log('Please, select the file(s) you want to upload');
      return;
    }

    setIsLoading(true);

    /* Add files to FormData */
    const formData = new FormData();
    Object.values(fileData).forEach(file => {
      formData.append('file', file.currentFile);
    })

    /* Send request to the api route */
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const body = await response.json() as { status: 'ok' | 'fail', message: string };

    console.log(body.message);

    if (body.status === 'ok') {
      console.log('success')
      // Do some stuff on successfully upload
    } else {
      // Do some stuff on error
    }

    setIsLoading(false);
  };

  const sxSetting = sx ? sx : {}

  return (
    <>
      <Box
        sx={{
          background: theme.palette.background.paper,
          borderRadius: '12px',
          p: '12px',
          ...sxSetting
        }}
      >
        <Typography sx={{
          color: theme.palette.text.secondary,
          mb: '12px',
        }}>
          {title}
        </Typography>
        <Input
          type="file"
          ref={inputFileRef}
          onChange={onFileChange}
          inputProps={{
            accept: "image/*",
            multiple: multiple ? true : false
          }}
          sx={{ display: 'none' }}
          id="file-input"
        />
        <InputLabel htmlFor="file-input">
          <Box
            sx={{
              borderRadius: '12px',
              width: '100%',
              height: '100%',
              minHeight: '120px',
              background: dropHover ? dropHover : '',
              border: `2px dashed ${theme.palette.divider}`,
              cursor: 'pointer',
              '&:hover': {
                background: theme.palette.action.hover,
              }
            }}
            onDrop={e => handleDrop(e)}
            onDragOver={e => handleDragOver(e)}
            onDragEnter={e => handleDragEnter(e)}
            onDragLeave={e => handleDragLeave(e)}
            onClick={e => {}}
          >
            <Typography sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              Drag files here to upload
            </Typography>
          </Box>
        </InputLabel>
      </Box>
      <Button onClick={() => handleOnClick()} disabled={isLoading}>
        Upload
      </Button>
    </>
  );
};

export default FileUploadArea2;