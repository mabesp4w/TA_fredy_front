/** @format */

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";
import { PaginationMeta } from "@/types";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  meta,
  onPageChange,
  loading = false,
}) => {
  const { current_page, last_page, from, to, total } = meta;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, current_page - Math.floor(maxVisible / 2));
    const end = Math.min(last_page, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (last_page <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      {/* Info text */}
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Menampilkan {from} sampai {to} dari {total} hasil
      </div>

      {/* Pagination controls */}
      <div className="join">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          disabled={current_page <= 1 || loading}
          onClick={() => onPageChange(current_page - 1)}
          className="join-item"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* First page */}
        {pageNumbers[0] > 1 && (
          <>
            <Button
              variant={1 === current_page ? "primary" : "outline"}
              size="sm"
              disabled={loading}
              onClick={() => onPageChange(1)}
              className="join-item"
            >
              1
            </Button>
            {pageNumbers[0] > 2 && (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="join-item"
              >
                ...
              </Button>
            )}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map((page) => (
          <Button
            key={page}
            variant={page === current_page ? "primary" : "outline"}
            size="sm"
            disabled={loading}
            onClick={() => onPageChange(page)}
            className="join-item"
          >
            {page}
          </Button>
        ))}

        {/* Last page */}
        {pageNumbers[pageNumbers.length - 1] < last_page && (
          <>
            {pageNumbers[pageNumbers.length - 1] < last_page - 1 && (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="join-item"
              >
                ...
              </Button>
            )}
            <Button
              variant={last_page === current_page ? "primary" : "outline"}
              size="sm"
              disabled={loading}
              onClick={() => onPageChange(last_page)}
              className="join-item"
            >
              {last_page}
            </Button>
          </>
        )}

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          disabled={current_page >= last_page || loading}
          onClick={() => onPageChange(current_page + 1)}
          className="join-item"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
