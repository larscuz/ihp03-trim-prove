import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportNodeToPdf(opts: { node: HTMLElement; filename: string; scale?: number }) {
  const { node, filename, scale = 2 } = opts;

  await new Promise((r) => requestAnimationFrame(() => r(null)));

  const canvas = await html2canvas(node, { scale, backgroundColor: "#ffffff", useCORS: true });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let y = 0;
  let remaining = imgHeight;

  pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
  remaining -= pageHeight;

  while (remaining > 0) {
    pdf.addPage();
    y -= pageHeight;
    pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
    remaining -= pageHeight;
  }

  pdf.save(filename);
}
