export function Cargando({ mensaje = 'Cargando...' }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-200 dark:border-surface-700 border-t-primary-500" />
      <p className="mt-4 text-text-muted font-medium">{mensaje}</p>
    </div>
  );
}
