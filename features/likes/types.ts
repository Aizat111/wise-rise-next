export type LikeEntityType = "classroom" | "teacher";

export type ToggleLikeVariables = {
  profileId: string | number;
  entityId: string | number;
  nextLiked: boolean;
};

export type ToggleLikeResult = {
  nextLiked: boolean;
};

export type FavoriteButtonProps = {
  type: LikeEntityType;
  entityId: string | number;
  initialLiked?: boolean;
  className?: string;
  iconClassName?: string;
};
