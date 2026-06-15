'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTransaction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const type = formData.get('type') as string // 'income' or 'expense'
  const amountStr = formData.get('amount') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const shariah_status = formData.get('shariah_status') as string

  // Parse amount from "Rp 10.000" or raw string to number
  const amount = Number.parseInt(amountStr.replace(/\D/g, ''), 10)

  if (Number.isNaN(amount) || amount <= 0) {
    return { error: 'Nominal tidak valid' }
  }

  const { error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      type,
      amount,
      category,
      description,
      date,
      shariah_status,
      source: 'manual'
    })

  if (error) {
    console.error('Insert transaction error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/transactions')
  revalidatePath('/laporan')

  return { success: true }
}
