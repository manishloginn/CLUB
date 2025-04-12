import mongoose, { Schema, Document } from 'mongoose';

interface IMenu extends Document {
  cafeId: mongoose.Types.ObjectId; // To link this menu to a specific cafe
  combo: string; // Description like "1 Hukkah, 2 Drinks"
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const menuSchema = new Schema<IMenu>({
  cafeId: { type: Schema.Types.ObjectId, ref: 'Cafes', required: true },
  combo: { type: String, required: true, maxlength: 300 },
  price: { type: Number, required: true, min: 0 },
}, {
  timestamps: true
});

const Menu = mongoose.models.Menus || mongoose.model<IMenu>('Menus', menuSchema);

export default Menu;
