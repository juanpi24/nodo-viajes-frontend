import { Link } from 'react-router-dom';
import { MapPinOff, ArrowLeft } from 'lucide-react';

export function NoEncontrado({
  titulo,
  mensaje,
  onVolver,
  textoBoton = 'Volver al catálogo',
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Ícono en un círculo suave */}
      <div className="w-24 h-24 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-6">
        <MapPinOff className="w-12 h-12 text-text-muted" />
      </div>

      <h1 className="text-3xl font-bold text-text-main dark:text-white mb-3">
        {titulo}
      </h1>

      <p className="text-text-muted max-w-md mb-8 text-lg">{mensaje}</p>

      {/* Si hay onVolver, mostramos un botón. Si no, el Link por defecto */}
      {onVolver ? (
        <button
          onClick={onVolver}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors cursor-pointer shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5" /> {textoBoton}
        </button>
      ) : (
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors cursor-pointer shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5" /> {textoBoton}
        </Link>
      )}
    </div>
  );
}
