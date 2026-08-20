import type {
  Classroom,
  ClassroomCategory,
  ClassroomMedia,
  ClassroomTeacher,
} from "./classroom.types";

export type CertificateFile = {
  path?: string | null;
  url?: string | null;
  name?: string | null;
};

export type Certificate = {
  id: string | number;
  uuid?: string | null;
  user_id?: string | number | null;
  userId?: string | number | null;
  profile_id?: string | number | null;
  profileId?: string | number | null;
  name?: string | null;
  title?: string | null;
  classroom?: Classroom | null;
  category?: ClassroomCategory | null;
  teacher?: ClassroomTeacher | null;
  thumbnail?: ClassroomMedia | null;
  image?: ClassroomMedia | CertificateFile | null;
  file?: CertificateFile | null;
  pdf?: CertificateFile | string | null;
  pdf_url?: string | null;
  pdfUrl?: string | null;
  download_url?: string | null;
  downloadUrl?: string | null;
  public_url?: string | null;
  publicUrl?: string | null;
  share_url?: string | null;
  shareUrl?: string | null;
  url?: string | null;
  link?: string | null;
};

export type CertificateDetail = Certificate;

export type CertificatesListResponse =
  | Certificate[]
  | {
      data?: Certificate[] | { data?: Certificate[]; certificates?: Certificate[] };
      certificates?: Certificate[];
    };

export type CertificateDetailResponse =
  | Certificate
  | { data?: Certificate | { data?: Certificate } | Certificate[] }
  | { certificate?: Certificate };
