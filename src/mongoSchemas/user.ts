import * as bcrypt from "bcrypt";
import { Schema } from "mongoose";
import * as mongooseHidden from "mongoose-hidden";
import * as uuid from "uuid";

const monHidden = mongooseHidden({ defaultHidden: { password: true } });

const SALT_WORK_FACTOR = parseInt(process.env.SALT_WORK_FACTOR || "10", 10);

export const userSchema: Schema = new Schema({
  _id: {
    default: function genUUID() {
      return uuid.v4();
    },
    type: String,
  },
  createdAt: Date,
  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    hide: true,
    required: true,
    type: String,
  },
updatedAt: Date,
});

userSchema.set("toJSON", { virtuals: true });

userSchema.plugin(monHidden);

userSchema.pre("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }

  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, SALT_WORK_FACTOR);
  }

  this.updatedAt = new Date();

  return next();
});

userSchema.methods.comparePassword = function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};
