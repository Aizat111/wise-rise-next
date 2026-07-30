export type HeroPlatform = "wisenrise" | "wetheliving" | string;

export type HeroMediaType = "image" | "video" | string;

export type Hero = {
  id: string;
  platform: HeroPlatform;
  media_type: HeroMediaType;
  title: string | null;
  description: string | null;
  button_text: string | null;
  button_url: string | null;
  order: number;
  is_active: boolean;
  show_on_homepage: boolean;
  image_url: string;
  mobile_image_url: string | null;
  video_url: string | null;
};

export type HeroesResponse = {
  data: Hero[];
};
