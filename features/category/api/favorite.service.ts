import { clientRequest } from "@/core/api/client";
import { ENDPOINTS } from "@/core/api/endpoints";

export type FavoritePayload = {
  classroom_id: string | number;
};

export const favoriteService = {
  async add(classroomId: string | number): Promise<void> {
    await clientRequest({
      url: ENDPOINTS.favorite.create,
      method: "POST",
      data: { classroom_id: classroomId } satisfies FavoritePayload,
    });
  },

  async remove(classroomId: string | number): Promise<void> {
    await clientRequest({
      url: ENDPOINTS.favorite.remove(classroomId),
      method: "DELETE",
    });
  },
};
