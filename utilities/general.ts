export const bytesToSize = (bytes: any) => {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  var i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

export const aspectRatioResize = (sourceWidth: number, sourceHeight: number, maxWidth: number, maxHeight: number) => {
  const isLandscape: boolean = sourceWidth > sourceHeight;

  let newHeight: number;
  let newWidth: number;

  if (isLandscape) {
    newHeight = maxWidth * sourceHeight / sourceWidth;
    newWidth = maxWidth;
  }
  else {
    newWidth = maxHeight * sourceWidth / sourceHeight;
    newHeight = maxHeight;
  }

  return {
    width: newWidth.toString() + 'px', 
    // height: newHeight.toString() + 'px',
    '&::after': {
      paddingTop: (newHeight / newWidth * 100).toString() + '%',
      display: 'block',
      content: '""'
    },
  }
}