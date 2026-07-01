/** Preload fonts and images when the print page mounts (not on button click). */
export async function waitForPrintAssets(): Promise<void> {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const images = Array.from(document.images);
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }),
    ),
  );
}

/**
 * Must stay synchronous — browsers drop the user-gesture token after `await`,
 * which causes silent print failures on Windows/Edge.
 */
export function triggerPrintSync(): void {
  window.print();
}

function collectDocumentStyles(): string {
  const chunks: string[] = [];

  for (const link of document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')) {
    if (link.href) chunks.push(`<link rel="stylesheet" href="${link.href}" />`);
  }

  for (const style of document.querySelectorAll("style")) {
    chunks.push(`<style>${style.textContent ?? ""}</style>`);
  }

  chunks.push(`
    <style>
      @page { size: A4 portrait; margin: 12mm; }
      html, body {
        margin: 0;
        padding: 0;
        background: #fff !important;
        color: #1d2651;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print { display: none !important; }
      #package-offer-document, #receipt-document {
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
      img { max-height: 3.5rem; }
    </style>
  `);

  return chunks.join("\n");
}

/** Isolated iframe print — avoids CRM layout and gesture issues on the parent page. */
export function printDocumentInIframe(documentId: string): boolean {
  const element = document.getElementById(documentId);
  if (!element) return false;

  const iframe = document.createElement("iframe");
  iframe.setAttribute(
    "style",
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden",
  );
  iframe.setAttribute("title", "Print document");
  document.body.appendChild(iframe);

  const win = iframe.contentWindow;
  const doc = win?.document;
  if (!win || !doc) {
    iframe.remove();
    return false;
  }

  const clone = element.cloneNode(true) as HTMLElement;
  for (const img of clone.querySelectorAll("img")) {
    const src = img.getAttribute("src");
    if (src) {
      img.setAttribute("src", new URL(src, window.location.href).href);
    }
  }

  const styles = collectDocumentStyles();
  doc.open();
  doc.write(
    `<!DOCTYPE html><html lang="en-ZA"><head><meta charset="utf-8" /><title>Print</title>${styles}</head><body>${clone.outerHTML}</body></html>`,
  );
  doc.close();

  try {
    win.focus();
    win.print();
  } finally {
    window.setTimeout(() => iframe.remove(), 2000);
  }

  return true;
}

/** Rasterize the document and download a PDF file (no printer required). */
export async function downloadDocumentAsPdf(documentId: string, fileName: string): Promise<void> {
  const element = document.getElementById(documentId);
  if (!element) throw new Error("Document not found");

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: element.scrollWidth,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  let offset = 0;
  let remaining = imgHeight;

  pdf.addImage(imgData, "JPEG", 0, offset, pageWidth, imgHeight);
  remaining -= pageHeight;

  while (remaining > 0) {
    offset = remaining - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, offset, pageWidth, imgHeight);
    remaining -= pageHeight;
  }

  const safeName = fileName.replace(/[^\w.-]+/g, "_");
  pdf.save(safeName.endsWith(".pdf") ? safeName : `${safeName}.pdf`);
}
