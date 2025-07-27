// excelGenerator.js
import ExcelJS from 'exceljs';

export const generateExcel = (attendances) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Attendances');

  worksheet.columns = [
    { header: 'Nama', key: 'name', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Departemen', key: 'department', width: 20 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Waktu Absen', key: 'createdAt', width: 20 },
    { header: 'Validasi Oleh', key: 'validator', width: 25 }
  ];

  attendances.forEach(att => {
    worksheet.addRow({
      name: att.user.name,
      email: att.user.email,
      department: att.user.department?.name || '-',
      status: translateStatus(att.status),
      createdAt: att.createdAt.toLocaleString(),
      validator: att.validatedBy?.name || '-'
    });
  });

  worksheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
  });

  return workbook;
};

const translateStatus = (status) => {
  const translations = {
    present: 'Hadir',
    absent: 'Alpha',
    excused: 'Izin',
    pending: 'Menunggu',
    rejected: 'Ditolak'
  };
  return translations[status] || status;
};