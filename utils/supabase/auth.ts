import { supabase } from './client';

import { Alert } from 'react-native';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) Alert.alert(error.message)

  return { data, error };
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) Alert.alert(error.message)

  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) Alert.alert(error.message)


  return { error };
}

export function getSession() {
  return supabase.auth.getSession();
}