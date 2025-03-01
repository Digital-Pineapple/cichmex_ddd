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
    // Generar código QR con la información de la orden
    // const qrData = JSON.stringify({ order_id: orderData.order_id });
    // const qrImage = qr.imageSync(qrData, { type: 'png' });
    const writeStream = fs.createWriteStream('output.pdf');

    const imagePath = path.join(__dirname, '../shared/assets/CHMX/Imagotipo CHMX Negro.png');



    doc.pipe(writeStream);

    doc.image(imagePath, 440, doc.y - 50, { width: 100, align: 'right' });
    // Primera columna
    doc.fontSize(16);
    doc.text(`Reporte de entrada de productos`, column1X, currentY, { align: 'center' });
    doc.fontSize(8);
    doc.text(`Fecha de creación: ${momentService.convertUtcToLocal(createdAt[0])}`, column3X, doc.y, { align: 'right' });
    doc.text(`Fecha de recibido: ${momentService.convertUtcToLocal(date_received[0])}`, column3X, doc.y, { align: 'right' });
    doc.fontSize(10);
    doc.text(`Folio de entrada: ${_id}`, column1X, doc.y + 10, { align: 'left' });
    doc.moveDown(1);

    createTable(doc, inputs);

    currentY = doc.y + 70;


    doc.fontSize(8);
    doc.underline(columntoolbar1X, currentY - 5, 200, 1)
    doc.text(`Firma`, 140, currentY);
    doc.text(`Responsable de entrada:`, columntoolbar1X, doc.y);
    doc.text(`Nombre:  ${responsible[0].fullname}`, columntoolbar1X, doc.y);
    doc.text(`Correo:  ${responsible[0].email}`, columntoolbar1X, doc.y);
    doc.text(`Tipo de usuario: ${RenderName(responsible[0].type_user.role[0])}`, columntoolbar1X, doc.y);
    doc.moveDown(0.2);

    doc.underline(columntoolbar2X, currentY - 5, 200, 1)
    doc.text(`Firma`, 450, currentY);
    doc.text(`Responsable de recibo en almacén:`, columntoolbar2X, doc.y);
    doc.text(`Nombre: ${user_received[0].fullname}`, columntoolbar2X, doc.y);
    doc.text(`Correo: ${user_received[0].email}`, columntoolbar2X, doc.y);
    doc.text(`Tipo de usuario: ${RenderName(user_received[0].type_user.role[0])}`, columntoolbar2X, doc.y);

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
