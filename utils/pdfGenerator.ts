
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice } from '../types';
import { COMPANY_DETAILS } from '../constants';
import { numberToWords } from './numberUtils';

export const generateInvoicePDF = (invoice: Invoice) => {
  const doc = new jsPDF();
  
  // Page Settings
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 10; // 10mm margin
  const contentWidth = pageWidth - (margin * 2);
  const rightEdge = pageWidth - margin;
  const bottomEdge = pageHeight - margin;

  // Colors
  const black = "#000000";
  const darkGray = "#333333";

  // Helper: Draw Page Border
  const drawPageBorder = (doc: jsPDF) => {
    doc.setDrawColor(black);
    doc.setLineWidth(0.4);
    doc.rect(margin, margin, contentWidth, pageHeight - (margin * 2));
  };

  // --- 1. HEADER SECTION ---
  const drawHeader = (yObj: { y: number }) => {
    const startY = yObj.y;
    const headerHeight = 42;
    
    // Vertical Divider for Header (Middle)
    doc.setDrawColor(black);
    doc.setLineWidth(0.2);
    doc.line(pageWidth / 2 + 10, startY, pageWidth / 2 + 10, startY + headerHeight);

    // LEFT SIDE: Company Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16); // Slightly reduced for better fit
    doc.setTextColor(black);
    doc.text(COMPANY_DETAILS.name, margin + 4, startY + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(darkGray);
    
    const addressLines = doc.splitTextToSize(COMPANY_DETAILS.address, (contentWidth / 2) - 5);
    doc.text(addressLines, margin + 4, startY + 18);
    
    // Calculate Y after address to place GSTIN/Email
    // const addrHeight = addressLines.length * 4;
    // Fixed positions for cleaner look given the fixed header height
    doc.text(`GSTIN: ${COMPANY_DETAILS.gstin}`, margin + 4, startY + 32);
    doc.text(`Email: ${COMPANY_DETAILS.email}`, margin + 4, startY + 38);

    // RIGHT SIDE: Invoice Details
    const rightColX = pageWidth / 2 + 15;
    doc.setTextColor(black);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("TAX INVOICE", rightEdge - 5, startY + 10, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    // Invoice Data Grid
    const labelX = rightColX;
    const valX = rightEdge - 6; // Pulled in from right edge
    let currentY = startY + 20;
    const inc = 5;

    doc.text("Invoice No:", labelX, currentY);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.invoiceNo, valX, currentY, { align: 'right' });
    
    currentY += inc;
    doc.setFont('helvetica', 'normal');
    doc.text("Date:", labelX, currentY);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.date, valX, currentY, { align: 'right' });

    currentY += inc;
    doc.setFont('helvetica', 'normal');
    doc.text("Payment Mode:", labelX, currentY);
    doc.text(invoice.paymentMode, valX, currentY, { align: 'right' });

    // Staff tracking (small text)
    currentY += inc + 2;
    doc.setFontSize(8);
    doc.setTextColor("#555555");
    doc.text(`Billed By: ${invoice.billedBy}`, labelX, currentY);
    doc.text(`Picker: ${invoice.pickedBy}`, valX, currentY, { align: 'right' });
    doc.setTextColor(black);

    // Bottom Line of Header
    doc.setDrawColor(black);
    doc.setLineWidth(0.2);
    doc.line(margin, startY + headerHeight, rightEdge, startY + headerHeight);

    return startY + headerHeight;
  };

  // --- 2. BUYER SECTION ---
  const drawBuyer = (startY: number) => {
    const pad = 4;
    let currentY = startY + pad + 4;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text("Bill To (Buyer):", margin + pad, currentY);

    currentY += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(invoice.customer.name, margin + pad, currentY);

    currentY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const fullAddr = `${invoice.customer.address}, ${invoice.customer.city}, ${invoice.customer.state} - ${invoice.customer.pincode}`;
    const custAddrLines = doc.splitTextToSize(fullAddr, contentWidth - 10);
    doc.text(custAddrLines, margin + pad, currentY);

    currentY += (custAddrLines.length * 4) + 2;
    
    // Customer Meta Row
    doc.text(`Mobile: ${invoice.customer.mobile}`, margin + pad, currentY);
    doc.text(`GSTIN: ${invoice.customer.gstin || 'N/A'}`, margin + 60, currentY);
    doc.text(`State Code: ${invoice.customer.stateCode}`, margin + 120, currentY);

    return currentY + 6; // Return Y where table should start
  };


  // Draw Header & Buyer on Page 1
  let finalHeaderY = drawHeader({ y: margin });
  let tableStartY = drawBuyer(finalHeaderY);

  // --- 3. ITEM TABLE ---
  const tableHead = [['SI', 'Description of Goods', 'Size', 'HSN/SAC', 'Qty', 'Rate', 'Disc %', 'Amount']];
  const tableBody = invoice.items.map((item, index) => [
    index + 1,
    item.name,
    item.size || '-',
    item.hsn,
    `${item.quantity} PCS`,
    item.rate.toFixed(2),
    item.discountPercent > 0 ? `${item.discountPercent}%` : '-',
    item.amount.toFixed(2)
  ]);

  // @ts-ignore
  autoTable(doc, {
    startY: tableStartY,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      textColor: [0, 0, 0],
      valign: 'middle'
    },
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
      lineWidth: 0.1,
      lineColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, // SI
      1: { cellWidth: 'auto' }, // Description
      2: { cellWidth: 20, halign: 'center' }, // Size
      3: { cellWidth: 20, halign: 'center' }, // HSN
      4: { cellWidth: 20, halign: 'right' }, // Qty
      5: { cellWidth: 25, halign: 'right' }, // Rate
      6: { cellWidth: 15, halign: 'right' }, // Disc
      7: { cellWidth: 30, halign: 'right' }  // Amount (Wider)
    },
    margin: { left: margin, right: margin, bottom: margin },
    tableWidth: contentWidth,
    didDrawPage: function (data) {
      // Draw border on every page
      drawPageBorder(doc);
    }
  });

  // --- 4. FOOTER / TOTALS ---
  // @ts-ignore
  let finalY = doc.lastAutoTable.finalY;

  // Calc Footer Height needed
  const footerHeight = 65; 
  
  // Check if footer fits on page, else add page
  if (finalY + footerHeight > bottomEdge) {
    doc.addPage();
    finalY = margin;
    drawPageBorder(doc);
  }

  // Footer Layout Constants
  const rightSectionWidth = contentWidth * 0.40;
  const leftSectionWidth = contentWidth * 0.60;
  const rightSectionX = margin + leftSectionWidth;

  // Draw Vertical Divider
  doc.setDrawColor(black);
  doc.setLineWidth(0.2);
  doc.line(rightSectionX, finalY, rightSectionX, finalY + footerHeight);

  // --- LEFT FOOTER (Words & Terms) ---
  const leftPad = margin + 3;
  let leftY = finalY + 6;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text("Total Amount in Words:", leftPad, leftY);
  
  leftY += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  const amountWords = `${numberToWords(invoice.grandTotal)} Only`;
  const splitWords = doc.splitTextToSize(amountWords, leftSectionWidth - 10);
  doc.text(splitWords, leftPad, leftY);
  
  leftY += (splitWords.length * 5) + 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text("Terms & Conditions:", leftPad, leftY);
  leftY += 4;
  doc.text("1. Goods once sold will not be taken back.", leftPad, leftY);
  leftY += 4;
  doc.text("2. Interest @ 18% p.a. charged on overdue payments.", leftPad, leftY);
  leftY += 4;
  doc.text("3. All disputes subject to Ranchi Jurisdiction.", leftPad, leftY);

  // Signatures
  const sigY = finalY + footerHeight - 15;
  doc.setFont('helvetica', 'bold');
  doc.text("For ANAND DISTRIBUTION", leftPad, sigY);
  doc.setFont('helvetica', 'normal');
  doc.text("Authorised Signatory", leftPad, sigY + 12);


  // --- RIGHT FOOTER (Calculations) ---
  const labelX = rightSectionX + 4;
  // CRITICAL FIX: Move valueX inwards (rightEdge - 6) to ensure it doesn't cross border
  const valueX = rightEdge - 6; 
  
  let rightY = finalY + 6;
  const lineSpacing = 6;

  const addRow = (label: string, value: string, isBold: boolean = false) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(isBold ? 11 : 9); // Bigger font for Grand Total
    doc.text(label, labelX, rightY);
    doc.text(value, valueX, rightY, { align: 'right' });
    rightY += lineSpacing;
  };

  addRow("Taxable Amount:", invoice.subTotal.toFixed(2));

  if (invoice.taxType === 'INTRA_STATE') {
    addRow("CGST (2.5%):", (invoice.taxAmount / 2).toFixed(2));
    addRow("SGST (2.5%):", (invoice.taxAmount / 2).toFixed(2));
  } else {
    addRow("IGST (5.0%):", invoice.taxAmount.toFixed(2));
  }

  addRow("Round Off:", (invoice.roundOff > 0 ? '+' : '') + invoice.roundOff.toFixed(2));

  // Grand Total Separator
  doc.line(rightSectionX, rightY - 2, rightEdge, rightY - 2);
  rightY += 2;

  // Grand Total
  // Using INR instead of ₹ to avoid font garbage characters
  addRow("Grand Total:", `INR ${invoice.grandTotal.toFixed(2)}`, true);

  // Bottom line closing the invoice content
  doc.setLineWidth(0.4);
  doc.line(margin, finalY + footerHeight, rightEdge, finalY + footerHeight);

  doc.save(`Invoice_${invoice.invoiceNo}.pdf`);
};
