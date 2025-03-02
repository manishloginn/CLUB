import mongoose, { Schema, Document } from 'mongoose';

interface CafeLocation {
    address: string;
    city: string;
    country: string;
}

interface Icafe extends Document {
    club_name: string;
    location: CafeLocation;
    images_url: string[];
    max_length: number;
    isActive: boolean;
}

const cafeSchema = new Schema<Icafe>({
    club_name: { type: String, required: true },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
    }, 
    images_url: { type: [String], required: true },
    max_length: { type: Number, required: true },
    isActive: { type: Boolean, required: true },
});

const Cafe = mongoose.model<Icafe>('Cafe', cafeSchema);

export default Cafe;
