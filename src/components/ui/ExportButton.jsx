import { Download } from 'lucide-react';
import { toast } from 'react-toastify';

export function ExportButton({ data, filename, label = 'Exportar CSV' }) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.warning('No hay datos para exportar');
      return;
    }

    // Obtenemos las llaves (columnas) del primer objeto
    const headers = Object.keys(data[0]);

    // Armamos el contenido del CSV
    const csvRows = [];

    // 1. Agregamos la fila de títulos (headers)
    csvRows.push(headers.join(','));

    // 2. Agregamos las filas de datos
    for (const row of data) {
      const values = headers.map((header) => {
        // Escapamos comillas dobles para que el CSV no se rompa
        const escaped = ('' + (row[header] ?? '')).replace(/"/g, '""');
        // Envolvemos el valor en comillas dobles (por si tiene comas)
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    // 3. Creamos el Blob y el link de descarga
    const csvString = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvString], {
      type: 'text/csv;charset=utf-8;',
    }); // uFEFF es para que Excel respete las tildes
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 border-2 border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400 font-medium rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
    >
      <Download className="w-4 h-4" /> {label}
    </button>
  );
}
