import type { Cabin, NewCabin } from '../types/cabin';
import supabase, { supabaseUrl } from './supabase';

export async function getCabins(): Promise<Cabin[]> {
  const { data: cabins, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error(error);
    throw new Error('Cabins could not be loaded');
  }

  return cabins;
}

export async function createUpdateCabin(newCabin: NewCabin, id?: number): Promise<Cabin> {
  const hasImagePath = typeof newCabin.image === 'string';

  const imageName =
    typeof newCabin.image === 'object' && 'name' in newCabin.image
      ? `${Math.random()}-${newCabin.image.name}`.replaceAll('/', '')
      : '';

  const imagePath = hasImagePath
    ? (newCabin.image as string)
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  const query = id
    ? supabase
        .from('cabins')
        .update({ ...newCabin, image: imagePath })
        .eq('id', id)
        .select()
        .single()
    : supabase
        .from('cabins')
        .insert([{ ...newCabin, image: imagePath }])
        .select()
        .single();

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error('Cabin could not be created');
  }

  if (!hasImagePath) {
    const { error: storageError } = await supabase.storage.from('cabin-images').upload(imageName, newCabin.image);

    if (storageError) {
      await supabase.from('cabins').delete().eq('id', data.id);
      console.error(storageError);
      throw new Error('Cabin image could not be uploaded and the cabin was not created');
    }
  }

  return data;
}

export async function deleteCabin(cabinId: string): Promise<Cabin> {
  const { data: cabin, error } = await supabase.from('cabins').delete().eq('id', cabinId);

  if (error) {
    console.error(error);
    throw new Error('Cabin could not be deleted');
  }

  return cabin;
}
