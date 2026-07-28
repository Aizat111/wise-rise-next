import {
  DotResultStatus,
  MatchPickData,
  PlayerActiveRoundFixturesResponse,
  PlayerTournamentInformation,
  PlayerTournamentStandings,
  PlayerTournamentSummary,
  SelectGameData,
  SelectGameMatch,
  TournamentBase,
  TournamentCardData
} from '../types/lms.types';

export const LMS_DEFAULT_TOURNAMENT_IMAGE = '/assets/images/tournament_join.jpg';
export const LMS_DEFAULT_TEAM_IMAGE = '/assets/images/team.png';
export const LMS_WORLD_CUP_TOURNAMENT_NAME = 'World Cup';
export const LMS_PLAYER_STATE_ELIMINATED = 'PLAYER_TOURNAMENT_STATE_ELIMINATED';
export const LMS_PLAYER_STATE_REMOVED = 'PLAYER_TOURNAMENT_STATE_REMOVED';
export const LMS_PLAYER_STATE_ACTIVE = 'PLAYER_TOURNAMENT_STATE_ACTIVE';
export const LMS_DRAW_CARD_STATE_ACTIVE = 'ACTIVE';
export const LMS_DRAW_CARD_STATE_OWNED = 'OWNED';
export const LMS_DRAW_CARD_STATE_USED = 'USED';

export const lmsFormatDecimalOdds = (value?: string | number | null, fallback = '--'): string => {
  if (value == null || value === '') return fallback;

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return String(value);

  return numeric.toFixed(2);
};

export const lmsValueLooksLikeDecimalOdds = (value?: string): boolean =>
  Boolean(value && value !== '--' && value !== '-' && value.includes('.'));

export type LmsTournamentPointsView = {
  balance: number;
  name: string;
  currencyCode: string;
  label: string;
};

type LmsPointsSource = Pick<
  PlayerTournamentInformation,
  'points' | 'points_currency_code' | 'points_name' | 'player_points_balance' | 'points_enabled'
>;

export const lmsResolveTournamentPoints = (info?: LmsPointsSource | null): LmsTournamentPointsView => {
  const currencyCode = info?.points_currency_code || 'LMS';
  const name = info?.points_name || 'LMS Points';
  const matchedPoint =
    info?.points?.find(point => point.currency_code === currencyCode) ??
    info?.points?.find(point => point.scope === 'TOURNAMENT') ??
    info?.points?.find(point => point.scope === 'GLOBAL');

  return {
    balance: LmsToNumber(matchedPoint?.balance ?? info?.player_points_balance ?? 0),
    name: matchedPoint?.name || name,
    currencyCode: matchedPoint?.currency_code || currencyCode,
    label: matchedPoint?.name || name || currencyCode
  };
};

export const lmsIsLifelineRoundInCosts = (
  info?: Pick<PlayerTournamentInformation, 'lifeline_costs'> | null,
  roundNo?: number
): boolean => {
  if (roundNo == null || !info?.lifeline_costs?.length) return false;

  return info.lifeline_costs.some(cost => cost.round_no === roundNo);
};

export const lmsResolveLifelinePointsCost = (info?: PlayerTournamentInformation | null, roundNo?: number): number => {
  if (!info) return 0;

  const round =
    roundNo ??
    info.current_lifeline_cost?.round_no ??
    LmsToNumber(info.player_current_round ?? info.active_round_count ?? info.start_matchweek ?? 1);

  const roundCost = info.lifeline_costs?.find(cost => cost.round_no === round);
  if (roundCost?.points_cost != null) {
    return LmsToNumber(roundCost.points_cost);
  }

  return 0;
};

export const lmsResolveDrawCardPointsCost = (info?: PlayerTournamentInformation | null, roundNo?: number): number => {
  if (!info) return 0;

  const round =
    roundNo ??
    info.current_draw_card_cost?.round_no ??
    LmsToNumber(info.player_current_round ?? info.active_round_count ?? info.start_matchweek ?? 1);

  const roundCost = info.draw_card_costs?.find(cost => cost.round_no === round);
  if (roundCost?.points_cost != null) {
    return LmsToNumber(roundCost.points_cost);
  }

  return LmsToNumber(info.current_draw_card_cost?.points_cost ?? info.draw_card_points_cost ?? 0);
};

export const lmsResolveDrawCardPointsProps = (info?: PlayerTournamentInformation | null) => {
  if (!info) return {};

  const usesTournamentPoints = lmsUsesTournamentPoints(info);
  const tournamentPoints = lmsResolveTournamentPoints(info);

  return {
    pointsCurrencyCode: usesTournamentPoints ? tournamentPoints.currencyCode : 'LMS',
    pointsBalance: usesTournamentPoints ? tournamentPoints.balance : undefined,
    drawCardPointsCost: lmsResolveDrawCardPointsCost(info)
  };
};

export const lmsUsesTournamentPoints = (info?: Pick<PlayerTournamentInformation, 'points_enabled'> | null): boolean => {
  return Boolean(info?.points_enabled);
};

export const lmsResolveLifelineRoundNo = (
  info?: PlayerTournamentInformation | null,
  summary?: PlayerTournamentSummary
): number | undefined => {
  if (!info) return undefined;

  const roundNo = info.current_lifeline_cost?.round_no ?? lmsResolveRoundNo(info, summary);
  return roundNo > 0 ? roundNo : undefined;
};

export const lmsIsLifelineEnabledForRound = (
  info?: PlayerTournamentInformation | null,
  summary?: PlayerTournamentSummary,
  roundNo?: number
): boolean => {
  if (!info?.lifeline_enabled) return false;

  const round = roundNo ?? lmsResolveLifelineRoundNo(info, summary);
  if (round == null) return false;

  return lmsIsLifelineRoundInCosts(info, round);
};

export const lmsCanShowLifelineForEliminatedPlayer = (
  info?: PlayerTournamentInformation | null,
  summary?: PlayerTournamentSummary
): boolean => {
  if (!lmsIsLifelineEnabledForRound(info, summary)) return false;
  if (info?.player_lifeline_eligible === false) return false;
  if (info?.current_round_lifeline_allowed === false) return false;

  return true;
};

export const lmsIsLifelineAvailableForPlayer = (
  info?: PlayerTournamentInformation | null,
  summary?: PlayerTournamentSummary,
  roundNo?: number
): boolean => {
  if (!lmsIsLifelineEnabledForRound(info, summary, roundNo)) return false;
  if (info?.player_lifeline_can_buy !== true) return false;

  return true;
};

export const lmsCanBuyLifeline = (
  info?: PlayerTournamentInformation | null,
  eligibility?: { lifeline_enabled?: boolean; can_buy?: boolean; round_no?: number } | null,
  roundNo?: number
): boolean => {
  const lifelineEnabled = eligibility?.lifeline_enabled ?? info?.lifeline_enabled;
  if (!lifelineEnabled) return false;

  const round = roundNo ?? eligibility?.round_no ?? (info ? lmsResolveRoundNo(info) : undefined);
  if (!lmsIsLifelineRoundInCosts(info, round)) return false;

  const canBuy = eligibility?.can_buy ?? info?.player_lifeline_can_buy;
  return canBuy === true;
};

export const lmsCanBuyDrawCard = (
  info?: Pick<
    PlayerTournamentInformation,
    'draw_card_enabled' | 'draw_card_allow_points_purchase' | 'player_draw_card_can_buy'
  > | null,
  drawCardState = 'NONE'
): boolean => {
  if (!info?.draw_card_enabled || !info.draw_card_allow_points_purchase || drawCardState !== 'NONE') {
    return false;
  }

  if (info.player_draw_card_can_buy === false) return false;

  return true;
};

export const LmsIsJoined = (playerState?: string): boolean => {
  return playerState === LMS_PLAYER_STATE_ACTIVE;
};

export const LmsToNumber = (value: string | number): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const lmsFormatUnixToIsoDate = (unixValue: string | number): string => {
  const seconds = LmsToNumber(unixValue);
  if (seconds <= 0) {
    return new Date().toISOString();
  }

  return new Date(seconds * 1000).toISOString();
};

export const lmsFormatCurrencyMinor = (minorValue: string | number, currency: string): string => {
  const amount = LmsToNumber(minorValue);

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
};

/** Entry fee UI: zero means free (not formatted as $0). */
export const lmsFormatEntryFeeMinor = (
  minorValue: string | number | undefined,
  currency: string,
  freeLabel = 'Free'
): string => {
  if (LmsToNumber(minorValue ?? 0) === 0) {
    return freeLabel;
  }
  return lmsFormatCurrencyMinor(minorValue ?? 0, currency);
};

export const lmsResolveTournamentCurrentRound = (
  info: PlayerTournamentInformation,
  summary?: PlayerTournamentSummary
): number => {
  return LmsToNumber(
    summary?.current_round ??
      info.current_lifeline_cost?.round_no ??
      info.active_round_count ??
      info.start_matchweek ??
      1
  );
};

export const lmsResolveRoundNo = (info: PlayerTournamentInformation, summary?: PlayerTournamentSummary): number => {
  if (info.player_state === LMS_PLAYER_STATE_ELIMINATED || info.player_state === LMS_PLAYER_STATE_REMOVED) {
    return LmsToNumber(info.player_current_round ?? summary?.current_round ?? info.start_matchweek ?? 1);
  }

  return LmsToNumber(
    info.player_current_round ?? summary?.current_round ?? info.active_round_count ?? info.start_matchweek ?? 1
  );
};

export const lmsIsWorldCupLifelineRoundWindowOpen = (
  info: PlayerTournamentInformation,
  summary?: PlayerTournamentSummary
): boolean => {
  const playerRound = LmsToNumber(info.player_current_round ?? 0);
  const tournamentRound = lmsResolveTournamentCurrentRound(info, summary);

  if (playerRound <= 0 || tournamentRound <= 0) return false;

  return Math.abs(tournamentRound - playerRound) < 2;
};

export const LMS_FIFA_WORLD_CUP_COMPETITION_NAME = 'FIFA World Cup';

export const lmsIsWorldCupTournament = (info: Pick<PlayerTournamentInformation, 'game_name'>): boolean => {
  return info.game_name === LMS_WORLD_CUP_TOURNAMENT_NAME;
};

export const lmsIsExpiredUnjoinedTournament = (
  info: Pick<PlayerTournamentInformation, 'first_deadline_unix' | 'player_state' | 'game_name'>,
  summary?: Pick<PlayerTournamentSummary, 'state'> | null
): boolean => {
  if (lmsIsWorldCupTournament(info)) return false;

  const hasJoined = Boolean(info.player_state || summary?.state);
  if (hasJoined) return false;

  const deadlineUnix = LmsToNumber(info.first_deadline_unix);
  return deadlineUnix > 0 && deadlineUnix <= Date.now() / 1000;
};

export const lmsIsFifaWorldCupCompetition = (
  standings?: Pick<PlayerTournamentStandings, 'competition_name'> | null
): boolean => {
  return standings?.competition_name === LMS_FIFA_WORLD_CUP_COMPETITION_NAME;
};

export const lmsGetStandingsGroups = (standings?: PlayerTournamentStandings | null) => {
  return standings?.tables?.find(table => table.type === 'total')?.groups ?? [];
};

export const lmsIsWorldCupGroupStandings = (
  standings?: PlayerTournamentStandings | null,
  info?: Pick<PlayerTournamentInformation, 'game_name' | 'competition_name'> | null
): boolean => {
  if (lmsIsFifaWorldCupCompetition(standings)) return true;
  if (info?.competition_name === LMS_FIFA_WORLD_CUP_COMPETITION_NAME) return true;
  if (info && lmsIsWorldCupTournament(info)) return true;
  return lmsGetStandingsGroups(standings).length > 1;
};

export const lmsIsWorldCupEliminatedWithLifeline = (
  info: PlayerTournamentInformation,
  summary?: PlayerTournamentSummary
): boolean => {
  if (!lmsIsWorldCupTournament(info)) return false;
  if (info.player_state !== LMS_PLAYER_STATE_ELIMINATED) return false;
  if (info.status === 'TOURNAMENT_STATUS_COMPLETED') return false;
  if (summary?.tournament_status === 'TOURNAMENT_STATUS_COMPLETED') return false;

  return info.lifeline_enabled === true && lmsIsWorldCupLifelineRoundWindowOpen(info, summary);
};

export const buildWorldCupEliminatedMatchDay = (
  info: PlayerTournamentInformation,
  summary?: PlayerTournamentSummary
): string => {
  const tournamentRound = lmsResolveTournamentCurrentRound(info, summary);
  const maxRounds = LmsToNumber(info.total_round_count ?? info.max_rounds ?? 0);

  if (maxRounds > 0) {
    return `Round ${tournamentRound}/${maxRounds}`;
  }

  return `Match day ${tournamentRound}`;
};

export const buildMatchDayLabel = (info: PlayerTournamentInformation, summary?: PlayerTournamentSummary): string => {
  const currentRound = lmsResolveRoundNo(info, summary);
  const maxRounds = LmsToNumber(info.total_round_count ?? info.max_rounds ?? 0);

  if (info.player_state === LMS_PLAYER_STATE_ELIMINATED) {
    return `Eliminated in round ${currentRound}`;
  }
  if (info.player_state === LMS_PLAYER_STATE_REMOVED) {
    return `Removed in round ${currentRound}`;
  }
  if (maxRounds > 0) {
    return `Round ${currentRound}/${maxRounds}`;
  }

  return `Match day ${currentRound}`;
};

export const lmsMapFormResultToDot = (result?: string): DotResultStatus => {
  if (result === 'WIN') return 'win';
  if (result === 'LOSS') return 'loss';
  return 'draw';
};

export const lmsGetFormDots = (results?: string[]): DotResultStatus[] => {
  if (!results?.length) return ['draw', 'draw', 'draw', 'draw'];
  return results.slice(0, 5).map(lmsMapFormResultToDot);
};

type LmsPickedTeamRound = NonNullable<PlayerTournamentInformation['picked_teams']>[number];

const lmsPickNeedsHomeAwaySwap = (pick?: LmsPickedTeamRound): boolean => {
  const side = (pick?.home_team_side ?? '').toUpperCase();
  return Boolean(side) && side !== 'TEAM';
};

export const lmsNormalizePickedTeamRowForFixtureDisplay = (row: LmsPickedTeamRound): LmsPickedTeamRound => {
  if (!lmsPickNeedsHomeAwaySwap(row)) return row;
  return {
    ...row,
    team_id: row.opponent_team_id ?? '',
    team_name: row.opponent_team_name ?? '',
    team_logo_url: row.opponent_team_logo_url,
    opponent_team_id: row.team_id,
    opponent_team_name: row.team_name ?? '',
    opponent_team_logo_url: row.team_logo_url,
    picked_team_last5_results: row.opponent_team_last5_results,
    opponent_team_last5_results: row.picked_team_last5_results,
    home_team_side: undefined
  };
};

export const lmsPickHasDisplayableScores = (pick?: LmsPickedTeamRound): boolean => {
  if (!pick || pick.home_score == null || pick.away_score == null) return false;

  const status = (pick.fixture_status || '').toUpperCase();
  if (status === 'NOT_STARTED') return false;

  return (
    status === 'LIVE' || status === 'CLOSED' || lmsIsFixtureFinished(pick.fixture_match_status, pick.fixture_result)
  );
};

export const lmsResolvePickScoreOrOdds = (pick: LmsPickedTeamRound | undefined, side: 'home' | 'away'): string => {
  if (!pick) return '--';

  if (lmsPickHasDisplayableScores(pick)) {
    const homeScore = String(pick.home_score ?? '--');
    const awayScore = String(pick.away_score ?? '--');
    // home_score/away_score are fixture home/away order; display teams are reordered
    // to match fixture sides when home_team_side is OPPONENT, so scores must not swap
    return side === 'home' ? homeScore : awayScore;
  }

  const fixtureOdds = pick.fixture_odds;
  if (!fixtureOdds) return '--';

  const homeOdds = lmsFormatDecimalOdds(fixtureOdds.home?.price_decimal);
  const awayOdds = lmsFormatDecimalOdds(fixtureOdds.away?.price_decimal);

  return side === 'home' ? homeOdds : awayOdds;
};

export type LmsFixtureStatus = 'NOT_STARTED' | 'LIVE' | 'CLOSED';
export type LmsPickWinStatus = 'WON' | 'LOST';

export const lmsNormalizeFixtureStatus = (status?: string): LmsFixtureStatus | undefined => {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'NOT_STARTED' || normalized === 'LIVE' || normalized === 'CLOSED') {
    return normalized as LmsFixtureStatus;
  }

  return undefined;
};

export const lmsCanChangePick = (fixtureStatus?: string): boolean => {
  return lmsNormalizeFixtureStatus(fixtureStatus) === 'NOT_STARTED';
};

export const lmsIsFixtureInPlayOrFinished = (fixtureStatus?: string): boolean => {
  const status = lmsNormalizeFixtureStatus(fixtureStatus);
  return status === 'LIVE' || status === 'CLOSED';
};

export const lmsIsPickOutcomeResolved = (winStatus?: LmsPickWinStatus): boolean => {
  return winStatus === 'WON' || winStatus === 'LOST';
};

export const lmsWinStatusFromPickMatchScores = (
  match: MatchPickData,
  isDrawCardActive?: boolean
): LmsPickWinStatus | undefined => {
  const home = Number(match.homeScore);
  const away = Number(match.awayScore);
  if (!Number.isFinite(home) || !Number.isFinite(away)) return undefined;

  if (home === away && isDrawCardActive) return 'WON';
  const pickedIsHome = match.homeId === 1;
  const pickedIsAway = match.awayId === 1;
  if (!pickedIsHome && !pickedIsAway) return undefined;
  if (home === away) return undefined;
  if (pickedIsHome) return home > away ? 'WON' : 'LOST';
  return away > home ? 'WON' : 'LOST';
};

export const lmsIsFixtureFinished = (fixtureMatchStatus?: string, fixtureResult?: string): boolean => {
  if (fixtureResult && fixtureResult.length > 0) return true;
  return (fixtureMatchStatus || '').toUpperCase().includes('ENDED');
};

export const lmsIsFixtureLocked = (fixture?: {
  starts_at_unix?: string | number;
  fixture_starts_at_unix?: string | number;
  status?: string;
  fixture_status?: string;
  match_status?: string;
  fixture_match_status?: string;
  result?: string;
  fixture_result?: string;
}): boolean => {
  const startsAtUnix = LmsToNumber(fixture?.starts_at_unix ?? fixture?.fixture_starts_at_unix ?? 0);
  const status = String(fixture?.status || fixture?.fixture_status || '').toUpperCase();
  const matchStatus = String(fixture?.match_status || fixture?.fixture_match_status || '').toUpperCase();
  const result = String(fixture?.result || fixture?.fixture_result || '').toUpperCase();
  const isFinalResult = result.length > 0 && result !== 'PENDING';
  const hasStarted = startsAtUnix > 0 && startsAtUnix <= Date.now() / 1000;
  const isUnavailableStatus = ['POSTPONED', 'CANCELLED', 'CANCELED', 'SUSPENDED'].some(value => status.includes(value));

  return (
    isUnavailableStatus || hasStarted || matchStatus.includes('ENDED') || matchStatus.includes('LIVE') || isFinalResult
  );
};

const buildEliminatedMatch = (info: PlayerTournamentInformation): MatchPickData => {
  const latestPick = [...(info.picked_teams || [])].sort((a, b) => b.round_no - a.round_no)[0];
  const matchTime = lmsFormatUnixToIsoDate(
    info.awaiting_round_deadline_unix ||
      latestPick?.fixture_starts_at_unix ||
      info.completed_at_unix ||
      info.updated_at_unix ||
      info.first_deadline_unix
  );
  const swap = lmsPickNeedsHomeAwaySwap(latestPick);
  const homeScore = lmsResolvePickScoreOrOdds(latestPick, 'home');
  const awayScore = lmsResolvePickScoreOrOdds(latestPick, 'away');

  if (swap && latestPick) {
    return {
      homeId: (latestPick.opponent_team_id as unknown as number) || 2,
      homeTeam: latestPick.opponent_team_name || 'Opponent',
      awayId: (latestPick.team_id as unknown as number) || 1,
      awayTeam: latestPick.team_name || 'No pick',
      homeLogo: latestPick.opponent_team_logo_url,
      awayLogo: latestPick.team_logo_url,
      homeScore,
      awayScore,
      homeStatus: 'available',
      awayStatus: 'available',
      homeResultDots: lmsGetFormDots(latestPick.opponent_team_last5_results),
      awayResultDots: lmsGetFormDots(latestPick.picked_team_last5_results),
      time: matchTime,
      result: latestPick.fixture_result || latestPick.head_to_head_result || info.elimination_reason || 'Eliminated',
      status: 'finished',
      fixtureStatus: latestPick?.fixture_status as 'NOT_STARTED' | 'LIVE' | 'CLOSED'
    };
  }

  return {
    homeId: (latestPick?.team_id as unknown as number) || 1,
    homeTeam: latestPick?.team_name || 'No pick',
    awayId: (latestPick?.opponent_team_id as unknown as number) || 2,
    awayTeam: latestPick?.opponent_team_name || 'Opponent',
    homeLogo: latestPick?.team_logo_url,
    awayLogo: latestPick?.opponent_team_logo_url,
    homeScore,
    awayScore,
    homeStatus: 'available',
    awayStatus: 'available',
    homeResultDots: lmsGetFormDots(latestPick?.picked_team_last5_results),
    awayResultDots: lmsGetFormDots(latestPick?.opponent_team_last5_results),
    time: matchTime,
    result: latestPick?.fixture_result || latestPick?.head_to_head_result || info.elimination_reason || 'Eliminated',
    status: 'finished',
    fixtureStatus: latestPick?.fixture_status as 'NOT_STARTED' | 'LIVE' | 'CLOSED'
  };
};

export const lmsBuildCurrentPickMatch = (info: PlayerTournamentInformation, currentRound: number): MatchPickData => {
  const currentRoundPick = info.picked_teams?.find(pick => pick.round_no === currentRound);
  const isFinished = lmsIsFixtureFinished(currentRoundPick?.fixture_match_status, currentRoundPick?.fixture_result);
  const swap = lmsPickNeedsHomeAwaySwap(currentRoundPick);
  const homeScore = lmsResolvePickScoreOrOdds(currentRoundPick, 'home');
  const awayScore = lmsResolvePickScoreOrOdds(currentRoundPick, 'away');

  const base = {
    homeScore,
    awayScore,
    homeStatus: isFinished ? 'available' : 'available',
    awayStatus: isFinished ? 'available' : 'available',
    time: lmsFormatUnixToIsoDate(currentRoundPick?.fixture_starts_at_unix || info.first_deadline_unix),
    result: currentRoundPick?.fixture_result || currentRoundPick?.head_to_head_result,
    status: isFinished ? 'finished' : 'unavailable',
    fixtureStatus: currentRoundPick?.fixture_status as 'NOT_STARTED' | 'LIVE' | 'CLOSED'
  } satisfies Pick<
    MatchPickData,
    'homeScore' | 'awayScore' | 'homeStatus' | 'awayStatus' | 'time' | 'result' | 'status' | 'fixtureStatus'
  >;

  if (swap && currentRoundPick) {
    return {
      ...base,
      homeId: 2,
      homeTeam: currentRoundPick.opponent_team_name || 'Opponent',
      awayId: 1,
      awayTeam: currentRoundPick.team_name || 'Selected Team',
      homeLogo: currentRoundPick.opponent_team_logo_url,
      awayLogo: currentRoundPick.team_logo_url,
      homeResultDots: lmsGetFormDots(currentRoundPick.opponent_team_last5_results),
      awayResultDots: lmsGetFormDots(currentRoundPick.picked_team_last5_results)
    };
  }

  return {
    ...base,
    homeId: 1,
    homeTeam: currentRoundPick?.team_name || 'Selected Team',
    awayId: 2,
    awayTeam: currentRoundPick?.opponent_team_name || 'Opponent',
    homeLogo: currentRoundPick?.team_logo_url,
    awayLogo: currentRoundPick?.opponent_team_logo_url,
    homeResultDots: lmsGetFormDots(currentRoundPick?.picked_team_last5_results),
    awayResultDots: lmsGetFormDots(currentRoundPick?.opponent_team_last5_results)
  };
};

export const lmsResolveCurrentPickWinStatus = (
  info: PlayerTournamentInformation | undefined,
  roundNo?: number
): LmsPickWinStatus | undefined => {
  if (!info) return undefined;

  const currentRound = roundNo ?? lmsResolveRoundNo(info);
  const pick = info.picked_teams?.find(p => p.round_no === currentRound);
  if (!pick || lmsNormalizeFixtureStatus(pick.fixture_status) === 'NOT_STARTED') return undefined;

  const match = lmsBuildCurrentPickMatch(info, currentRound);
  return lmsWinStatusFromPickMatchScores(match, info.player_draw_card_state === LMS_DRAW_CARD_STATE_ACTIVE);
};

export const lmsIsGamePickable = (info?: Pick<PlayerTournamentInformation, 'is_game_start'> | null): boolean => {
  return info?.is_game_start !== false;
};

export const lmsResolveFixtureSeedStatus = (
  info: PlayerTournamentInformation
): 'SEEDED' | 'UNSEEDED' | 'PARTIALLYSEEDED' => {
  if (!lmsIsGamePickable(info)) return 'UNSEEDED';

  return info.fixture_seed_status as 'SEEDED' | 'UNSEEDED' | 'PARTIALLYSEEDED';
};

export const lmsMapToTournamentCardData = (
  summary: PlayerTournamentSummary,
  info: PlayerTournamentInformation,
  winnerName?: string,
  isAuthenticated?: boolean
): TournamentCardData => {
  const hasEntriesClosed =
    LmsToNumber(info.first_deadline_unix) > 0 && LmsToNumber(info.first_deadline_unix) <= Date.now() / 1000;
  const showRemainingParticipants =
    summary.tournament_status === 'TOURNAMENT_STATUS_COMPLETED' ||
    info.status === 'TOURNAMENT_STATUS_COMPLETED' ||
    hasEntriesClosed;

  const commonData = {
    id: info.id,
    name: info.game_name,
    prize: lmsFormatCurrencyMinor(info.prize_amount_minor, info.prize_currency),
    entryFee: lmsFormatEntryFeeMinor(info.entry_fee_amount_minor, info.entry_fee_currency),
    sport: 'Football',
    league: info.competition_name,
    participants: LmsToNumber(info.total_players),
    remainingParticipants: LmsToNumber(info.active_players),
    showRemainingParticipants,
    imageUrl: info.image_url || LMS_DEFAULT_TOURNAMENT_IMAGE,
    teamImageUrl: info.competition_image || LMS_DEFAULT_TEAM_IMAGE,
    roundNo: info.player_current_round,
    seededRoundsCount: info.seeded_rounds_count,
    status: info.status,
    fixtureSeedStatus: lmsResolveFixtureSeedStatus(info)
  } satisfies TournamentBase;

  const matchDay = buildMatchDayLabel(info, summary);
  const currentRound = lmsResolveRoundNo(info, summary);
  const hasPickForCurrentRound = Boolean(info.picked_teams?.some(pick => pick.round_no === currentRound));
  const hasJoinedTournament = Boolean(info.player_state || summary.state);

  const matchTime =
    info?.player_state === LMS_PLAYER_STATE_ACTIVE
      ? (info?.awaiting_round_deadline_unix ?? info.first_deadline_unix)
      : (info?.join_until_unix ?? info?.first_deadline_unix);
  const drawCardPointsProps = info.draw_card_enabled ? lmsResolveDrawCardPointsProps(info) : {};
  if (!isAuthenticated) {
    return {
      ...commonData,
      type: 'join',
      cutOfTime: lmsFormatUnixToIsoDate(matchTime),
      isDisabled: true
    };
  }

  if (info.player_state === LMS_PLAYER_STATE_ELIMINATED || info.player_state === LMS_PLAYER_STATE_REMOVED) {
    if (lmsIsWorldCupEliminatedWithLifeline(info, summary)) {
      const lifelineRoundNo = lmsResolveLifelineRoundNo(info, summary);
      const cutOffUnix =
        info.awaiting_round_deadline_unix ?? info.first_deadline_unix ?? info.updated_at_unix ?? info.created_at_unix;

      return {
        ...commonData,
        type: 'eliminated_world_cup',
        matchDay: buildWorldCupEliminatedMatchDay(info, summary),
        cutOfTime: lmsFormatUnixToIsoDate(cutOffUnix),
        roundNo: lmsResolveTournamentCurrentRound(info, summary),
        lifelineEnabled: lmsCanShowLifelineForEliminatedPlayer(info, summary),
        lifelineCanBuy: info.player_lifeline_can_buy === true,
        lifelineUnavailableReason: info.player_lifeline_unavailable_reason,
        ...(() => {
          const points = lmsResolveTournamentPoints(info);
          return {
            pointsName: points.name,
            pointsCurrencyCode: points.currencyCode,
            pointsBalance: points.balance,
            lifelinePointsCost: lmsResolveLifelinePointsCost(info, lifelineRoundNo)
          };
        })()
      };
    }

    return {
      ...commonData,
      type: 'eliminated',
      matchDay,
      match: buildEliminatedMatch(info),
      eliminationReason: info.elimination_reason
    };
  }

  const hasReachedFinalRound = currentRound >= LmsToNumber(info.max_rounds) && LmsToNumber(info.max_rounds) > 0;
  const isCompletedWinner =
    summary.tournament_status === 'TOURNAMENT_STATUS_COMPLETED' &&
    info.status === 'TOURNAMENT_STATUS_COMPLETED' &&
    info.player_state === LMS_PLAYER_STATE_ACTIVE &&
    hasReachedFinalRound;

  if (isCompletedWinner) {
    return {
      ...commonData,
      type: 'winner',
      winnerName: winnerName || 'You'
    };
  }

  if (!hasJoinedTournament) {
    return {
      ...commonData,
      type: 'join',
      cutOfTime: lmsFormatUnixToIsoDate(matchTime)
    };
  }

  if (!lmsIsGamePickable(info)) {
    return {
      ...commonData,
      type: 'pick_team',
      match: lmsBuildCurrentPickMatch(info, currentRound),
      pickedTeams: info.picked_teams || [],
      playerCurrentRound: info.player_current_round ?? null,
      matchDay,
      cutOfTime: lmsFormatUnixToIsoDate(matchTime),
      isDrawCardAvailable: info.draw_card_enabled,
      isDrawCardActive: info.player_draw_card_state === LMS_DRAW_CARD_STATE_ACTIVE,
      drawCardState: info.player_draw_card_state,
      ...drawCardPointsProps
    };
  }

  if (
    summary.tournament_status === 'TOURNAMENT_STATUS_ACTIVE' ||
    summary.tournament_status === 'TOURNAMENT_STATUS_UPCOMING'
  ) {
    if (hasPickForCurrentRound) {
      return {
        ...commonData,
        type: 'bet_not_made',
        matchDay,
        cutOfTime: lmsFormatUnixToIsoDate(matchTime),
        isDrawCardAvailable: info.draw_card_enabled,
        isDrawCardActive: info.player_draw_card_state === LMS_DRAW_CARD_STATE_ACTIVE,
        drawCardState: info.player_draw_card_state,
        ...drawCardPointsProps,
        match: lmsBuildCurrentPickMatch(info, currentRound)
      };
    }

    return {
      ...commonData,
      type: 'pick_team',
      match: lmsBuildCurrentPickMatch(info, currentRound),
      pickedTeams: info.picked_teams || [],
      playerCurrentRound: info.player_current_round ?? null,
      matchDay,
      cutOfTime: lmsFormatUnixToIsoDate(matchTime),
      isDrawCardAvailable: info.draw_card_enabled,
      isDrawCardActive: info.player_draw_card_state === LMS_DRAW_CARD_STATE_ACTIVE,
      drawCardState: info.player_draw_card_state,
      ...drawCardPointsProps
    };
  }

  if (summary.tournament_status === 'TOURNAMENT_STATUS_UPCOMING') {
    if (hasPickForCurrentRound) {
      return {
        ...commonData,
        type: 'bet_not_made',
        matchDay,
        cutOfTime: lmsFormatUnixToIsoDate(matchTime),
        isDrawCardAvailable: info.draw_card_enabled,
        isDrawCardActive: info.player_draw_card_state === LMS_DRAW_CARD_STATE_ACTIVE,
        drawCardState: info.player_draw_card_state,
        ...drawCardPointsProps,
        match: lmsBuildCurrentPickMatch(info, currentRound)
      };
    }

    return {
      ...commonData,
      type: 'join',
      cutOfTime: lmsFormatUnixToIsoDate(matchTime)
    };
  }

  return {
    ...commonData,
    type: 'join',
    cutOfTime: lmsFormatUnixToIsoDate(matchTime)
  };
};

export const lmsMapFormToDots = (results?: string[]): DotResultStatus[] => {
  if (!results?.length) return ['draw', 'draw', 'draw', 'draw'];
  return results.slice(0, 5).map(result => {
    if (result === 'WIN') return 'win';
    if (result === 'LOSS') return 'loss';
    return 'draw';
  });
};

export const lmsFormatKickoffTime = (unixValue?: string | number): string => {
  if (!unixValue) return '--:--';
  const numeric = Number(unixValue);
  if (!Number.isFinite(numeric) || numeric <= 0) return '--:--';
  return new Date(numeric * 1000).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export type LmsMapFixtureOptions = {
  alwaysShowOddsInBoxes?: boolean;
  roundNo?: number;
  pickedTeams?: PlayerTournamentInformation['picked_teams'];
};

const lmsFixtureHasPickOdds = (
  fixtureOdds?: { home?: { price_decimal?: string }; away?: { price_decimal?: string } } | null
): boolean => Boolean(fixtureOdds?.home?.price_decimal || fixtureOdds?.away?.price_decimal);

export const lmsEnrichFixtureWithPickOdds = <
  T extends {
    id?: string;
    external_fixture_id?: string;
    home_team_id?: string;
    away_team_id?: string;
    fixture_odds?: unknown;
  }
>(
  fixture: T,
  roundNo: number | undefined,
  picks?: PlayerTournamentInformation['picked_teams']
): T => {
  if (
    lmsFixtureHasPickOdds(
      fixture.fixture_odds as { home?: { price_decimal?: string }; away?: { price_decimal?: string } } | null
    )
  ) {
    return fixture;
  }
  if (!picks?.length || roundNo == null) return fixture;

  const pick = picks.find(
    p =>
      p.round_no === roundNo &&
      (String(p.fixture_id) === String(fixture.id) ||
        (p.fixture_external_id &&
          fixture.external_fixture_id &&
          String(p.fixture_external_id) === String(fixture.external_fixture_id)) ||
        String(p.team_id) === String(fixture.home_team_id) ||
        String(p.team_id) === String(fixture.away_team_id) ||
        String(p.opponent_team_id) === String(fixture.home_team_id) ||
        String(p.opponent_team_id) === String(fixture.away_team_id))
  );

  if (!pick?.fixture_odds) return fixture;

  return { ...fixture, fixture_odds: pick.fixture_odds };
};

export const lmsMapFixtureToMatch = (
  fixture: any,
  idx: number,
  previousPicks?: PlayerTournamentInformation['picked_teams'],
  options?: LmsMapFixtureOptions
): SelectGameMatch => {
  const enrichedFixture = lmsEnrichFixtureWithPickOdds(fixture, options?.roundNo, [
    ...(options?.pickedTeams || []),
    ...(previousPicks || [])
  ]);
  const fixtureStatus = (enrichedFixture?.status || '').toUpperCase();
  const hasScore =
    fixtureStatus !== 'NOT_STARTED' && Boolean(enrichedFixture?.has_home_score || enrichedFixture?.has_away_score);
  const alwaysShowOddsInBoxes = Boolean(options?.alwaysShowOddsInBoxes);
  const isUnavailableHome = previousPicks?.some(pick => pick?.team_id === enrichedFixture?.home_team_id);
  const isUnavailableAway = previousPicks?.some(pick => pick?.team_id === enrichedFixture?.away_team_id);
  const selectedFixtureLocked = lmsIsFixtureLocked(enrichedFixture);
  const fixtureOdds = enrichedFixture?.fixture_odds;
  const formattedHomeOdds = lmsFormatDecimalOdds(fixtureOdds?.home?.price_decimal);
  const formattedDrawOdds = fixtureOdds?.draw?.price_decimal
    ? lmsFormatDecimalOdds(fixtureOdds.draw.price_decimal, '')
    : '';
  const formattedAwayOdds = lmsFormatDecimalOdds(fixtureOdds?.away?.price_decimal);
  const scoreHome = hasScore ? String(enrichedFixture?.home_score ?? '-') : undefined;
  const scoreAway = hasScore ? String(enrichedFixture?.away_score ?? '-') : undefined;

  return {
    id: Number(enrichedFixture?.id || idx + 1),
    homeTeam: enrichedFixture?.home_team_name || enrichedFixture?.home_team?.team_name || '-',
    awayTeam: enrichedFixture?.away_team_name || enrichedFixture?.away_team?.team_name || '-',
    homeLogo: enrichedFixture?.home_team_logo_url || enrichedFixture?.home_team?.team_logo_url,
    awayLogo: enrichedFixture?.away_team_logo_url || enrichedFixture?.away_team?.team_logo_url,
    isPlayerSelected: Boolean(enrichedFixture?.is_player_selected),
    homeOdds: alwaysShowOddsInBoxes ? formattedHomeOdds : hasScore ? scoreHome || '-' : formattedHomeOdds,
    awayOdds: alwaysShowOddsInBoxes ? formattedAwayOdds : hasScore ? scoreAway || '-' : formattedAwayOdds,
    drawOdds: alwaysShowOddsInBoxes || !hasScore ? formattedDrawOdds : undefined,
    oddsBookmaker: fixtureOdds?.bookmaker_title || fixtureOdds?.bookmaker_key,
    scoreHome,
    scoreAway,
    kickoffTime: lmsFormatKickoffTime(enrichedFixture?.starts_at_unix),
    homeStatus: isUnavailableHome || selectedFixtureLocked ? 'unavailable' : 'available',
    awayStatus: isUnavailableAway || selectedFixtureLocked ? 'unavailable' : 'available',
    homeResultDots: lmsMapFormToDots(
      enrichedFixture?.home_team_last5_results || enrichedFixture?.home_team?.last5_results
    ),
    awayResultDots: lmsMapFormToDots(
      enrichedFixture?.away_team_last5_results || enrichedFixture?.away_team?.last5_results
    )
  };
};

export const lmsMapActiveRoundResponseToSelectData = (
  response: PlayerActiveRoundFixturesResponse,
  options?: LmsMapFixtureOptions
): SelectGameData => {
  const roundNo = options?.roundNo ?? response?.selected_round_no ?? response?.active_round_no;
  const mapOptions: LmsMapFixtureOptions = { ...options, roundNo };
  const mapFixtures = (fixtures: PlayerActiveRoundFixturesResponse['fixtures']) =>
    (fixtures || []).map((fixture, idx) => lmsMapFixtureToMatch(fixture, idx, response?.previous_picks, mapOptions));

  let dayGroups = (response?.day_groups || [])
    .map(group => ({
      date: group?.date || '',
      matches: mapFixtures(group?.fixtures)
    }))
    .filter(group => group.matches.length > 0);

  if (dayGroups.length === 0 && (response?.fixtures?.length ?? 0) > 0) {
    dayGroups = [
      {
        date: '',
        matches: mapFixtures(response.fixtures)
      }
    ];
  }

  return {
    tournamentName: '',
    matchDay: `Round ${response?.selected_round_no ?? response?.active_round_no ?? 1}`,
    totalRounds: response?.total_round_count ?? 0,
    currentRound: response?.selected_round_no ?? response?.active_round_no,
    dateGroups: dayGroups
  };
};

const mapResultToDot = (result?: string): DotResultStatus => {
  if (result === 'WIN') return 'win';
  if (result === 'LOSS') return 'loss';
  return 'draw';
};

export const mapResultsToDots = (results?: string[]): DotResultStatus[] => {
  if (!results?.length) return ['draw', 'draw', 'draw', 'draw'];
  return results.slice(0, 5).map(mapResultToDot);
};

export const mapRoundPickToMatchPick = (
  pick: NonNullable<NonNullable<PlayerTournamentInformation['picked_teams']>[number]>
): MatchPickData => {
  const side = (pick.home_team_side ?? '').toUpperCase();
  const swapForFixtureSides = Boolean(side) && side !== 'TEAM';

  const base = {
    homeScore: lmsResolvePickScoreOrOdds(pick, 'home'),
    awayScore: lmsResolvePickScoreOrOdds(pick, 'away'),
    homeStatus: pick.fixture_status as MatchPickData['homeStatus'],
    awayStatus: pick.fixture_status as MatchPickData['awayStatus'],
    time: lmsFormatUnixToIsoDate(Number(pick.fixture_starts_at_unix) || 0),
    result: pick.fixture_result,
    status: pick.fixture_match_status as MatchPickData['status'],
    fixtureStatus: pick.fixture_status as 'NOT_STARTED' | 'LIVE' | 'CLOSED'
  };

  if (swapForFixtureSides) {
    return {
      ...base,
      homeId: pick.opponent_team_id as unknown as number,
      homeTeam: pick.opponent_team_name ?? '',
      awayId: pick.team_id as unknown as number,
      awayTeam: pick.team_name ?? '',
      homeResultDots: mapResultsToDots(pick.opponent_team_last5_results),
      awayResultDots: mapResultsToDots(pick.picked_team_last5_results),
      homeLogo: pick.opponent_team_logo_url,
      awayLogo: pick.team_logo_url
    };
  }

  return {
    ...base,
    homeId: pick.team_id as unknown as number,
    homeTeam: pick.team_name ?? '',
    awayId: pick.opponent_team_id as unknown as number,
    awayTeam: pick.opponent_team_name ?? '',
    homeResultDots: mapResultsToDots(pick.picked_team_last5_results),
    awayResultDots: mapResultsToDots(pick.opponent_team_last5_results),
    homeLogo: pick.team_logo_url,
    awayLogo: pick.opponent_team_logo_url
  };
};
