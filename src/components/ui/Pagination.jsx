export const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // Si solo hay 1 página, no mostramos nada

  return (
    <div className="flex justify-center items-center gap-4 mt-8 pb-8">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg disabled:opacity-50 text-text-main dark:text-white hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors cursor-pointer"
      >
        Anterior
      </button>
      <span className="text-text-muted font-medium">
        Página {page} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg disabled:opacity-50 text-text-main dark:text-white hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors cursor-pointer"
      >
        Siguiente
      </button>
    </div>
  );
};
