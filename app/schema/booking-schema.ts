import mongoose, { Schema, Document } from 'mongoose';

interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  cafeId: mongoose.Types.ObjectId;
  menuItems: string[];
  date: Date;
  timeSlot: string; // e.g., "7:00 PM - 9:00 PM"
  numberOfPeople: number;
  totalPrice: number;
  order_id: string;
  status: string;
}

const bookingSchema = new Schema<IBooking>({
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    cafeId: { type: Schema.Types.ObjectId, ref: 'Cafes', required: true },
    menuItems: [{ type: String, required: true }],
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    numberOfPeople: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    totalPrice: { type: Number, required: true },
    order_id: { type: String, required: false , default: ""},
    status: { type: String, default: "Pending" }
  }, { timestamps: true });
  

const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
