import { Link } from 'react-router';
import { Inbox } from 'lucide-react';

export function EmptyState({
  titulo,
  mensaje,
  icono: Icono = Inbox,
  textoBoton,
  linkBoton,
  onBotonClick,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-4">
        <Icono className="w-10 h-10 text-text-muted opacity-60" />
      </div>

      <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">
        {titulo}
      </h3>
      <p className="text-text-muted max-w-sm mb-6">{mensaje}</p>

      {textoBoton && linkBoton && (
        <Link
          to={linkBoton}
          className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
        >
          {textoBoton}
        </Link>
      )}

      {textoBoton && onBotonClick && (
        <button
          onClick={onBotonClick}
          className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
        >
          {textoBoton}
        </button>
      )}
    </div>
  );
}
