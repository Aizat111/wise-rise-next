export type {
  FavoriteButtonProps,
  LikeEntityType,
  ToggleLikeResult,
  ToggleLikeVariables,
} from "./types";

export {
  PROFILE_SELECT_HREF,
  FAVORITE_BUTTON_CLASS,
  LIKED_INITIAL_PAGE,
} from "./constants";

export { likeService } from "./api/like.service";
export {
  useLikedClassroomsQuery,
  useLikedTeachersQuery,
} from "./api/like.queries";
export {
  useLikeClassroomMutation,
  useLikeTeacherMutation,
} from "./api/like.mutations";

export { FavoriteButton } from "./components/FavoriteButton";
