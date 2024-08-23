import { UserEntity } from "../user/UserEntity";

export interface AddressEntity {
  user_id: UserEntity;
  name?: string;
  phone?: string;
  street?: string;
  numext?: string;
  numint?: string;
  zipcode?: string;
  state?: string;
  coords?: Coords;
  municipality?: string;
  neighborhood?: string;
  reference?: string;
  btwstreet?: string;
  status?: boolean;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface Coords {
  lat: number;
  lgt: number;
}
