import { Link } from 'react-router-dom';

export function NoEncontrado({
  titulo,
  mensaje,
  onVolver,
  textoBoton = 'Volver al catálogo',
}) {
  return (
    <section className="flex flex-col items-center justify-center border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-2xl p-10 bg-surface-50 dark:bg-surface-800/50 text-center my-6">
      <div className="text-5xl mb-4" aria-hidden="true">
        🧭
      </div>
      <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">
        {titulo}
      </h1>
      <p className="text-text-muted max-w-sm mb-6">{mensaje}</p>

      {/* Si hay onVolver, mostramos un botón. Si no, el Link por defecto */}
      {onVolver ? (
        <button
          onClick={onVolver}
          className="px-6 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors cursor-pointer"
        >
          {textoBoton}
        </button>
      ) : (
        <Link
          to="/"
          className="px-6 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors cursor-pointer"
        >
          {textoBoton}
        </Link>
      )}
    </section>
  );
}
