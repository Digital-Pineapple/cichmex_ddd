import PDFDocument from 'pdfkit-table';
import qr from 'qr-image';
import { MomentService } from '../shared/infrastructure/moment/MomentService';
import fs from 'fs';
import path from 'path';

export function buildReportSectionPDF(section: any, dataCallback: any, endCallback: any) {
    const { _id, name, aisle, stock, zone } = section[0]
    // const localDate = momentService.convertUtcToLocal(orderData.createdAt);
    const doc = new PDFDocument();
    doc.on('data', dataCallback);
    doc.on('end', endCallback);
   
    const column1X = 80;  
    const column2X = 350;
    
    let currentY = doc.y; // Coordenada Y inicial
    // Generar código QR con la información de la orden
    // const qrData = JSON.stringify({ order_id: orderData.order_id });
    // const qrImage = qr.imageSync(qrData, { type: 'png' });
    const writeStream = fs.createWriteStream('output.pdf');
    const imagePath = path.join(__dirname, '../shared/assets/CHMX/Imagotipo CHMX Negro.png');
    doc.pipe(writeStream);

    const qrBuffer = qr.imageSync(JSON.stringify(_id), { type: 'png' });



    doc.image(imagePath, 450, doc.y - 20, { width: 80, align: 'right' });
    doc.image(qrBuffer, column2X, currentY, { width: 200, align: 'center' });
    // Primera columna
    doc.fontSize(20);
    doc.text(`Sección: ${name}`, column1X, currentY +50, { align: 'left' });
    doc.fontSize(14);
    doc.text(`Pasillo: ${aisle.name}`, column1X, doc.y, { align: 'left' });
    doc.text(`Zona: ${zone.name}`, column1X, doc.y, { align: 'left' });
    
    doc.end();
   
     
}
