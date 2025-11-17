import React from 'react';

interface DataTableProps {
  columns: { key: string, header: string }[];
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
  return (
    <table className="table-auto w-full border-collapse">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key} className="border-b p-2 text-left">{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map(col => (
              <td key={col.key} className="border-b p-2">{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
