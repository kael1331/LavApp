import React, { useState, useEffect, FormEvent } from 'react';
import { User, CreateUserDto, UpdateUserDto } from '../shared/user.types.js';
import { Plus, Trash, Edit2, RotateCw, UserX, UserPlus, Info, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

interface UserCrudPageProps {
  onBack: () => void;
}

export default function UserCrudPage({ onBack }: UserCrudPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [age, setAge] = useState<string>('');

  // Editing state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editAge, setEditAge] = useState<string>('');

  // Feedback notifications
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'danger' | 'info' } | null>(null);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users');
      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudieron cargar los usuarios`);
      }
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Error de conexión con la API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Show auto-dismissing feedback alert
  const showFeedback = (text: string, type: 'success' | 'danger' | 'info' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => {
      setFeedback(current => current?.text === text ? null : current);
    }, 6000);
  };

  // Create User Handler
  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !age.trim()) {
      showFeedback('Por favor complete todos los campos requeridos.', 'danger');
      return;
    }

    const payload: CreateUserDto = {
      name: name.trim(),
      email: email.trim(),
      age: Number(age)
    };

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.errors ? data.errors.join(' | ') : data.message;
        throw new Error(errorMsg || 'Falló la creación del usuario');
      }

      showFeedback(`¡Se ingresó el usuario "${data.name}" correctamente!`, 'success');
      
      // Reset form
      setName('');
      setEmail('');
      setAge('');
      
      fetchUsers();
    } catch (err: any) {
      showFeedback(err.message, 'danger');
    }
  };

  // Start Editing User
  const handleStartEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditAge(String(user.age));
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditName('');
    setEditEmail('');
    setEditAge('');
  };

  // Update User Handler
  const handleUpdateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;

    if (!editName.trim() || !editEmail.trim() || !editAge.trim()) {
      showFeedback('Por favor complete todos los campos de edición.', 'danger');
      return;
    }

    const payload: UpdateUserDto = {
      name: editName.trim(),
      email: editEmail.trim(),
      age: Number(editAge)
    };

    try {
      const res = await fetch(`/api/users/${editingUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.errors ? data.errors.join(' | ') : data.message;
        throw new Error(errorMsg || 'Falló la edición del usuario');
      }

      showFeedback(`Se actualizó el usuario "${data.name}" de forma exitosa.`, 'info');
      handleCancelEdit();
      fetchUsers();
    } catch (err: any) {
      showFeedback(err.message, 'danger');
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (id: string, userName: string) => {
    if (!confirm(`¿Está seguro de que desea eliminar al usuario "${userName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'No se pudo eliminar el usuario');
      }

      showFeedback(`Se eliminó el usuario "${userName}" exitosamente.`, 'info');
      
      if (editingUserId === id) {
        handleCancelEdit();
      }

      fetchUsers();
    } catch (err: any) {
      showFeedback(err.message, 'danger');
    }
  };

  return (
    <div className="space-y-6" id="crud-page-container">
      {/* Page Header with Back button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-4 gap-4" id="crud-header">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            id="btn-back-home"
            className="p-2 hover:bg-neutral-150 border border-neutral-200 rounded-lg hover:shadow-sm cursor-pointer transition-colors"
            title="Volver a la Página Principal"
          >
            <ArrowLeft className="h-4 w-4 text-neutral-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900" id="crud-title">
              Gestión de Usuarios
            </h1>
            <p className="text-xs text-neutral-500 font-mono" id="crud-subtitle">
              Sección aislada • Comunicación directa con la API modular
            </p>
          </div>
        </div>
        <button
          onClick={fetchUsers}
          id="crud-refresh"
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 rounded-md hover:shadow-sm transition-all cursor-pointer"
        >
          <RotateCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Sincronizar API
        </button>
      </div>

      {/* Action Feedback Alerts */}
      {feedback && (
        <div
          id="feedback-alert"
          className={`flex items-start gap-2.5 p-4 rounded-lg border text-sm transition-all duration-300 shadow-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : feedback.type === 'danger'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-indigo-50 border-indigo-200 text-indigo-800'
          }`}
        >
          {feedback.type === 'success' && <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />}
          {feedback.type === 'danger' && <AlertCircle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />}
          {feedback.type === 'info' && <Info className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />}
          <span className="font-medium" id="feedback-text">{feedback.text}</span>
        </div>
      )}

      {/* Connection Errors */}
      {error && (
        <div id="error-alert" className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold">Fallo en la llamada:</span>
            <p className="text-xs">{error}</p>
          </div>
        </div>
      )}

      {/* Content Columns: Form Workspace & Lists */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="crud-workspace-grid">
        
        {/* FORM PANEL (md:5) */}
        <section className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm md:col-span-5 space-y-4" id="crud-form-panel">
          <div className="border-b border-neutral-100 pb-2.5">
            <h2 className="text-sm font-semibold text-neutral-950 flex items-center gap-2" id="crud-form-title">
              {editingUserId ? (
                <>
                  <Edit2 className="h-4 w-4 text-indigo-500" />
                  Editar Usuario
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 text-emerald-500" />
                  Registrar Usuario
                </>
              )}
            </h2>
            <p className="text-[11px] text-neutral-400 font-mono">
              {editingUserId ? 'Actualizando datos del registro' : 'Ingresa datos que validará el backend en memoria'}
            </p>
          </div>

          {editingUserId ? (
            /* EDIT FORM */
            <form onSubmit={handleUpdateUser} id="frm-edit-user" className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="edit-name" className="text-xs font-medium text-neutral-600">Nombre Completo</label>
                <input
                  id="edit-name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Ej. Kael Dev"
                  className="w-full text-sm px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100/50 focus:bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="edit-email" className="text-xs font-medium text-neutral-600">Correo Electrónico</label>
                <input
                  id="edit-email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  className="w-full text-sm px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100/50 focus:bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="edit-age" className="text-xs font-medium text-neutral-600">Edad</label>
                <input
                  id="edit-age"
                  type="number"
                  min="0"
                  max="150"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                  placeholder="Ej. 28"
                  className="w-full text-sm px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100/50 focus:bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  id="edit-submit-btn"
                  className="flex-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-3 rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  id="edit-cancel-btn"
                  className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 py-2 px-3 rounded-md transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleCreateUser} id="frm-create-user" className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="create-name" className="text-xs font-medium text-neutral-600">Nombre Completo</label>
                <input
                  id="create-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Kael Dev"
                  className="w-full text-sm px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100/50 focus:bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="create-email" className="text-xs font-medium text-neutral-600">Correo Electrónico</label>
                <input
                  id="create-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  className="w-full text-sm px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100/50 focus:bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="create-age" className="text-xs font-medium text-neutral-600">Edad</label>
                <input
                  id="create-age"
                  type="number"
                  min="0"
                  max="150"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Ej. 28"
                  className="w-full text-sm px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100/50 focus:bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="create-submit-btn"
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 py-2 px-3 rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Registrar Usuario
                </button>
              </div>
            </form>
          )}
        </section>

        {/* LIST PANEL (md:7) */}
        <section className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm md:col-span-7 flex flex-col min-h-[320px]" id="crud-list-panel">
          <div className="border-b border-neutral-100 pb-2.5 mb-4">
            <h2 className="text-sm font-semibold text-neutral-950" id="crud-list-title">
              Usuarios en Servidor ({users.length})
            </h2>
            <p className="text-[11px] text-neutral-400 font-mono">
              Almacenamiento temporal en Express instanciado dinámicamente
            </p>
          </div>

          {loading && users.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-2 text-neutral-400" id="loading-spinner">
              <RotateCw className="h-6 w-6 animate-spin text-neutral-300" />
              <p className="text-xs">Sincronizando registros...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-2 border-2 border-dashed border-neutral-100 rounded-lg text-neutral-400" id="empty-state">
              <UserX className="h-8 w-8 text-neutral-300" />
              <div className="text-center">
                <p className="text-xs font-medium text-neutral-600">No hay usuarios registrados</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Usa el panel de la izquierda para registrar nuevos usuarios.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[350px] pr-1" id="users-items-list">
              {users.map((user) => (
                <div
                  key={user.id}
                  id={`user-card-${user.id}`}
                  className={`flex items-center justify-between p-3.5 border rounded-lg transition-all ${
                    editingUserId === user.id
                      ? 'border-indigo-400 bg-indigo-50/25 shadow-sm'
                      : 'border-neutral-100 bg-white hover:border-neutral-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-950" id={`uname-${user.id}`}>
                        {user.name}
                      </span>
                      <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded-full font-mono text-neutral-500">
                        {user.age} años
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-mono" id={`uemail-${user.id}`}>
                      {user.email}
                    </p>
                    <p className="text-[9px] text-neutral-405 text-neutral-400">
                      ID: <span className="font-mono">{user.id}</span> • Creado: {new Date(user.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5" id={`uactions-${user.id}`}>
                    <button
                      onClick={() => handleStartEdit(user)}
                      id={`btn-edit-${user.id}`}
                      title="Editar usuario"
                      className="p-1.5 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      id={`btn-delete-${user.id}`}
                      title="Eliminar usuario"
                      className="p-1.5 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
