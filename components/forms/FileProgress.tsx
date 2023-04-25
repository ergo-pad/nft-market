import React, { FC, useState, useEffect } from 'react';
import { ipfsUpload } from '@utils/nft-storage';
import { IFileData, IFileUrl } from '@components/forms/FileUploadAreaIpfs'
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Avatar,
  LinearProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { bytesToSize, aspectRatioResize } from "@utilities/general";

interface IFileProgressProps {
  fileData: IFileData;
  upload: boolean;
  index: number;
  deleteFile: Function;
  setResponse: React.Dispatch<React.SetStateAction<IFileUrl[]>>;
}

const FileProgress: FC<IFileProgressProps> = ({ fileData, upload, index, deleteFile, setResponse }) => {
  const [uploaded, setUploaded] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleUpload = async () => {
    const result = await ipfsUpload(fileData, (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setProgress(percentCompleted);
    });
    if (result !== undefined) {
      setResponse(prevArray => {
        return [...prevArray, result]
      })
      setUploaded(true)
    }
    console.log(result);
  };

  useEffect(() => {
    if (upload && !uploaded) handleUpload()
  }, [upload])

  return (
    <>
      <ListItem
        // key={i}
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => deleteFile(index)}
          >
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar src={fileData.previewImage} variant="rounded" />
        </ListItemAvatar>
        <ListItemText
          primary={fileData.currentFile.name}
          secondary={bytesToSize(fileData.currentFile.size)}
          sx={{
            "& .MuiTypography-body2": {
              mb: 0,
            },
          }}
        />
      </ListItem>
      <LinearProgress variant="determinate" value={progress} />
    </>
  );
};

export default FileProgress;