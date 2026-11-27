import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import api from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import {
  Loader2,
  Trash2,
  Shield,
  User as UserIcon,
  PlusCircle,
  Edit,
  Users,
} from 'lucide-react';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { EmptyState } from '../../components/ui/EmptyState';
import { ExportButton } from '../../components/ui/ExportButton';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api
      .get('/users')
      .then(({ data }) => {
        if (isMounted) setUsers(data.users);
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/users/${userToDelete._id}`);
      setUsers(users.filter((u) => u._id !== userToDelete._id));
      toast.success('Usuario eliminado');
    } catch {
      toast.error('Error al eliminar usuario');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-white">
            Usuarios Registrados
          </h1>
          <p className="text-text-muted mt-1">
            Gestión de cuentas de la plataforma.
          </p>
        </div>

        {/* AGRUPAMOS LOS BOTONES A LA DERECHA */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ExportButton
            data={users.map((u) => ({
              Nombre: u.nombre,
              Email: u.email,
              Rol: u.rol,
            }))}
            filename="usuarios-viajesar"
            sheetName="Usuarios"
          />

          <Link
            to="/admin/users/new"
            className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap flex-1 sm:flex-none"
          >
            <PlusCircle className="w-4 h-4" /> Nuevo Usuario
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 overflow-x-auto">
        {/* CONDICIÓN AGREGADA PARA LISTA VACÍA */}
        {users.length === 0 ? (
          <EmptyState
            titulo="No hay usuarios registrados"
            mensaje="Aún no hay cuentas creadas en la plataforma. Podés crear una nueva para empezar."
            icono={Users}
          />
        ) : (
          <table className="w-full text-left text-sm text-text-main dark:text-white">
            <thead className="text-xs text-text-muted uppercase bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700/50"
                >
                  <td className="px-6 py-4 font-medium">{u.nombre}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`flex items-center gap-1 w-max px-2 py-1 rounded-full text-xs font-bold ${u.rol === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}
                    >
                      {u.rol === 'admin' ? (
                        <Shield className="w-3 h-3" />
                      ) : (
                        <UserIcon className="w-3 h-3" />
                      )}
                      {u.rol.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-2">
                      <Link
                        to={`/admin/users/${u._id}/edit`}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setUserToDelete(u)}
                        className="p-2 text-danger hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmationModal
        abierto={!!userToDelete}
        onCerrar={() => setUserToDelete(null)}
        onConfirmar={handleDelete}
        titulo="¿Eliminar usuario?"
        mensaje={
          <>
            Estás a punto de eliminar a <strong>{userToDelete?.nombre}</strong>.
            Esta acción no se puede deshacer.
          </>
        }
      />
    </div>
  );
};
