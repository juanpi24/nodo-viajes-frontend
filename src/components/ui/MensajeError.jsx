import { AlertCircle } from 'lucide-react';

export function MensajeError({ mensaje, onReintentar }) {
  return (
    <div
      role="alert"
      className="flex flex-col sm:flex-row items-center justify-center gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-center sm:text-left border border-red-200 dark:border-red-900/50 text-danger"
    >
      <AlertCircle className="w-5 h-5 shrink-0" />
      <p className="font-medium">{mensaje}</p>
      {onReintentar && (
        <button
          type="button"
          onClick={onReintentar}
          className="sm:ml-auto bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 px-4 py-1.5 rounded-md text-sm font-bold transition-colors cursor-pointer"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
