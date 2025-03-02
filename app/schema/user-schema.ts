import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  mobile_no: number;
  age: number;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile_no: { type: Number, required: true },
  age: { type: Number, required: true },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);


export default User;