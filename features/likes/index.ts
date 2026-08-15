export type {
  FavoriteButtonProps,
  LikeEntityType,
  ToggleLikeResult,
  ToggleLikeVariables,
} from "./types";

export { PROFILE_SELECT_HREF, FAVORITE_BUTTON_CLASS } from "./constants";

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
