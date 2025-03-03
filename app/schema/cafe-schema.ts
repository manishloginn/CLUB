import mongoose, { Schema, Document } from 'mongoose';

interface CafeLocation {
    address: string;
    city: string;
    state:string;
    country: string;
    coordinates: {
        type: [number]; // Ensures an array of numbers (latitude, longitude)
        index: '2dsphere'; // Enables geospatial queries
    };
}

interface Icafe extends Document {
    club_name: string;
    location: CafeLocation;
    images_url: string[];
    capacity: number;
    isActive?: boolean;
}

const cafeSchema = new Schema<Icafe>({
    club_name: { type: String, required: true },
    location: {
        address: { type: String, required: true },
        state: { type: String, required:true},
        city: { type: String, required: true },
        country: { type: String, required: true },
        coordinates: {
            type: [Number], 
            required: true,
            index: '2dsphere' 
        }
    }, 
    images_url: { type: [String], required: true },
    capacity: { type: Number, required: true },
    isActive: { type: Boolean , required: false, default: false },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

const Cafe = mongoose.models.Cafes || mongoose.model<Icafe>('Cafes', cafeSchema);

export default Cafe;
