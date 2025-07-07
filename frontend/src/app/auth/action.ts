'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/server'

export async function login(formData: { email: string,
    password: string,
    confirmPassword:string,
    name:string}) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email as string,
    password: formData.password as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: { email: string,
    password: string,
    confirmPassword:string,
    name:string}) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email as string,
    password: formData.password as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}