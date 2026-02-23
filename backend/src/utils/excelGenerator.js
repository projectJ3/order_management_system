const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const prisma = require('../db');

const EXPORT_DIR = path.join(__dirname, '../../exports');
if (!fs.existsSync(EXPORT_DIR)) fs.mkdirSync(EXPORT_DIR, { recursive: true });

async function generateAdminReport() {
    const workbook = new ExcelJS.Workbook();

    // 1. Orders Sheet
    const orderSheet = workbook.addWorksheet('Orders');
    orderSheet.columns = [
        { header: 'Order ID', key: 'id', width: 40 },
        { header: 'Customer', key: 'name', width: 20 },
        { header: 'Phone', key: 'phone', width: 20 },
        { header: 'Product', key: 'product', width: 20 },
        { header: 'Quantity', key: 'quantity', width: 10 },
        { header: 'Date', key: 'date', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Source', key: 'source', width: 15 }
    ];

    const orders = await prisma.order.findMany({ include: { user: true } });
    orders.forEach(o => {
        orderSheet.addRow({
            id: o.id,
            name: o.name || (o.user ? o.user.name : ''),
            phone: o.phone || (o.user ? o.user.phone : ''),
            product: o.product,
            quantity: o.quantity,
            date: o.deliveryDate.toLocaleDateString(),
            status: o.status,
            source: o.source
        });
    });

    // 2. Subscriptions Sheet
    const subSheet = workbook.addWorksheet('Subscriptions');
    subSheet.columns = [
        { header: 'Sub ID', key: 'id', width: 40 },
        { header: 'Customer', key: 'name', width: 20 },
        { header: 'Product', key: 'product', width: 20 },
        { header: 'Frequency', key: 'freq', width: 15 },
        { header: 'Status', key: 'status', width: 15 }
    ];

    const subs = await prisma.subscription.findMany({ include: { user: true } });
    subs.forEach(s => {
        subSheet.addRow({
            id: s.id,
            name: s.user ? s.user.name : '',
            product: s.product,
            freq: s.frequency,
            status: s.status
        });
    });

    const filePath = path.join(EXPORT_DIR, `Goodmilk_Report_${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(filePath);
    return filePath;
}

module.exports = { generateAdminReport };
