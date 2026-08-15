export interface IUser {
  id: string;
  email: string;
  phone: null;
  username: string;
  is_active: boolean;
  freebets: string;
  credits: string;
  full_name: null;
  profile_img: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  freebets_volume: string;
  credits_volume: string;
  level: number;
  created_at: Date;
  updated_at: Date;
  amount_wagered: string;
  affiliate: null;
  admin: boolean;
  can_tip: boolean;
  muted: boolean;
  telegram_id: null;
  is_hidden: boolean;
  is_track: boolean;
  is_weekly_race: boolean;
  is_hidden_on_weekly_race: boolean;
  token_balance: string;
  vault_balance: string;
  no_slot: boolean;
  no_withdraw: boolean;
  need_change_username: boolean;
  can_create_race: boolean;
  is_pool: boolean;
  no_rewards: boolean;
  role: string;
  wagering_since_raffle_start: string;
  raffle_tickets_with_gold: number;
  raffle_tickets_with_wagering: number;
  sponsored: boolean;
  is_ambassador: boolean;
  need_change_password: boolean;
  generated_ev: string;
  twoFactorEnabled: boolean;
  balance: number;
  gameToken: string;
  /** Wise&Rise membership fields returned by GET /me when present. */
  plan_type?: string | null;
  plan_id?: string | null;
  period?: string | null;
}

export interface IBetHistoryResponse {
  games: IBetHistory[];
  total: number;
}

export interface IBetHistory {
  id: string;
  result: string;
  freebets_spent: string;
  freebets_before: string;
  freebets_after: string;
  freebets_won: string;
  credits_spent: string;
  credits_before: string;
  credits_after: string;
  credits_won: string;
  multiplier: string;
  created_at: Date;
  updated_at: Date;
  game_name: string;
  gameUrl: string;
  gameImage: string;
  server_seed: string;
  client_seed: string;
  hashed_server_seed: string;
  nonce: string;
}

export interface IBanner {
  category: string;
  title: string;
  description: string;
  button_href: string;
  button_text: string;
  image: string;
  id: string;
}

export interface IBannersResponse {
  banners: IBanner[];
}

export interface IMyRace {
  id: string;
  position: number;
  username: string;
  profile_img: string | null;
  wagered_amount: string;
  prize_amount: string | null;
  me?: boolean;
}

export interface IMyRaceStats {
  start_date: string;
  end_date: string;
  total_prize_pool: string;
  created_at: string;
  updated_at: string;
  username: string; // affiliate username
}

export interface IMyRaceResponse {
  success: boolean;
  data: {
    standings: IMyRace[];
    stats: IMyRaceStats;
  } | null;
}

export interface IReferralsResponse {
  referralCodes: IReferralCode[];
  referrals: IReferral[];
  pagination: IPagination;
}

export interface IPagination {
  totalItems: number | string;
  currentPage: number;
  perPage: number;
}

export interface IReferralStatsResponse {
  referralCodes: IReferralCode[];
  totalStats: IReferralStats;
}

export interface IReferralCode {
  id: string | null;
  owner: string | null;
  code: string | null;
  bonus_percentage: number;
  expiration: string | null;
  total_earned: string;
  referral_balance: string;
  link_visit_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface IReferral {
  id: string | null;
  username: string | null;
  amount_wagered: string | null;
  created_at: Date;
  referralCode: string | null;
  earned: number;
  depositCount: number;
  depositAmount?: number;
  depositamount?: number;
}

export interface IReferralStats {
  totalEarnings: number;
  totalFriends: number;
  totalDepositCount: number;
  totalDepositAmount: number;
  totalLinkVisits: number;
}

export interface IUserLevelsXPResponse {
  freebets: string;
  credits: string;
  level: number;
  nextLevel: number;
  nextLevelXp: string;
  xp: string;
  percentageToNextLevel: number;
}

export interface ITasksResponse {
  status: boolean;
  data: ITasks[];
}

export interface ITasks {
  title: string;
  availablePoints?: number;
  tasks?: ITask[];
  quests?: IQuest[];
}

export interface IQuest {
  id: string;
  title: string;
  description: string;
  image: null;
  created_at: Date;
  claimed: boolean;
  completed: boolean;
  availablePoints: number;
  tasks: IQuestTask[];
}

export interface IQuestTask {
  id: string;
  title: string;
  points: number;
  description: string;
  progress: number;
  current_progress: number;
  completed: boolean;
  type: number;
  category: string;
  created_at: Date;
}

export interface ITask {
  id: string;
  title: string;
  points: string;
  description: null;
  completed: boolean;
  created_at: Date;
  isCoupon: boolean;
  twitter_link: string;
}

export interface IUserBalanceResponse {
  freebets: number;
  credits: number;
  vault_balance: string;
  token_balance: string;
}

export interface INotification {
  id: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface INotificationsResponse {
  notifications: INotification[];
  totalCount: number;
  unreadCount: number;
}

export interface IUserDDProgressResponse {
  progress: number;
  target: number;
}

export interface IUserRakebackResponse {
  rakeback_balance: number;
}

export interface IUserLevelResponse {
  level: number;
  profile_img: string;
  amount_wagered: string;
}

export interface ICheckRestrictionResponse {
  blocked: boolean;
  country_name: string;
  country_code: string;
}
