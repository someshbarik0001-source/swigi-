import React from 'react';
import { cn } from '../../utils/helpers';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No records found',
  isLoading = false,
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
          <tr>
            {columns.map((col, index) => (
              <th key={index} scope="col" className={cn('px-5 py-4', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-normal">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Loading records...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-5 py-12 text-center text-slate-400 dark:text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className={cn('px-5 py-4 align-middle', col.className)}>
                    {col.cell
                      ? col.cell(row)
                      : col.accessorKey
                      ? String(row[col.accessorKey] ?? '')
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

