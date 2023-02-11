import React, { ChangeEvent, FC, useEffect, useState } from 'react';
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
  SxProps,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Avatar
} from '@mui/material'
import Image from 'next/image'
import { bytesToSize, aspectRatioResize } from '@utilities/general'
import DeleteIcon from '@mui/icons-material/Delete';

interface IFileData {
  currentFile: File;
  previewImage: string;
  progress: number;
  message: string;
}

const fileInitObject: IFileData = {
  currentFile: {} as File,
  previewImage: '',
  progress: 0,
  message: ""
}

const fileInit = [fileInitObject]

interface IFileUploadAreaProps {
  fileUrls?: string[];
  setFileUrls?: React.Dispatch<React.SetStateAction<string[]>>;
  title?: string;
  expectedImgHeight?: number;
  expectedImgWidth?: number;
  type?: 'avatar';
  multiple?: boolean;
  sx?: SxProps;
  imgFill?: boolean;
  clearTrigger?: boolean;
  setClearTrigger?: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileUploadArea: FC<IFileUploadAreaProps> = ({
  fileUrls,
  setFileUrls,
  title,
  expectedImgHeight,
  expectedImgWidth,
  type,
  multiple,
  sx,
  imgFill,
  clearTrigger,
  setClearTrigger
}) => {
  const theme = useTheme()
  const [aspect, setAspect] = useState({})
  const [fileData, setFileData] = useState(fileInit)

  useEffect(() => {
    if (expectedImgHeight && expectedImgWidth) {
      setAspect(aspectRatioResize(expectedImgWidth, expectedImgHeight, 800, 350))
    }
  }, [])

  useEffect(() => {
    if (!multiple) {
      if (expectedImgHeight && expectedImgWidth) {
        setAspect(aspectRatioResize(expectedImgWidth, expectedImgHeight, 800, 350))
      }
      else {
        let img = document.createElement("img");
        img.src = fileData[0].previewImage
        img.onload = () => {
          setAspect(aspectRatioResize(img.naturalWidth, img.naturalHeight, 800, 300))
        }
      }
    }
  }, [fileData[0].previewImage])

  useEffect(() => {
    clearFiles()
    if (setClearTrigger) setClearTrigger(false)
  }, [clearTrigger])

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
  // const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   e.dataTransfer.dropEffect = 'copy';
  //   e.stopPropagation();
  // };

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
        if (i === 0 && (fileData?.[0]?.previewImage === "" || !multiple)) { // make sure to erase the existing empty object first
          setFileData([{
            currentFile: file,
            previewImage: URL.createObjectURL(file),
            progress: 0,
            message: ""
          }])
          if (type === undefined && expectedImgHeight === undefined && expectedImgWidth === undefined) {
            let img = document.createElement("img");
            img.src = URL.createObjectURL(file)
            img.onload = () => {
              setAspect(aspectRatioResize(img.naturalWidth, img.naturalHeight, 800, 300))
            }
          }
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
    handleUpload()
  }

  const deleteFile = (fileNumber: number) => {
    setFileData(fileData.filter((data, idx) => idx !== fileNumber))
  }

  const [isLoading, setIsLoading] = React.useState(false);
  const inputFileRef = React.useRef<HTMLInputElement | null>(null);

  const handleUpload = async () => {

    /* If file is not selected, then show alert message */
    if (fileData[0].currentFile.name == undefined) {
      console.log('Please, select the file(s) you want to upload');
      return;
    }

    setIsLoading(true);

    /* Add files to FormData */
    const formData = new FormData();
    Object.values(fileData).forEach((file, i) => {
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
      if (setFileUrls) setFileUrls(fileData.map((file, i) => {
        return '/uploads/' + file.currentFile.name
      }))
    } else {
      // Do some stuff on error
    }

    setIsLoading(false);
  };

  return (
    <Box sx={
      sx ? (
        sx
      ) : (
        {
          height: '100%'
        }
      )
    }>
      <Box
        sx={{
          background: theme.palette.mode == 'dark' ? '#242932' : theme.palette.background.paper,
          borderRadius: '6px',
          p: '12px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        {title &&
          <InputLabel
            htmlFor="file"
            sx={{ mb: '12px', position: 'relative', overflow: 'visible' }}
            onClick={e => e.preventDefault()}
          >
            <Grid container justifyContent="space-between">
              <Grid item>
                <Typography>
                  {title}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  onClick={() => handleUpload()} disabled={isLoading}
                >
                  Upload
                </Button>
                <Button
                  size="small"
                  onClick={clearFiles}
                >
                  Clear Data
                </Button>
              </Grid>
            </Grid>


          </InputLabel>}
        <FormControl
          sx={{
            borderRadius: '6px',
            width: '100%',
            height: '100%',
            display: 'block',
            position: 'relative',
            border: `1px dashed ${theme.palette.divider}`,
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
              height: '100%',
              p: imgFill ? '6px' : '24px',
              zIndex: 1,
            }}
          >
            {multiple && fileData[0]?.currentFile.name != undefined ? ( // if multiple files can be added
              <>
                <Typography>Add more (Unique filenames only)</Typography>
                {expectedImgWidth && expectedImgHeight &&
                  <Typography sx={{ color: theme.palette.text.secondary, }}>
                    Recommended dimensions: {' ' + expectedImgWidth + 'px Wide by ' + expectedImgHeight + 'px High'}
                  </Typography>
                }
              </>
            ) : ( // for single file upload areas only: 

              <Box sx={{
                width: '100%',
                height: '100%',
                textAlign: 'center',
                mx: 'auto',
                //     position: 'absolute',
                // left: '50%',
                // top: '50%',
                // transform: 'translate(-50%,-50%)',
              }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', minHeight: '100px' }}>
                  {fileData?.[0]?.previewImage != '' && fileData?.[0]?.currentFile?.name != undefined ? (
                    <>
                      {type === 'avatar' ? (
                        <Box sx={{ mx: 'auto' }}>
                          <Box
                            sx={{
                              width: expectedImgWidth ? expectedImgWidth.toString() + 'px' : '120px',
                              height: expectedImgHeight ? expectedImgHeight.toString() + 'px' : '120px',
                              maxWidth: '240px',
                              maxHeight: '240px',
                              position: 'relative',
                              display: 'inline-block',
                              verticalAlign: 'middle',
                              borderRadius: '240px',
                              overflow: 'hidden'
                            }}
                          >
                            <Image src={fileData[0].previewImage} layout="fill" objectFit="contain" />
                          </Box>
                          {imgFill ? ('') : (
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
                          )}
                        </Box>
                      ) : (
                        <>
                          <Box
                            sx={{
                              borderRadius: '6px',
                              overflow: 'hidden',
                              display: 'block',
                              position: 'relative',
                              maxWidth: '100%',
                              mb: imgFill ? 0 : '12px',
                              mx: 'auto',
                              ...aspect
                            }}
                          >
                            <Image src={fileData[0].previewImage} layout="fill" objectFit="cover" />
                          </Box>
                          {imgFill ? ('') : (
                            <Box>
                              <Typography>
                                {fileData[0].currentFile.name + ' - ' + bytesToSize(fileData[0].currentFile.size)}
                              </Typography>
                            </Box>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Typography sx={{ color: theme.palette.text.secondary, }}>
                        Drag and drop an image or click to choose.
                      </Typography>
                      {expectedImgWidth && expectedImgHeight &&
                        <Typography sx={{ color: theme.palette.text.secondary, }}>
                          Recommended dimensions: {' ' + expectedImgWidth + 'px Wide by ' + expectedImgHeight + 'px High'}
                        </Typography>
                      }
                    </>
                  )}
                </Box>
              </Box>
            )}

          </Box>
        </FormControl>
        {multiple && fileData[0]?.currentFile.name != undefined &&
          <List>
            {fileData.map((file: IFileData, i: number) => {
              return <ListItem key={i}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteFile(i)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar src={fileData[i].previewImage} variant="rounded" />
                </ListItemAvatar>
                <ListItemText
                  primary={file.currentFile.name}
                  secondary={bytesToSize(fileData[i].currentFile.size)}
                  sx={{
                    '& .MuiTypography-body2': {
                      mb: 0
                    }
                  }}
                />
              </ListItem>
            })}
          </List>
        }
      </Box>
    </Box>
  );
};

export default FileUploadArea;