import PDFDocument from 'pdfkit-table';
import qr from 'qr-image';
import { MomentService } from '../shared/infrastructure/moment/MomentService';

export function buildPDF(orderData: any, dataCallback: any, endCallback: any) {
    
    const momentService = new MomentService();
    const status = (value: string) => {
        if (value === 'approved') {
            return 'aprobado';
        } else if (value === 'pending') {
            return 'pendiente';
        } else if (value === 'rejected') {
            return 'rechazado';
        }
        return 'desconocido'; // Valor por defecto
    };

    const typeDelivery = (value: any) => {
        return value.deliveryLocation ? 'Entrega a domicilio' : 'Punto de entrega';
    };

    const deliveryLocation = (data: any) => {
        if (data.deliveryLocation) {
            return [
                `Código Postal: ${data.deliveryLocation.zipcode}`,
                `Estado: ${data.deliveryLocation.state}`,
                `Municipio: ${data.deliveryLocation.municipality}`,
                `Localidad: ${data.deliveryLocation.neighborhood}`,
                `Calle: ${data.deliveryLocation.street}`,
                `No Ext: ${data.deliveryLocation.numext}`,
                `No Int: ${data.deliveryLocation.numint ?data.deliveryLocation.numint : 'S/N'}`,
                `Referencia: ${data.deliveryLocation.reference ? data.deliveryLocation.reference:'Sin información'}`,
                `Destinatario: ${data.deliveryLocation.btwstreet ? data.deliveryLocation.btwstreet : 'Sin información' }`
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


    const localDate = momentService.convertUtcToLocal(orderData.createdAt);
    const doc = new PDFDocument();
    doc.on('data', dataCallback);
    doc.on('end', endCallback);
    doc.fontSize(15);

 // Configuración de las coordenadas de las dos columnas
const column1X = 50;  // Coordenada X para la primera columna
const column2X = 250;
const column3X = 400; // Coordenada X para la segunda columna
 // Coordenada X para la segunda columna
let currentY = doc.y; // Coordenada Y inicial
// Generar código QR con la información de la orden
const qrData = JSON.stringify({ order_id: orderData.order_id });
const qrImage = qr.imageSync(qrData, { type: 'png' });

// Primera columna
doc.text(`Orden: ${orderData.order_id}`, column1X, currentY, { align: 'left' });
doc.moveDown(0.2);
currentY = doc.y;
doc.fontSize(8);
doc.text(`Cliente:  ${orderData.user_id?.fullname}`, column1X, currentY);
doc.text(`Correo:  ${orderData.user_id?.email}`, column1X, doc.y);
doc.text(`Status de pago:  ${status(orderData?.payment_status)}`, column1X, doc.y);
doc.text(`Fecha de pedido: ${localDate}`, column1X, doc.y);
doc.text(`Tipo de envío: ${typeDelivery(orderData)}`, column2X, currentY);
doc.moveDown(0.2);

// Segunda columna
currentY = doc.y; // Usar la misma coordenada Y después de la primera columna
doc.text(`Dirección de envío:`, column2X, currentY + 2);
doc.text(`${deliveryLocation(orderData)}`, column2X , doc.y);
    // Insertar la imagen del código QR en el PDF
    doc.image(qrImage, column3X, 40, {
        fit: [200, 200], // Ajustar el tamaño de la imagen
        align: 'right', // Alinear la imagen
        valign: 'center',
    });

    createTable(doc, orderData.products, orderData);

    // Agregar más detalles según sea necesario
    
    doc.end();
}

function createTable(doc: PDFDocument, products: any[], orderData: any) {

    const table = {
        title: "Productos",
        subtitle: "Productos del pedido",
        headers: ["Código", "Nombre", "Cantidad", "Precio"],

        rows: products.map(product => [
           `${product.variant ? product.variant.tag : product.item.tag } `,
            `${product.item.name}-${product.variant ? product.variant.attributes.color: ''}-${product.variant ? product.variant.attributes.size : ''}`,
            product.quantity.toString(),
            `$${product.variant? product.variant.price.toFixed(2): product.item.price.toFixed(2)}`
        ])
    };
    
    // Asegúrate de que `doc.table` sea un método válido
    doc.table(table, {
        width: 350,
        y:180,
        x:50
    });
    
    const tableBottomPosition = doc.y; // Obtiene la posición Y después de la tabla
    doc.text(`Descuento: $${orderData.discount ? orderData?.discount?.toFixed(2) : '0.00'}`, { align: 'center' });
    doc.text(`SubTotal: $${orderData?.subTotal.toFixed(2)}`, { align: 'center' });
    doc.text(`Costo de envio: $${orderData?.shipping_cost ? orderData?.shipping_cost : 'N/A' }`, { align: 'center' });
    doc.text(`Total: $${orderData?.total?.toFixed(2)}`, { align: 'center' });

    // Mover la posición Y hacia abajo si es necesario para el espaciado
    doc.y = tableBottomPosition + 40; // Ajusta el espaciado según sea necesario
}
