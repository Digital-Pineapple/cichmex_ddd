import { UserEntity } from "../user/UserEntity";

export interface AddressEntity {
  user_id: UserEntity;
  name?: string;
  phone?: string;
  street?: string;
  numext?: string;
  numint?: string;
  zipcode?: string;
  city?: string;
  state?: string;
  municipality?: string;
  neighborhood?: string;
  reference?: string;
  btwstreet?: string;
  country?: string;
  status?: boolean;
  default?: boolean;
  coords?: Coords;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface Coords {
  lat: number;
  lgt: number;
}
