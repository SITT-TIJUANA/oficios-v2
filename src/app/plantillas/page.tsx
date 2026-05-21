'use client'

import { FileStack, Upload, Info } from 'lucide-react'

export default function PlantillasPage() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Info size={22} className="text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Administracion de plantillas</h3>
            <p className="text-sm text-gray-500 mt-1">
              Esta funcion permite subir plantillas DOCX para generar reportes personalizados.
              Por ahora usa la funcion de exportar CSV/Excel en el modulo de Reportes.
            </p>
          </div>
        </div>
      </div>

      <div className="card p-12 text-center border-2 border-dashed border-gray-200 hover:border-guinda-300 transition-colors cursor-pointer">
        <FileStack size={48} className="text-gray-200 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Subir plantilla DOCX</p>
        <p className="text-gray-400 text-sm mt-1">Arrastra o haz clic para seleccionar</p>
        <button className="btn-primary mt-4 mx-auto w-fit text-sm">
          <Upload size={15} /> Seleccionar archivo
        </button>
      </div>

      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Variables disponibles para plantillas</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['{{numero}}', 'Numero de oficio'],
            ['{{tema}}', 'Tema/asunto'],
            ['{{fecha_inicio}}', 'Fecha de inicio'],
            ['{{estado}}', 'Estado actual'],
            ['{{prioridad}}', 'Prioridad'],
            ['{{asignado_a}}', 'Responsable'],
            ['{{departamento}}', 'Departamento'],
            ['{{observaciones}}', 'Observaciones'],
          ].map(([v, d]) => (
            <div key={v} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <code className="text-xs font-mono text-guinda-700 bg-guinda-50 px-1.5 py-0.5 rounded">{v}</code>
              <span className="text-xs text-gray-500">{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
