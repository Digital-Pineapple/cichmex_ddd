import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { toPng } from "html-to-image";
import Grid from '@mui/material/Grid'
import Image from "mui-image";
import { Button, Typography } from "@mui/material";

const PdfToImage = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageImages, setPageImages] = useState([]);
  

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

        const response = await fetch(file);
        const pdfData = await response.arrayBuffer();

        const loadingTask = pdfjs.getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;

        const images = [];
        for (let i = 0; i < pdf.numPages; i++) {
          const canvas = document.createElement("canvas");
          const page = await pdf.getPage(i + 1);
          const scale = 0.5;

          const viewport = page.getViewport({ scale });
          const canvasContext = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext,
            viewport,
          };

          await page.render(renderContext);

          const imageDataUrl = await toPng(canvas); // Convierte el canvas a imagen PNG
          images.push(imageDataUrl);
        }
        
        setPageImages(images);
        setNumPages(pdf.numPages);
        
      } catch (error) {
        console.log("Error al cargar el PDF:", error);
      }
    };

    fetchPDF();
  }, []);

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
 
  return (
    <>
      <Grid
        container
        maxHeight={400}
        justifyContent={'center'}
      >
        <Document  file={file} onLoadSuccess={handleDocumentLoadSuccess}>
          <Page scale={0.7} pageNumber={pageNumber} />
        </Document>
      </Grid>
      <Grid container
      >
        {pageImages.map((imageDataUrl, index) => (
        <object
        data={imageDataUrl}
        key={index}
        alt={`Page ${index + 1}`}
        />
        ))}
          
      </Grid>
      <Grid
      width={'100%'}
      position={'absolute'}
      top={'70%'}
      display='flex'
      justifyContent={'center'}
      >
        
          <Button variant="contained" color='primary'
          disabled={pageNumber<=1}
          onClick={() => handlePageChange(pageNumber - 1)}
          sx={{mr:2}}
          >
          anterior
          </Button>
        <Button
         variant="contained" color="primary"
          disabled={pageNumber >= numPages}
          onClick={() => handlePageChange(pageNumber + 1)}
        >
          Siguiente
        </Button>
      </Grid>
     
      </>
  );
};

export default PdfToImage;
