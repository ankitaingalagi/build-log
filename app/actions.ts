'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export type ActionState = { error?: string; success?: boolean }

export async function createBuildLog(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const project_link = (formData.get('project_link') as string)?.trim() || null

  if (!name || !description) {
    return { error: 'Name and description are required.' }
  }

  const { error } = await supabase
    .from('BUILD_LOGS')
    .insert({ name, description, project_link })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function incrementReaction(logId: string, reaction: 'fire' | 'clap' | 'rocket') {
  await supabase.rpc('increment_reaction', { log_id: logId, reaction })
}
