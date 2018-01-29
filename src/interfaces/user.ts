export interface IUser {
  createdAt: Date;
  updatedAt: Date;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
