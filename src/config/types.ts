export interface MediaTypes {
  type: "film" | "tv" | "album" | "";
}

export interface MediaSet {
  media: MediaById;
  date: Date;
  star: number;
  seen: Boolean;
}

export interface MediaByDate {
  date: Date;
  dateAdded: Date;
  id: string;
  seen: boolean;
  star: number;
  type: string;
}

export interface MediaById {
  poster: string;
  title: string;
  date: Date;
  overview: string;
  artist: string;
  star: number;
  seen: boolean;
  info: object;
}

export interface Style {
  colors: {
    primary: string;
    secondary: string;
    orange: string;
    blue: string;
    "bg-primary": string;
    "bg-secondary": string;
    "border-primary": string;
    "border-secondary": string;
  };
}
