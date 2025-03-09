import ExcelJS from 'exceljs';
import path from 'node:path';
import fs from 'node:fs';
import { app } from 'electron';

export const readExcelFile = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(1); 
  const jsonData = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      // Saltar la fila de encabezado
      return;
    }

    const rowData = {};
    row.eachCell((cell, colNumber) => {
      const header = worksheet.getRow(1).getCell(colNumber).value;
      rowData[header] = cell.value;
    });
    jsonData.push(rowData);
  });
  return jsonData;
};



export const convertJsonToExcel = async (jsonData, columnOrder, folderName, startDate, endDate) => {
  const excelName = Object.keys(jsonData)[0];
  const categories = Object.keys(jsonData[excelName]);
  const workbook = new ExcelJS.Workbook();

  categories.forEach((incName) => {
    const worksheet = workbook.addWorksheet(`${incName}`);
    const arrayInc = jsonData[excelName][incName];

    // Título en fila 1
    worksheet.mergeCells('C1', 'J1');
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(3).value = `${incName}`.toLocaleUpperCase(); 
    titleRow.font = { name: 'Arial', size: 12, bold: true };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    titleRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '49aff6' } };

    // Fecha en fila 2
    worksheet.mergeCells('C2', 'J2');
    const dateRow = worksheet.getRow(2);
    dateRow.getCell(3).value = `Fecha de inicio: ${startDate} - Fecha de fin: ${endDate}`;
    dateRow.font = { name: 'Arial', size: 11, bold: true };
    dateRow.alignment = { vertical: 'middle', horizontal: 'center' };
    dateRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '49aff6' } };


    if (arrayInc.length > 0) {
      worksheet.columns = columnOrder
        .filter(header => arrayInc[0].hasOwnProperty(header))
        .map(header => ({ key: header, width: 12  })); 

      const headerRow = worksheet.getRow(3);
      columnOrder.forEach((key, index) => {
        if (arrayInc[0].hasOwnProperty(key)) {
          headerRow.getCell(index + 1).value = key;
        }
      });
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: 'center' };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E6E6E6' } };

      arrayInc.forEach(data => {
        const orderedData = columnOrder.reduce((acc, key) => {
          acc[key] = data[key] || '';
          return acc;
        }, {});
        worksheet.addRow(orderedData);
      });

    }
  });

  const userDataPath = app.getPath('userData'); // Obtiene una ruta segura para guardar datos
  const dirPath = path.join(userDataPath, `${folderName}`);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const filePath = path.join(dirPath, `${excelName}.xlsx`);
  await workbook.xlsx.writeFile(filePath);
  console.log('Excel file created successfully at', filePath);
  return filePath;
};
