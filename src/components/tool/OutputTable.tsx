import { type ColumnDef, tableFeatures, useTable } from "@tanstack/react-table";
import { useMemo } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 表格型输出（对象数组）的 Data Table；只在有表格输出的 Tool 页按需加载
type Row = Record<string, unknown>;

const features = tableFeatures({});

interface Props {
  rows: Row[];
  columns: string[];
  labels: Record<string, string>;
}

export default function OutputTable({ rows, columns, labels }: Props) {
  const columnDefs = useMemo<ColumnDef<typeof features, Row>[]>(
    () =>
      columns.map((column) => ({
        id: column,
        accessorFn: (row) => String(row[column] ?? ""),
        header: labels[column] ?? column,
      })),
    [columns, labels],
  );
  const table = useTable({ features, columns: columnDefs, data: rows });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : <table.FlexRender header={header} />}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id} variant="wrap">
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} variant="muted">
              —
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
