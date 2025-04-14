import mongoose, { Schema, Document } from 'mongoose';

interface IBookingCollectRequest extends Document {
  collect_id: mongoose.Types.ObjectId;
  order_amount: number;
  transaction_amount: number;
  status: string;
  details: string;
  bank_reference: string;
  payment_time: string;
  reason: string;
  payment_message: string;
  payment_id: string;
}

const bookingCollectRequestSchema = new Schema<IBookingCollectRequest>({
  collect_id: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  order_amount: { type: Number, required: true },
  transaction_amount: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  details: { type: String },
  bank_reference: { type: String },
  payment_time: { type: String },
  reason: { type: String },
  payment_message: { type: String },
  payment_id: { type: String },
}, { timestamps: true });

const BookingCollectRequest = mongoose.models.BookingCollectRequest || mongoose.model<IBookingCollectRequest>('BookingCollectRequest', bookingCollectRequestSchema);

export default BookingCollectRequest;
