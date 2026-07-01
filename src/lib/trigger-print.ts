/** Wait for fonts and images so the print preview is never blank. */
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

  // Allow layout/paint to settle before opening the system print dialog.
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

/** Call only from a click handler — browsers block print() without user gesture. */
export async function triggerPrint(): Promise<void> {
  await waitForPrintAssets();
  window.print();
}
