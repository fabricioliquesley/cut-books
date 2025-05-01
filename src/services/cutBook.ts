import fs from "fs";
import { PDFDocument } from "pdf-lib";
import path from "path";

export async function cutBook(
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

    const outputPath = path.join(outputDir, `Chapter ${index + 1}.pdf`);
    fs.writeFileSync(outputPath, pdfBytes);
    console.log(`Generate: ${path.basename(outputPath)}`);
  }
}
