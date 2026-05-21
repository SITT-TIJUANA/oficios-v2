'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { UserPlus, Loader2, Check, X, Users } from 'lucide-react'
import { getInitials, formatDate } from '@/lib/utils'
import type { Perfil, Departamento } from '@/types'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Perfil[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [loading, setLoading] = useState(true)
  const [miPerfil, setMiPerfil] = useState<Perfil | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', nombre_completo: '', cargo: '', departamento_id: '', rol: 'usuario' })
  const [creando, setCreando] = useState(false)
  const supabase = createClient()

  const cargar = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: p } = await supabase.from('perfiles').select('*').eq('id', user.id).single()
      setMiPerfil(p)
      if (p?.rol !== 'administrador') { setLoading(false); return }
    }
    const [{ data: u }, { data: d }] = await Promise.all([
      supabase.from('perfiles').select('*, departamento:departamento_id(id,nombre)').order('creado_en'),
      supabase.from('departamentos').select('*').eq('activo', true),
    ])
    setUsuarios(u || [])
    setDepartamentos(d || [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const crearUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreando(true)
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error || 'Error al crear usuario'); setCreando(false); return }
    toast.success('Usuario creado correctamente')
    setMostrarForm(false)
    setForm({ email: '', password: '', nombre_completo: '', cargo: '', departamento_id: '', rol: 'usuario' })
    await cargar()
    setCreando(false)
  }

  const cambiarRol = async (id: string, rol: string) => {
    await supabase.from('perfiles').update({ rol }).eq('id', id)
    toast.success('Rol actualizado')
    await cargar()
  }

  const toggleActivo = async (id: string, activo: boolean) => {
    await supabase.from('perfiles').update({ activo: !activo }).eq('id', id)
    toast.success(activo ? 'Usuario desactivado' : 'Usuario activado')
    await cargar()
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Cargando...</div>
  if (miPerfil?.rol !== 'administrador') return (
    <div className="p-12 text-center">
      <Users size={40} className="text-gray-200 mx-auto mb-3" />
      <p className="text-gray-400">No tienes permisos para ver esta seccion</p>
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{usuarios.length} usuarios registrados</p>
        <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-primary">
          <UserPlus size={16} /> Nuevo usuario
        </button>
      </div>

      {mostrarForm && (
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Crear nuevo usuario</h3>
          <form onSubmit={crearUsuario} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo *</label>
              <input value={form.nombre_completo} onChange={e => setForm(p => ({ ...p, nombre_completo: e.target.value }))}
                className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo *</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contrasena *</label>
              <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="input" minLength={6} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cargo</label>
              <input value={form.cargo} onChange={e => setForm(p => ({ ...p, cargo: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Departamento</label>
              <select value={form.departamento_id} onChange={e => setForm(p => ({ ...p, departamento_id: e.target.value }))} className="input">
                <option value="">Sin departamento</option>
                {departamentos.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rol</label>
              <select value={form.rol} onChange={e => setForm(p => ({ ...p, rol: e.target.value }))} className="input">
                <option value="usuario">Usuario</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="submit" disabled={creando} className="btn-primary">
                {creando ? <><Loader2 size={15} className="animate-spin" /> Creando...</> : 'Crear usuario'}
              </button>
              <button type="button" onClick={() => setMostrarForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {['Usuario', 'Cargo', 'Departamento', 'Rol', 'Estado', 'Registrado', 'Acciones'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {usuarios.map(u => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-guinda-100 flex items-center justify-center">
                      <span className="text-guinda-700 text-xs font-bold">{getInitials(u.nombre_completo)}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{u.nombre_completo}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{u.cargo || '--'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{(u as any).departamento?.nombre || '--'}</td>
                <td className="px-4 py-3">
                  <select value={u.rol} onChange={e => cambiarRol(u.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-guinda-400">
                    <option value="usuario">Usuario</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${u.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{formatDate(u.creado_en)}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActivo(u.id, u.activo)}
                    className={`text-xs font-medium ${u.activo ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}>
                    {u.activo ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
