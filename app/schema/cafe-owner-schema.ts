import mongoose, { Schema, Document } from "mongoose";

interface cafeOwner extends Document {
    name: string;
    email: string;
    password: string;
    cafe_name: string;
    mobile_no: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const cafeOwnerSchema = new Schema<cafeOwner>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cafe_name: { type: String, required: true },
    mobile_no: { type: Number, required: true },
}, { timestamps: true }
);


const CafeOwner = mongoose.models.cafeOwner || mongoose.model<cafeOwner>('cafeOwner', cafeOwnerSchema);


export default CafeOwner;