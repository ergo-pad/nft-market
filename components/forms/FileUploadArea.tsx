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

const FileUploadArea: FC<IFileUploadAreaProps> = ({
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
    // onFileChange(e)
    e.stopPropagation();
  };

  const clearFiles = () => {
    setFileData([{
      currentFile: {} as File,
      previewImage: "",
      progress: 0,
      message: ""
    }])
  }

  const checkExists = (name: string) => {
    const truth = fileData.some(value => value.currentFile.name === name)
    return truth
  }

  const onFileChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    setDropHover('')
    if ('files' in event.target && event.target.files?.[0] != undefined) {
      Array.from(event.target.files).forEach((file: File, i: number) => {
        if (i === 0 && (fileData?.[0].previewImage === "" || !multiple)) { // make sure to erase the existing empty object first
          setFileData([{
            currentFile: file,
            previewImage: URL.createObjectURL(file),
            progress: 0,
            message: ""
          }])
        }
        else {
          if (!checkExists(file.name)) {
            setFileData(files => [...files, {
              currentFile: file,
              previewImage: URL.createObjectURL(file),
              progress: 0,
              message: ""
            }])
          }
        }
      })
    }
    else if (!multiple) {
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

  return (
    <Box sx={sx && sx}>
      <Box
        sx={{
          background: theme.palette.background.paper,
          borderRadius: '12px',
          p: '12px',
        }}
      >
        {title &&
          <InputLabel
            htmlFor="file"
            sx={{ mb: '12px' }}
            onClick={e => e.preventDefault()}
          >
            {title}
          </InputLabel>}
        <FormControl
          sx={{
            borderRadius: '12px',
            width: '100%',
            height: '100%',
            position: 'relative',
            border: `2px dashed ${theme.palette.divider}`,
            '&:hover': {
              cursor: 'pointer',
              background: theme.palette.action.hover,
            }
          }}
          // onDragOver={e => handleDragOver(e)}
          onDragEnter={e => handleDragEnter(e)}
          onDragLeave={e => handleDragLeave(e)}
        // onDrop={e => handleDrop(e)}
        >
          <Input
            ref={inputFileRef}
            type="file"
            id="file"
            title=""
            onChange={onFileChange}
            inputProps={{
              accept: "image/*",
              multiple: multiple ? true : false
            }}
            sx={{
              zIndex: 10,
              cursor: 'pointer !important',
              opacity: 0,
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              flexGrow: '1',
              '& input': {
                width: '100%',
                height: '100%',
                cursor: 'pointer !important',
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
              position: 'relative',
              background: dropHover ? dropHover : 'none',
              width: '100%',
              cursor: 'pointer',
              p: '24px',
              zIndex: 1,
            }}
          >
            {multiple && fileData[1]?.currentFile.name != undefined ? ( // if there are multiple files
              <>
                {/* {fileData.map((file: File, i: number) => {})} */}
                <Typography>Add more (Unique filenames only)</Typography>
                <Typography sx={{ color: theme.palette.text.secondary, }}>
                      Recommended dimensions: {' ' + expectedImgWidth + 'px Wide by ' + expectedImgHeight + 'px High'}
                    </Typography>
              </>
            ) : (
              <Box sx={{ width: '100%', textAlign: 'center', mx: 'auto' }}>
                {fileData?.[0]?.previewImage != '' && fileData?.[0]?.currentFile?.name != undefined ? (
                  <>
                    {type === 'avatar' ? (
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
                          <Image src={fileData[0].previewImage} layout="fill" objectFit="contain" />
                        </Box>
                        <Box sx={{
                          display: 'inline-block',
                          verticalAlign: 'middle',
                          textAlign: 'left',
                          ml: '12px'
                        }}>
                          <Typography>
                            {fileData[0].currentFile.name}
                          </Typography>
                          <Typography>
                            {bytesToSize(fileData[0].currentFile.size)}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <Box
                          sx={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            mx: 'auto',
                          }}
                        >
                          <Image src={fileData[0].previewImage} layout="fill" objectFit="contain" />
                        </Box>
                        <Box>
                          <Typography>
                            {fileData[0].currentFile.name + ' - ' + bytesToSize(fileData[0].currentFile.size)}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Typography sx={{ color: theme.palette.text.secondary, }}>
                      Drag and drop an image or click to choose.
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary, }}>
                      Recommended dimensions: {' ' + expectedImgWidth + 'px Wide by ' + expectedImgHeight + 'px High'}
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </Box>
        </FormControl>
      </Box >
      <Button onClick={() => handleOnClick()} disabled={isLoading}>
        Upload
      </Button>
      <Button
        onClick={() => { console.log(fileData) }}>
        FIle Data
      </Button>
      <Button
        onClick={clearFiles}
      >
        Clear Data
      </Button>
    </Box >
  );
};

export default FileUploadArea;