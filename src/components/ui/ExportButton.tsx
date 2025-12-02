/** @format */

import React, { useState } from "react";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "./Button";

interface ExportButtonProps {
  onExportPDF: () => Promise<void>;
  onExportExcel: () => Promise<void>;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExportPDF,
  onExportExcel,
  variant = "outline",
  size = "md",
  className = "",
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "excel" | null>(null);

  const handleExport = async (type: "pdf" | "excel") => {
    setIsExporting(true);
    setExportType(type);
    try {
      if (type === "pdf") {
        await onExportPDF();
      } else {
        await onExportExcel();
      }
    } catch (error) {
      console.error(`Error exporting to ${type}:`, error);
      // You can add toast notification here if needed
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant={variant}
        size={size}
        onClick={() => handleExport("pdf")}
        disabled={isExporting}
        className="flex items-center gap-2"
      >
        {isExporting && exportType === "pdf" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        {isExporting && exportType === "pdf" ? "Exporting..." : "Export PDF"}
      </Button>
      <Button
        variant={variant}
        size={size}
        onClick={() => handleExport("excel")}
        disabled={isExporting}
        className="flex items-center gap-2"
      >
        {isExporting && exportType === "excel" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="w-4 h-4" />
        )}
        {isExporting && exportType === "excel" ? "Exporting..." : "Export Excel"}
      </Button>
    </div>
  );
};

