"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  rowAction?: (row: T) => React.ReactNode;
}

export function DataTable<T extends { id?: string }>({
  columns,
  data,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onRowClick,
  emptyState,
  rowAction,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
              {rowAction && (
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + (rowAction ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (rowAction ? 1 : 0)}
                  className="px-4 py-12 text-center text-gray-600 dark:text-gray-400"
                >
                  {emptyState || <p>No data available</p>}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-300 ${column.className || ""}`}
                      style={{ width: column.width }}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key] ?? "-")}
                    </td>
                  ))}
                  {rowAction && (
                    <td
                      className="px-4 py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {rowAction(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
