import "./print.css";

export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <div className="print-document-shell min-h-screen px-4 py-6 md:px-8 md:py-8">{children}</div>;
}
