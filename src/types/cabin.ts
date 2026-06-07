// The shape stored in the database
export interface Cabin {
  id?: number;
  created_at?: string;
  name: string;
  maxCapacity: number; // ← also fix this, should be number not string
  regularPrice: number;
  discount: number;
  description: string;
  image: string; // ← URL string from Supabase
}

// The shape of the form data
export interface CabinFormData {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: FileList; // ← FileList from the file input
}

// 3. What you send to the mutation — image is a File object
export type NewCabin = Omit<Cabin, 'id' | 'created_at' | 'image'> & {
  image: File; // ← single File extracted from FileList
};
