import type { Cabin } from './cabin.ts';
import type { Guest } from './guest.ts';

export type BookingStatus = 'unconfirmed' | 'checked-in' | 'checked-out';

export interface Booking {
  id?: number;
  created_at?: string;
  startDate?: string;
  endDate?: string;
  numNights?: number;
  numGuests?: number;
  cabinPrice?: number;
  extrasPrice?: number;
  totalPrice?: number;
  status?: BookingStatus;
  hasBreakfast?: boolean;
  isPaid?: boolean;
  observations?: string;
  cabinId?: number; // foreign key → Cabin
  guestId?: number; // foreign key → Guest
}

// When you fetch a booking with its relations joined:
export interface BookingWithDetails extends Booking {
  cabin: Cabin;
  guest: Guest;
}
