export interface Setting {
  id?: number;
  created_at?: string;
  minBookingLength?: number;
  maxBookingLength?: number;
  maxGuestsPerBooking?: number;
  breakfastPrice?: number;
}
