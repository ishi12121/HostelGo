// components/ReusableTable.js
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Checkbox, Button, TablePagination 
} from '@mui/material';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';

const ReusableTable = ({ columns, data, title }) => {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(title, 20, 10);
    doc.autoTable({
      head: [columns.map(column => column.label)],
      body: data.filter(row => selected.includes(row.id)).map(row => 
        columns.map(column => row[column.id])
      ),
    });
    doc.save(`${title}.pdf`);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.filter(row => selected.includes(row.id))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${title}.xlsx`);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < data.length}
                  checked={data.length > 0 && selected.length === data.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              const isItemSelected = isSelected(row.id);
              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, row.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isItemSelected} />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{row[column.id]}</TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Button onClick={exportToPDF} disabled={selected.length === 0}>Export to PDF</Button>
      <Button onClick={exportToExcel} disabled={selected.length === 0}>Export to Excel</Button>
    </Paper>
  );
};

export default ReusableTable;