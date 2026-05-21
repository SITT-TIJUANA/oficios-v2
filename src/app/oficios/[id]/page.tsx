'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Clock, CheckCircle, Archive, AlertTriangle, FileText, Send, RotateCcw, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { formatDate, ESTADO_LABELS, ESTADO_COLORS, PRIORIDAD_COLORS } from '@/lib/utils'
import type { Oficio, Movimiento, EstadoOficio } from '@/types'

const FLUJO: Record<EstadoOficio, EstadoOficio[]> = {
  recibido: ['elaboracion'],
  elaboracion: ['firmado'],
  firmado: ['requiere_respuesta', 'terminado', 'archivado'],
  requiere_respuesta: ['sin_respuesta', 'respondido'],
  sin_respuesta: ['requiere_respuesta', 'archivado'],
  respondido: ['terminado'],
  terminado: ['archivado'],
  archivado: [],
}

export default function OficioDetallePage() {
  const { id } = useParams()
  const [oficio, setOficio] = useState<Oficio | null>(null)
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [comentario, setComentario] = useState('')
  const [loading, setLoading] = useState(true)
  const [cambiando, setCambiando] = useState(false)
  const supabase = createClient()

  const cargar = async () => {
    const [{ data: o }, { data: m }] = await Promise.all([
      supabase.from('oficios').select('*').eq('id', id).single(),
      supabase.from('movimientos_oficio').select('*').eq('oficio_id', id).order('creado_en', { ascending: false }),
    ])
    setOficio(o as Oficio)
    setMovimientos(m || [])
    setLoading(false)
  }

  useEffect(() => { cargar() }, [id])

  const cambiarEstado = async (nuevoEstado: EstadoOficio) => {
    if (!oficio) return
    setCambiando(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('movimientos_oficio').insert({
      oficio_id: oficio.id, estado_anterior: oficio.estado,
      estado_nuevo: nuevoEstado, comentario: comentario || null, realizado_por: user?.id,
    })
    await supabase.from('oficios').update({ estado: nuevoEstado, actualizado_en: new Date().toISOString() }).eq('id', oficio.id)
    toast.success(`Estado actualizado a: ${ESTADO_LABELS[nuevoEstado]}`)
    setComentario('')
    await cargar()
    setCambiando(false)
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Cargando...</div>
  if (!oficio) return <div className="p-8 text-center text-gray-400">Oficio no encontrado</div>

  const siguientes = FLUJO[oficio.estado] || []

  const ETAPAS: EstadoOficio[] = ['recibido', 'elaboracion', 'firmado', 'requiere_respuesta', 'respondido', 'terminado', 'archivado']
  const etapaActual = ETAPAS.indexOf(oficio.estado)

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/oficios" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">{oficio.numero}</h2>
            <span className={`badge ${ESTADO_COLORS[oficio.estado]}`}>{ESTADO_LABELS[oficio.estado]}</span>
            <span className={`badge ${PRIORIDAD_COLORS[oficio.prioridad]}`}>{oficio.prioridad}</span>
          </div>
          <p className="text-gray-500 text-sm">{oficio.tema}</p>
        </div>
      </div>

      {/* Flujo visual */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Progreso del oficio</h3>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {ETAPAS.map((etapa, i) => {
            const pasado = i < etapaActual
            const actual = i === etapaActual
            return (
              <div key={etapa} className="flex items-center gap-1 flex-shrink-0">
                <div className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  actual ? 'bg-guinda-700 text-white shadow-md' :
                  pasado ? 'bg-emerald-100 text-emerald-700' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {ESTADO_LABELS[etapa]}
                </div>
                {i < ETAPAS.length - 1 && (
                  <div className={`w-5 h-0.5 ${pasado ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Info */}
        <div className="col-span-2 space-y-5">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Informacion</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Fecha inicio', formatDate(oficio.fecha_inicio)],
                ['Requiere respuesta', oficio.requiere_respuesta ? 'Si' : 'No'],
                ['Fecha despacho', formatDate(oficio.fecha_despacho)],
                ['Fecha respuesta', formatDate(oficio.fecha_respuesta)],
                ['Fecha terminacion', formatDate(oficio.fecha_terminacion)],
                ['Creado', formatDate(oficio.creado_en)],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-gray-400 text-xs">{k}</p>
                  <p className="text-gray-800 font-medium">{v}</p>
                </div>
              ))}
            </div>
            {oficio.descripcion && (
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-gray-400 text-xs mb-1">Descripcion</p>
                <p className="text-gray-700 text-sm">{oficio.descripcion}</p>
              </div>
            )}
            {oficio.observaciones && (
              <div className="mt-3">
                <p className="text-gray-400 text-xs mb-1">Observaciones</p>
                <p className="text-gray-700 text-sm">{oficio.observaciones}</p>
              </div>
            )}
          </div>

          {/* Cambiar estado */}
          {siguientes.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Avanzar proceso</h3>
              <textarea value={comentario} onChange={e => setComentario(e.target.value)}
                className="input min-h-[60px] resize-none mb-3 text-sm" placeholder="Comentario (opcional)..." />
              <div className="flex flex-wrap gap-2">
                {siguientes.map(sig => (
                  <button key={sig} onClick={() => cambiarEstado(sig)} disabled={cambiando}
                    className="btn-primary text-sm py-2 px-4">
                    {cambiando ? <Loader2 size={14} className="animate-spin" /> : null}
                    Mover a: {ESTADO_LABELS[sig]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Historial */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Historial</h3>
          {movimientos.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-4">Sin movimientos</p>
          ) : (
            <div className="space-y-3">
              {movimientos.map(m => (
                <div key={m.id} className="border-l-2 border-guinda-200 pl-3">
                  <p className="text-xs font-medium text-gray-700">{ESTADO_LABELS[m.estado_nuevo as EstadoOficio] || m.estado_nuevo}</p>
                  {m.comentario && <p className="text-xs text-gray-500 mt-0.5">{m.comentario}</p>}
                  <p className="text-[10px] text-gray-400 mt-1">{formatDate(m.creado_en)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
