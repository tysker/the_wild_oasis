// The shape stored in the database
export interface Cabin {
  id?: number;
  created_at?: string;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string | FileList | File;
}

// What you send to the mutation — image is a File object
export type NewCabin = Omit<Cabin, 'id' | 'created_at' | 'image'> & {
  image: string | FileList | File;
  id?: number;
};
