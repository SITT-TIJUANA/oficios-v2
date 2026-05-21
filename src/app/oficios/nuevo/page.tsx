'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { Departamento, Perfil } from '@/types'

export default function NuevoOficioPage() {
  const [form, setForm] = useState({
    numero: '', tema: '', descripcion: '', prioridad: 'normal',
    departamento_id: '', asignado_a: '', requiere_respuesta: false,
    fecha_inicio: new Date().toISOString().split('T')[0], observaciones: '',
  })
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [usuarios, setUsuarios] = useState<Perfil[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const cargar = async () => {
      const [{ data: deps }, { data: users }] = await Promise.all([
        supabase.from('departamentos').select('*').eq('activo', true),
        supabase.from('perfiles').select('*').eq('activo', true),
      ])
      setDepartamentos(deps || [])
      setUsuarios(users || [])
    }
    cargar()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.numero || !form.tema) { toast.error('Numero y tema son requeridos'); return }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('oficios').insert({
      ...form,
      estado: 'recibido',
      departamento_id: form.departamento_id || null,
      asignado_a: form.asignado_a || null,
      creado_por: user?.id,
    })
    if (error) { toast.error('Error al guardar'); setLoading(false); return }
    toast.success('Oficio registrado correctamente')
    router.push('/oficios')
  }

  const f = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/oficios" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <h2 className="text-lg font-semibold text-gray-900">Registrar nuevo oficio</h2>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Numero de oficio *</label>
            <input value={form.numero} onChange={e => f('numero', e.target.value)} className="input" placeholder="OF-2024-001" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Prioridad</label>
            <select value={form.prioridad} onChange={e => f('prioridad', e.target.value)} className="input">
              {['baja','normal','alta','urgente'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tema / Asunto *</label>
          <input value={form.tema} onChange={e => f('tema', e.target.value)} className="input" placeholder="Descripcion breve del oficio" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripcion</label>
          <textarea value={form.descripcion} onChange={e => f('descripcion', e.target.value)}
            className="input min-h-[80px] resize-none" placeholder="Detalles adicionales..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Departamento</label>
            <select value={form.departamento_id} onChange={e => f('departamento_id', e.target.value)} className="input">
              <option value="">Sin departamento</option>
              {departamentos.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Asignado a</label>
            <select value={form.asignado_a} onChange={e => f('asignado_a', e.target.value)} className="input">
              <option value="">Sin asignar</option>
              {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre_completo}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de inicio</label>
            <input type="date" value={form.fecha_inicio} onChange={e => f('fecha_inicio', e.target.value)} className="input" />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.requiere_respuesta} onChange={e => f('requiere_respuesta', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-guinda-700 focus:ring-guinda-500" />
              <span className="text-sm font-medium text-gray-700">Requiere respuesta</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Observaciones</label>
          <textarea value={form.observaciones} onChange={e => f('observaciones', e.target.value)}
            className="input min-h-[60px] resize-none" placeholder="Notas adicionales..." />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Guardando...</> : <><Save size={16} /> Registrar oficio</>}
          </button>
          <Link href="/oficios" className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}
