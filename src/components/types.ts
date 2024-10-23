export interface User {
  name: string;
  image: string;
  username: string;
  audience: {
    [username: string]: { name: string; image: string };
  };
  connections: {
    [username: string]: { name: string; image: string; isallowed: boolean };
  };
  connectpostrental: [];
  connectpostdiscover: [];
  connectpostapplication: [];
  isdeleteuserrequest: boolean;
}


export interface App {
  _id: string;
  name: string;
  username: string;
  appName: string;
  caption: string;
  place: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  like: [];
  comment: [];
  connectionpost: {
    _id: string;
    image: string;
    caption: string;
    name: string;
    appName: string;
    username: string;
    createdAt: string;
  }[];
}

export interface Discover {
  _id: string;
  name: string;
  username: string;
  discoverName: string;
  discoverImage: string;
  caption: string;
  place: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  like: [];
  comment: [];
  connectionpost: {
    _id: string;
    username:string;
    image: string;
    caption: string;
    name: string;
    discoverName: string;
    discoverImage: string;
    createdAt: string;
  }[];
}

export interface Rental {
  _id: string;
  name: string;
  username: string;
  rentalName: string;
  rentalImage: string;
  caption: string;
  place: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  like: [];
  comment: [];
  connectionpost: {
    _id: string;
    image: string;
    caption: string;
    username:string;
    name: string;
    rentalName: string;
    rentalImage: string;
    createdAt: string;
  }[];
}


export interface SearchUserResult {
  name: string;
  username: string;
  image: string;
  audience: {
    [username: string]: { name: string; image: string };
  };
}

export interface SearchRentalResult {
  _id: string;
  name: string;
  username: string;
  image: string;
  rentalName: string;
  rentalImage: string;
  caption: string;
  place: string;
  like: string[];
  comment: [];
  connectionpost: [];
}

export interface SearchDiscoverResult {
  _id: string;
  name: string;
  username: string;
  image: string;
  discoverName: string;
  discoverImage: string;
  caption: string;
  place: string;
  like: string[];
  comment: [];
  connectionpost: [];
}


export interface DiscoverResult {
  _id: string;
  name: string;
  username: string;
  image: string;
  discoverName: string;
  discoverImage: string;
  caption: string;
  place: string;
  like: string[];
  comment: [];
  connectionpost: {
    _id: string;
    image: string;
    caption: string;
    name: string;
    discoverName: string;
    place: string;
    discoverImage: string;
  }[];
}

export interface RentalResult {
  _id: string;
  name: string;
  username: string;
  image: string;
  rentalName: string;
  rentalImage: string;
  caption: string;
  place: string;
  like: string[];
  comment: [];
  connectionpost: {
    _id: string;
    image: string;
    caption: string;
    name: string;
    rentalName: string;
    place: string;
    rentalImage: string;
  }[];
}
