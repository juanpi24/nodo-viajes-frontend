import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

/// Estilos de los botones
const baseClasses =
  'px-4 py-2 border-2 font-medium rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap';

const enabledClasses =
  'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer';

const disabledClasses =
  'border-surface-300 text-surface-400 dark:border-surface-600 dark:text-surface-500 bg-surface-100 dark:bg-surface-800 cursor-not-allowed';

export function ExportButton({
  data,
  onFetchData,
  filename,
  sheetName,
  label = 'Exportar Excel',
  disabled = false,
}) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    let dataToExport = data;

    try {
      // Si nos pasan una función, la ejecutamos para traer TODOS los datos
      if (onFetchData) {
        dataToExport = await onFetchData();
      }

      if (!dataToExport || dataToExport.length === 0) {
        toast.warning('No hay datos para exportar');
        return;
      }

      // Hoja a partir del array de objetos (las keys son los encabezados)
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);

      // Encabezados (columnas) tomados del primer objeto
      const headers = Object.keys(dataToExport[0]);

      // Ancho de columnas automático según el contenido
      worksheet['!cols'] = headers.map((h) => ({
        wch: Math.min(
          50,
          Math.max(
            h.length,
            ...dataToExport.map((row) => String(row[h] ?? '').length),
          ) + 2,
        ),
      }));

      // Formato de moneda para la columna "Precio" (si existe)
      const precioCol = headers.indexOf('Precio');
      if (precioCol !== -1) {
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let r = range.s.r + 1; r <= range.e.r; r++) {
          const cell = worksheet[XLSX.utils.encode_cell({ r, c: precioCol })];
          if (cell && typeof cell.v === 'number') cell.z = '"$"#,##0';
        }
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Genera y descarga el archivo
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } catch (error) {
      toast.error('Error al generar el archivo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const isDisabled = loading || disabled;
  return (
    <button
      onClick={handleExport}
      disabled={isDisabled}
      className={`${baseClasses} ${isDisabled ? disabledClasses : enabledClasses}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {loading ? 'Exportando...' : label}
    </button>
  );
}
