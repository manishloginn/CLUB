// types.ts
export interface Cafe {
    _id: string;
    club_name: string;
    location: { 
      address: string; 
      state: string; 
      city: string; 
      country: string 
    };
    images_url: string[];
    menuItems?: MenuItem[];
  }
  
  export interface MenuItem {
    _id: string;
    combo: string;
    price: number;
    description?: string;
  }
  
  export interface DecodedToken {
    userDetail: {
      _id: string;
      email?: string;
      name?: string;
      mobile_no?: number;
    };
    iat?: number;
    exp?: number;
  }