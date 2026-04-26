import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export const generateInvoicePDF = async (invoice, client, project) => {
  const doc = new jsPDF();
  
  // Determine if this is a receipt based on status
  const isReceipt = invoice.status === 'Paid';
  const documentTitle = isReceipt ? 'RECEIPT' : 'INVOICE';
  const documentPrefix = isReceipt ? 'Receipt' : 'Invoice';
  
  // Custom Colors
  const primaryColor = [33, 37, 41]; // Dark Slate
  const secondaryColor = isReceipt ? [34, 197, 94] : [99, 102, 241]; // Green for Receipt, Indigo for Invoice
  const lightGray = [248, 250, 252];
  
  // --- Header Section ---
  // Background rectangle for header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 45, 'F');
  
  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont(undefined, 'bold');
  doc.text('INDIECODE STUDIO', 15, 22);
  
  // Tagline / Service
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Premium Software Development & Design', 15, 30);
  
  // Document Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text(documentTitle, 195, 22, { align: 'right' });
  
  // Document Meta in Header
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text(`${documentPrefix} No: ${invoice.invoice_number || 'INV-' + Date.now().toString().slice(-6)}`, 195, 30, { align: 'right' });
  doc.text(`Date: ${invoice.issue_date || new Date().toLocaleDateString()}`, 195, 35, { align: 'right' });
  
  // --- Client & Project Section ---
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  
  // Bill To
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text(isReceipt ? 'PAID BY:' : 'BILLED TO:', 15, 60);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(client.name || 'Client Name', 15, 67);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(80, 80, 80);
  if (client.company) doc.text(client.company, 15, 73);
  if (client.email) doc.text(client.email, 15, 79);
  
  // Project Details
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('PROJECT DETAILS:', 120, 60);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(project.name || 'Project Name', 120, 67);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Status: ${invoice.status || 'Pending'}`, 120, 73);
  if (isReceipt) {
    doc.text(`Paid Date: ${new Date().toLocaleDateString()}`, 120, 79);
  } else {
    doc.text(`Due Date: ${invoice.due_date || 'Due on receipt'}`, 120, 79);
  }
  
  // --- Line Items Table ---
  // Format currency with INR to avoid font rendering issues with ₹ symbol
  const formatCurrency = (amount) => `INR ${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  
  const tableData = invoice.items.map(item => [
    item.description || 'Service rendered',
    formatCurrency(item.amount),
    item.quantity || 1,
    formatCurrency((parseFloat(item.amount) || 0) * (item.quantity || 1))
  ]);
  
  autoTable(doc, {
    startY: 95,
    head: [['Description', 'Unit Price', 'Qty', 'Total']],
    body: tableData,
    theme: 'plain',
    headStyles: { 
      fillColor: lightGray, 
      textColor: primaryColor,
      fontStyle: 'bold',
      lineWidth: 0.1,
      lineColor: [220, 220, 220]
    },
    bodyStyles: {
      textColor: [60, 60, 60],
      borderBottomWidth: 0.1,
      borderBottomColor: [240, 240, 240]
    },
    styles: { fontSize: 10, cellPadding: 6 },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { halign: 'right' },
      2: { halign: 'center' },
      3: { halign: 'right' }
    }
  });
  
  const finalY = (doc).lastAutoTable.finalY + 15;
  
  // --- Totals Section ---
  const totalAmount = invoice.total_amount || 0;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Subtotal:', 130, finalY);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(formatCurrency(totalAmount), 195, finalY, { align: 'right' });
  
  // Divider before grand total
  doc.setDrawColor(220, 220, 220);
  doc.line(130, finalY + 5, 195, finalY + 5);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(isReceipt ? 'Amount Paid:' : 'Total Due:', 130, finalY + 13);
  doc.setTextColor(...secondaryColor);
  doc.text(formatCurrency(totalAmount), 195, finalY + 13, { align: 'right' });
  
  // --- Footer Section ---
  const pageHeight = doc.internal.pageSize.height;
  
  doc.setDrawColor(230, 230, 230);
  doc.line(15, pageHeight - 35, 195, pageHeight - 35);
  
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text(isReceipt ? 'Payment Status' : 'Payment Terms', 15, pageHeight - 25);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  
  if (isReceipt) {
    doc.text('This invoice has been paid in full. No further action is required.', 15, pageHeight - 20);
  } else {
    doc.text('Please process the payment within 15 days of receiving this invoice.', 15, pageHeight - 20);
    doc.text('For wire transfers, please contact us for bank details.', 15, pageHeight - 16);
  }
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'italic');
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for your business!', 105, pageHeight - 10, { align: 'center' });
  
  // --- Output ---
  const fileName = `${project.name.replace(/\s+/g, '_')}_${documentPrefix}_${invoice.invoice_number || Date.now()}.pdf`;

  if (Capacitor.isNativePlatform()) {
    try {
      // For native platforms, save to filesystem and share
      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: pdfBase64,
        directory: Directory.Cache,
      });

      await Share.share({
        title: fileName,
        text: `Invoice from IndieCode Studio: ${project.name}`,
        url: savedFile.uri,
        dialogTitle: 'Save or Share Invoice',
      });
    } catch (error) {
      alert(`PDF Error: ${error.message}\nStack: ${error.stack}`);
      console.error('Error generating or sharing native PDF:', error);
    }
  } else {
    // For web browsers, use standard save
    doc.save(fileName);
  }
};
