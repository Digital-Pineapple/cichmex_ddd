import PDFDocument from 'pdfkit-table';
import qr from 'qr-image';
import { MomentService } from '../shared/infrastructure/moment/MomentService';
import fs from 'fs';
import path from 'path';

export function buildInputsReportPDF(report: any, dataCallback: any, endCallback: any) {
    const { _id, in_storehouse, responsible, inputs, user_received, date_received, createdAt } = report

    const momentService = new MomentService();
    const status = (value: string) => {
        if (value) {
            return 'Autorizado en almacén ';
        } else {
            return 'Pendiente por autorizar';
        }
    };

    const TYPE_USERS = {
        "SUPER-ADMIN": "Super Administrador",
        "ADMIN": "Administrador",
        "WAREHOUSE-MANAGER": "Encargado de almacén",
        "WAREHOUSEMAN": "Almacenista",
        "no_data": "Sin información",
    };
    const defaultTypeUser = "no_data";
    const RenderName = (data: any) => TYPE_USERS[data] || defaultTypeUser;

    const deliveryLocation = (data: any) => {
        if (data.deliveryLocation) {
            return [
                `Código Postal: ${data.deliveryLocation.zipcode}`,
                `Estado: ${data.deliveryLocation.state}`,
                `Municipio: ${data.deliveryLocation.municipality}`,
                `Localidad: ${data.deliveryLocation.neighborhood}`,
                `Calle: ${data.deliveryLocation.street}`,
                `No Ext: ${data.deliveryLocation.numext}`,
                `No Int: ${data.deliveryLocation.numint ? data.deliveryLocation.numint : 'S/N'}`,
                `Referencia: ${data.deliveryLocation.reference ? data.deliveryLocation.reference : 'Sin información'}`,
                `Destinatario: ${data.deliveryLocation.btwstreet ? data.deliveryLocation.btwstreet : 'Sin información'}`
            ].join('\n');
        } else {
            return [
                `Nombre de sucursal: ${data.branch.name}`,
                `Código Postal: ${data.branch.location.cp}`,
                `Estado: ${data.branch.location.state}`,
                `Municipio: ${data.branch.location.municipality}`,
                `Dirección: ${data.branch.location.direction}`,
                `Numero de teléfono: ${data.branch.phone_number}`,
            ].join('\n');
        }
    };

    // Función para crear la tabla con información de ubicación
    function createTable(doc: any, inputsData: any[]) {
        // Definir las columnas de la tabla
        const tableTop = doc.y + 10;
        const tableHeaders = ['Producto', 'SKU', 'Cantidad', 'Ubicación'];
        const columnWidths = [200, 100, 60, 170];
        
        let yPosition = tableTop;
        
        // Dibujar el encabezado de la tabla
        doc.font('Helvetica-Bold');
        doc.fontSize(9);
        
        // Dibujar línea superior de la cabecera
        doc.moveTo(50, yPosition).lineTo(50 + columnWidths.reduce((a, b) => a + b, 0), yPosition).stroke();
        
        let xPosition = 50;
        for (let i = 0; i < tableHeaders.length; i++) {
            doc.text(tableHeaders[i], xPosition + 5, yPosition + 5, {
                width: columnWidths[i],
                align: 'left'
            });
            xPosition += columnWidths[i];
        }
        
        yPosition += 20;
        
        // Dibujar línea inferior de la cabecera
        doc.moveTo(50, yPosition).lineTo(50 + columnWidths.reduce((a, b) => a + b, 0), yPosition).stroke();
        
        // Dibujar las filas de datos
        doc.font('Helvetica');
        
        for (const input of inputsData) {
            xPosition = 50;
            
            // Preparar texto de ubicación
            let locationText = input.location ? input.location.name : 'Sin ubicación asignada';
            
            // Dibujar cada celda de la fila
            doc.text(input.product_detail.name, xPosition + 5, yPosition + 5, {
                width: columnWidths[0],
                align: 'left'
            });
            xPosition += columnWidths[0];
            
            doc.text(input.product_detail.sku, xPosition + 5, yPosition + 5, {
                width: columnWidths[1],
                align: 'left'
            });
            xPosition += columnWidths[1];
            
            doc.text(input.quantity.toString(), xPosition + 5, yPosition + 5, {
                width: columnWidths[2],
                align: 'left'
            });
            xPosition += columnWidths[2];
            
            doc.text(locationText, xPosition + 5, yPosition + 5, {
                width: columnWidths[3],
                align: 'left'
            });
            
            yPosition += 25;
            
            // Dibujar línea inferior de la fila
            doc.moveTo(50, yPosition).lineTo(50 + columnWidths.reduce((a, b) => a + b, 0), yPosition).stroke();
            
            // Comprobar si necesitamos una nueva página
            if (yPosition > doc.page.height - 100) {
                doc.addPage();
                yPosition = 50;
                doc.moveTo(50, yPosition).lineTo(50 + columnWidths.reduce((a, b) => a + b, 0), yPosition).stroke();
            }
        }
        
        doc.y = yPosition + 10;
    }

    // const localDate = momentService.convertUtcToLocal(orderData.createdAt);
    const doc = new PDFDocument();
    doc.on('data', dataCallback);
    doc.on('end', endCallback);
    doc.fontSize(12);

    // Configuración de las coordenadas de las dos columnas
    const column1X = 50;  // Coordenada X para la primera columna
    const column2X = 250;
    const column3X = 350;
    const columntoolbar1X = 50;
    const columntoolbar2X = 350;
    // Coordenada X para la segunda columna
    let currentY = doc.y; // Coordenada Y inicial

    // doc.pipe(writeStream);

    // doc.image(imagePath, 440, doc.y - 50, { width: 100, align: 'right' });
    // Primera columna
    doc.fontSize(16);
    doc.text(`Reporte de entrada de productos`, column1X, currentY, { align: 'center' });
    doc.fontSize(8);
    doc.text(`Fecha de creación: ${momentService.convertUtcToLocal(createdAt)}`, column3X, doc.y, { align: 'right' });
    doc.text(`Fecha de recibido: ${momentService.convertUtcToLocal(date_received)}`, column3X, doc.y, { align: 'right' });
    doc.fontSize(10);
    doc.text(`Folio de entrada: ${_id}`, column1X, doc.y + 10, { align: 'left' });
    doc.moveDown(1);

    createTable(doc, inputs);

    currentY = doc.y + 70;

    doc.fontSize(8);
    doc.underline(columntoolbar1X, currentY - 5, 200, 1)
    doc.text(`Firma`, 140, currentY);
    doc.text(`Responsable de entrada:`, columntoolbar1X, doc.y);
    doc.text(`Nombre:  ${responsible.fullname}`, columntoolbar1X, doc.y);
    doc.text(`Correo:  ${responsible.email}`, columntoolbar1X, doc.y);
    doc.text(`Tipo de usuario: ${RenderName(responsible.type_user.role[0])}`, columntoolbar1X, doc.y);
    doc.moveDown(0.2);

    doc.underline(columntoolbar2X, currentY - 5, 200, 1)
    doc.text(`Firma`, 450, currentY);
    doc.text(`Responsable de recibo en almacén:`, columntoolbar2X, doc.y);
    doc.text(`Nombre: ${user_received.fullname}`, columntoolbar2X, doc.y);
    doc.text(`Correo: ${user_received.email}`, columntoolbar2X, doc.y);
    doc.text(`Tipo de usuario: ${RenderName(user_received.type_user.role[0])}`, columntoolbar2X, doc.y);

    doc.end();
}

function createTable(doc: PDFDocument, products: any[]) {
    const table = {
        subtitle: "Productos",
        headers: ["Código", "Nombre", "Cantidad", "Cantidad recibida", "Precio U.", 'Total', 'Notas'],

        rows: products.map(product => [
            `${product.product_detail.tag} `,
            `${product.product_detail.name} `,
            `${product.quantity} `,
            `${product.quantity_received ? product.quantity_received : 'Sin información'} `,
            `${product.product_detail.price} `,
            `${product.quantity * product.product_detail.price} `,
            `${product.notes ? product.notes : ''} `,
        ]),
    };

    const suma = products.reduce((acc, i) => acc + (i.quantity * i.product_detail.price), 0);

    doc.table(table, {
        width: 500,
        y: 140,
        x: 50,

    });
    doc.fontSize(12);
    doc.text(`Total: $${suma.toFixed(2)}`, 400, doc.y, { align: 'right' });


}
