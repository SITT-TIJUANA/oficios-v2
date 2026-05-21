import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { email, password, nombre_completo, cargo, departamento_id, rol } = await req.json()
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { nombre_completo },
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    await supabase.from('perfiles').upsert({
      id: data.user.id,
      nombre_completo,
      cargo: cargo || null,
      departamento_id: departamento_id || null,
      rol: rol || 'usuario',
      activo: true,
    })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
