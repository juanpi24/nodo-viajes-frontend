import { Modal } from './Modal.jsx';
import { AlertTriangle } from 'lucide-react';

export function ConfirmationModal({
  abierto,
  onCerrar,
  onConfirmar,
  titulo,
  mensaje,
  textoConfirmar = "Sí, eliminar", 
}) {
  return (
    <Modal abierto={abierto} onCerrar={onCerrar}>
      <div className="max-w-sm w-full text-center">
        <div className="mx-auto w-16 h-16 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-danger" />
        </div>

        <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">
          {titulo}
        </h3>
        <p className="text-sm text-text-muted mb-6">{mensaje}</p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onCerrar}
            className="px-4 py-2 text-sm font-medium text-text-main dark:text-white bg-surface-100 dark:bg-surface-700 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirmar();
              onCerrar();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </Modal>
  );
}
