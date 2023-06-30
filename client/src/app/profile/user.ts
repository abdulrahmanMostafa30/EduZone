export interface IUser {
  fname: string;
  lname: string;
  fullName: string;
  birthDate: string;
  email: string;
  imagePath: string;
  country: string;
  address: string;
  university: string;
  faculty: string;
  department: string;
  note: string;
  role: string;
}
export interface IUserResponse {
  status: string,
  data: {
    data: IUser
  }
}
