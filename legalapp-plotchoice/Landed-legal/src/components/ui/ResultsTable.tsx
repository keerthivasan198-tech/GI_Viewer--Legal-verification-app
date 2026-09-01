import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
}

interface ResultsTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  onSort?: () => void;
  sortLabel?: string;
}

export function ResultsTable<T extends { id: string | number }>({
  columns,
  data,
  emptyMessage = 'No records found matching your search criteria.',
  onSort,
  sortLabel
}: ResultsTableProps<T>) {
  return (
    <div className="w-full space-y-3">
      {onSort && (
        <div className="flex justify-between items-center text-xs text-slate-500 pb-1">
          <span className="font-semibold text-slate-600">Showing {data.length} entries</span>
          <button
            type="button"
            onClick={onSort}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors shadow-subtle"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-600" />
            <span>Sort: {sortLabel || 'Value (High To Low)'}</span>
          </button>
        </div>
      )}

      <div className="w-full overflow-x-auto border border-slate-200/90 rounded-xl custom-scrollbar bg-white shadow-subtle">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider sticky top-0 z-10">
              {columns.map((col, idx) => (
                <th key={idx} className="py-3.5 px-4 whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="py-3.5 px-4 text-slate-800 text-xs sm:text-sm">
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-10 text-center text-slate-400 text-sm italic bg-slate-50/30"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
