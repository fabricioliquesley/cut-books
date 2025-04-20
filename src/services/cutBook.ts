import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import path from 'path';

async function cutBook(
  inputPath: string, 
  outputDir: string, 
  ranges: number[][]
) {
  const existingPdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  for (const [index, [start, end]] of ranges.entries()) {
    const newPdf = await PDFDocument.create();

    for (let i = start - 1; i < end; i++) {
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
    }

    const pdfBytes = await newPdf.save();

    const outputPath = path.join(outputDir, `intervalo_${start}-${end}.pdf`);
    fs.writeFileSync(outputPath, pdfBytes);
    console.log(`Gerado: ${outputPath}`);
  }
}

const ranges = [
  [1, 3],
  [7, 10],
  [15, 15],
];

const outputDir = './pdfs_gerados';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

cutBook('entrada.pdf', outputDir, ranges);
