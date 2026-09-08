import type { UserProfile } from "@/core/types/profile.types";

import { GOAL_SELECTION_HREF, PROFILE_HOME_HREF } from "../constants";

export function getProfileDestination(profile: UserProfile) {
  if (profile.is_survey_completed === false) {
    return GOAL_SELECTION_HREF;
  }

  return PROFILE_HOME_HREF;
}
