'use client'

import { ArrowRight, Circle } from 'lucide-react'

const FLUJO = [
  { id: 'recibido', label: 'Oficio recibido', color: '#3b82f6', desc: 'Se registra el oficio con numero, tema y datos basicos' },
  { id: 'elaboracion', label: 'En elaboracion', color: '#f59e0b', desc: 'Se asigna a un responsable y se elabora el documento' },
  { id: 'firmado', label: 'Firmado / Despachado', color: '#8b5cf6', desc: 'El documento es revisado, aprobado y firmado' },
  { id: 'requiere_respuesta', label: 'Requiere respuesta', color: '#f97316', desc: 'Se envia al destinatario y se espera respuesta' },
  { id: 'respondido', label: 'Respondido', color: '#10b981', desc: 'El destinatario respondio el oficio' },
  { id: 'terminado', label: 'Terminado', color: '#059669', desc: 'El asunto quedo concluido satisfactoriamente' },
  { id: 'archivado', label: 'Archivado', color: '#6b7280', desc: 'El oficio se archiva en el expediente' },
]

const ALTERNO = [
  { id: 'sin_respuesta', label: 'Sin respuesta', color: '#ef4444', desc: 'No se recibio respuesta en el tiempo esperado' },
]

export default function FlujoPage() {
  return (
    <div className="space-y-8">
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-2">Flujo principal del proceso documental</h2>
        <p className="text-sm text-gray-500 mb-8">El oficio avanza por estas etapas desde que se recibe hasta que se archiva</p>

        {/* Main flow */}
        <div className="flex items-start gap-2 flex-wrap">
          {FLUJO.map((etapa, i) => (
            <div key={etapa.id} className="flex items-center gap-2">
              <div className="flex flex-col items-center group cursor-default">
                <div className="w-32 p-3 rounded-xl border-2 text-center transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ borderColor: etapa.color, background: `${etapa.color}10` }}>
                  <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: etapa.color }} />
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{etapa.label}</p>
                </div>
                <div className="w-32 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] text-gray-500 text-center leading-tight">{etapa.desc}</p>
                </div>
              </div>
              {i < FLUJO.length - 1 && <ArrowRight size={16} className="text-gray-300 flex-shrink-0 mt-4" />}
            </div>
          ))}
        </div>

        {/* Alternate flow */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Rama: Cuando no hay respuesta</p>
          <div className="flex items-center gap-3 ml-64">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-400 mb-2">desde "Requiere respuesta"</div>
              <ArrowRight size={16} className="text-gray-300" />
            </div>
            {ALTERNO.map(etapa => (
              <div key={etapa.id} className="w-32 p-3 rounded-xl border-2 text-center"
                style={{ borderColor: etapa.color, background: `${etapa.color}10` }}>
                <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: etapa.color }} />
                <p className="text-xs font-semibold text-gray-800 leading-tight">{etapa.label}</p>
              </div>
            ))}
            <ArrowRight size={16} className="text-gray-300" />
            <div className="text-xs text-gray-400">Se reitera o se archiva</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FLUJO.concat(ALTERNO).map(etapa => (
          <div key={etapa.id} className="card p-4 flex items-start gap-3">
            <div className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5" style={{ background: etapa.color }} />
            <div>
              <p className="text-sm font-medium text-gray-800">{etapa.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{etapa.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
