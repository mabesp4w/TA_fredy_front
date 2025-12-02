/** @format */

import { url_api } from "./baseURL";

/**
 * Helper function untuk download file dari URL
 */
async function downloadFile(
  url: string,
  filename: string,
  contentType: string
): Promise<void> {
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include", // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
}

/**
 * Service untuk export data ke PDF dan Excel
 */
export class ExportService {
  /**
   * Export birds data ke PDF
   * @param params Query parameters untuk filter (family, search, ordering)
   */
  static async exportBirdsToPDF(params?: {
    family?: string;
    search?: string;
    ordering?: string;
  }): Promise<void> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.family) queryParams.append("family", params.family);
      if (params?.search) queryParams.append("search", params.search);
      if (params?.ordering) queryParams.append("ordering", params.ordering);

      const url = `${url_api}/birds/export-pdf/${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const filename = `birds_export_${new Date().toISOString().split("T")[0]}.pdf`;
      await downloadFile(url, filename, "application/pdf");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      throw error;
    }
  }

  /**
   * Export birds data ke Excel
   * @param params Query parameters untuk filter (family, search, ordering)
   */
  static async exportBirdsToExcel(params?: {
    family?: string;
    search?: string;
    ordering?: string;
  }): Promise<void> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.family) queryParams.append("family", params.family);
      if (params?.search) queryParams.append("search", params.search);
      if (params?.ordering) queryParams.append("ordering", params.ordering);

      const url = `${url_api}/birds/export-excel/${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const filename = `birds_export_${new Date().toISOString().split("T")[0]}.xlsx`;
      await downloadFile(
        url,
        filename,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      throw error;
    }
  }

  /**
   * Export dashboard statistics ke PDF
   */
  static async exportDashboardToPDF(): Promise<void> {
    try {
      const url = `${url_api}/dashboard/export-pdf/`;
      const filename = `dashboard_report_${new Date().toISOString().split("T")[0]}.pdf`;
      await downloadFile(url, filename, "application/pdf");
    } catch (error) {
      console.error("Error exporting dashboard to PDF:", error);
      throw error;
    }
  }

  /**
   * Export dashboard statistics ke Excel
   */
  static async exportDashboardToExcel(): Promise<void> {
    try {
      const url = `${url_api}/dashboard/export-excel/`;
      const filename = `dashboard_report_${new Date().toISOString().split("T")[0]}.xlsx`;
      await downloadFile(
        url,
        filename,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (error) {
      console.error("Error exporting dashboard to Excel:", error);
      throw error;
    }
  }
}

