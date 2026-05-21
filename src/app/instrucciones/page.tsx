'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, ClipboardList, Loader2 } from 'lucide-react'
import { formatDate, PRIORIDAD_COLORS } from '@/lib/utils'
import { toast } from 'sonner'
import type { Instruccion, Perfil } from '@/types'

const ESTADO_INST: Record<string, string> = {
  pendiente: 'Pendiente', en_proceso: 'En proceso', completada: 'Completada', cancelada: 'Cancelada'
}
const COLOR_INST: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700', en_proceso: 'bg-blue-100 text-blue-700',
  completada: 'bg-green-100 text-green-700', cancelada: 'bg-red-100 text-red-600'
}

export default function InstruccionesPage() {
  const [instrucciones, setInstrucciones] = useState<Instruccion[]>([])
  const [usuarios, setUsuarios] = useState<Perfil[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState({ folio: '', instruccion: '', prioridad: 'normal', asignado_a: '' })
  const [guardando, setGuardando] = useState(false)
  const supabase = createClient()

  const cargar = async () => {
    const [{ data: inst }, { data: u }] = await Promise.all([
      supabase.from('instrucciones').select('*').order('creado_en', { ascending: false }),
      supabase.from('perfiles').select('*'),
    ])
    setInstrucciones(inst || [])
    setUsuarios(u || [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.instruccion) return
    setGuardando(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('instrucciones').insert({
      ...form, estado: 'pendiente',
      asignado_a: form.asignado_a || null,
      creado_por: user?.id,
    })
    toast.success('Instruccion registrada')
    setForm({ folio: '', instruccion: '', prioridad: 'normal', asignado_a: '' })
    setMostrarForm(false)
    await cargar()
    setGuardando(false)
  }

  const cambiarEstado = async (id: string, estado: string) => {
    await supabase.from('instrucciones').update({ estado }).eq('id', id)
    toast.success('Estado actualizado')
    await cargar()
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{instrucciones.length} instrucciones</p>
        <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-primary">
          <Plus size={16} /> Nueva instruccion
        </button>
      </div>

      {mostrarForm && (
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Registrar instruccion</h3>
          <form onSubmit={guardar} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Folio</label>
                <input value={form.folio} onChange={e => setForm(p => ({ ...p, folio: e.target.value }))} className="input" placeholder="INST-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Prioridad</label>
                <select value={form.prioridad} onChange={e => setForm(p => ({ ...p, prioridad: e.target.value }))} className="input">
                  {['baja','normal','alta','urgente'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Instruccion *</label>
              <textarea value={form.instruccion} onChange={e => setForm(p => ({ ...p, instruccion: e.target.value }))}
                className="input min-h-[80px] resize-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Asignar a</label>
              <select value={form.asignado_a} onChange={e => setForm(p => ({ ...p, asignado_a: e.target.value }))} className="input">
                <option value="">Sin asignar</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre_completo}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={guardando} className="btn-primary">
                {guardando ? <Loader2 size={15} className="animate-spin" /> : null} Guardar
              </button>
              <button type="button" onClick={() => setMostrarForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Cargando...</div> :
         instrucciones.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No hay instrucciones registradas</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['Folio','Instruccion','Estado','Prioridad','Fecha','Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {instrucciones.map(inst => (
                <tr key={inst.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-mono text-sm text-gray-600">{inst.folio || '--'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-sm">
                    <p className="line-clamp-2">{inst.instruccion}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${COLOR_INST[inst.estado]}`}>{ESTADO_INST[inst.estado]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${PRIORIDAD_COLORS[inst.prioridad]}`}>{inst.prioridad}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{formatDate(inst.creado_en)}</td>
                  <td className="px-4 py-3">
                    <select value={inst.estado} onChange={e => cambiarEstado(inst.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
                      {Object.entries(ESTADO_INST).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
