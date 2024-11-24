export type Listing = {
  id: string;
  image: string;
  name: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  price: number;
  photos: { href: string }[];
  forSale: boolean;
  type: string;
  ref: string;
  placeholderImage: string;
  agent_id: number;
  isOnwer: boolean;
};
