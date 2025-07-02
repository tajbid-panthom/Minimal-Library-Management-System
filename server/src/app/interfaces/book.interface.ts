import { Model } from "mongoose";

export interface IBoook {
  title: string;
  author: string;
  genre:
    | "FICTION"
    | "NON_FICTION"
    | "SCIENCE"
    | "HISTORY"
    | "BIOGRAPHY"
    | "FANTASY";
  isbn: string;
  description: string;
  copies: number;
  available: boolean;
}
export interface BookAvailableStaticMethod extends Model<IBoook> {
  bookAvailablity(copies: number): boolean;
}
