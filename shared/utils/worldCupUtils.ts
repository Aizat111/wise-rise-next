import { GalleryImage } from '../../core/types/galleries.types';
import { WORLD_CUP_COMPETITION_LABEL } from '../../screens/world-cup/worldCup.config';
import {
  DRAW_TABS,
  type DrawMatch,
  type DrawRound,
  type Match,
  type MatchGroup,
  type MatchOdd,
  type StandingRow,
  type Team
} from '../../screens/world-cup/worldCup.data';

import { LmsToNumber, lmsGetStandingsGroups } from '@/core/lib/lmsUtls';
import type {
  LadderEntry,
  PlayerActiveRoundFixturesResponse,
  PlayerFixtureView,
  PlayerTournamentInformation,
  PlayerTournamentStandings
} from '@/core/types/lms.types';
import type {
  SeasonSportsbookFixtureEntry,
  SeasonSportsbookOverview,
  SeasonSportsbookStandingsEntry
} from '@/core/types/seasonSportsbook.types';
import { formatDateToWeekdayOrdinalMonth } from '@/shared/utils/dateTimeUtils';

const DEFAULT_TEAM_IMAGE = '/assets/images/team.png';
const DEFAULT_LEAGUE_LABEL = WORLD_CUP_COMPETITION_LABEL;

const isSportradarResourceId = (value?: string): boolean => /^sr:/i.test(String(value ?? '').trim());

export const resolveSeasonSportsbookLeagueLabel = (
  overview?: SeasonSportsbookOverview | null,
  fallback = DEFAULT_LEAGUE_LABEL
): string => {
  const competitionName = overview?.competition_name?.trim();
  if (competitionName && !isSportradarResourceId(competitionName)) {
    return competitionName;
  }

  const seasonName = overview?.season_name?.trim();
  if (seasonName && !isSportradarResourceId(seasonName)) {
    return seasonName;
  }

  return fallback;
};

export type WorldCupMatchesViewMode = 'date' | 'group';

export type WorldCupRoundOption = {
  roundNo: number;
  label: string;
};

export type WorldCupMatchesViewModel = {
  roundOptions: WorldCupRoundOption[];
  matchGroups: MatchGroup[];
  leagueName: string;
  defaultRoundNo: number;
};

export type WorldCupNextMatchView = {
  team1: Team;
  team2: Team;
  kickoffLabel: string;
  matchInfo: string;
  kickoffUnix: number;
};

export type WorldCupKickoffCountdownLabels = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

export type WorldCupCountdownCell = {
  value: string;
  label: string;
};

type StandingsGroup = NonNullable<NonNullable<PlayerTournamentStandings['tables']>[number]['groups']>[number];

export const formatWorldCupGroupLabel = (group: StandingsGroup): string => {
  const raw = String(group.group_name || group.name || group.id || '').trim();
  if (!raw) return 'Group';
  if (/^group\s/i.test(raw)) return raw;
  return `Group ${raw}`;
};

export const buildWorldCupTeamGroupLookup = (standings?: PlayerTournamentStandings | null): Map<string, string> => {
  const lookup = new Map<string, string>();

  for (const group of lmsGetStandingsGroups(standings)) {
    const label = formatWorldCupGroupLabel(group);
    for (const entry of group.entries ?? []) {
      if (entry.team_id) {
        lookup.set(entry.team_id, label);
      }
    }
  }

  return lookup;
};

export type WorldCupStandingsGroupOption = {
  id: string;
  label: string;
};

export const buildWorldCupStandingsGroupOptions = (
  standings?: PlayerTournamentStandings | null
): WorldCupStandingsGroupOption[] =>
  [...lmsGetStandingsGroups(standings)]
    .sort((left, right) =>
      formatWorldCupGroupLabel(left).localeCompare(formatWorldCupGroupLabel(right), undefined, { numeric: true })
    )
    .map(group => ({
      id: group.id || formatWorldCupGroupLabel(group),
      label: formatWorldCupGroupLabel(group)
    }));

export const mapLadderEntryToStandingRow = (entry: LadderEntry): StandingRow => ({
  rank: LmsToNumber(entry.rank ?? 0),
  team: {
    name: entry.team_name || '-',
    flagSrc: entry.team_image || DEFAULT_TEAM_IMAGE
  },
  played: LmsToNumber(entry.played ?? 0),
  wins: LmsToNumber(entry.wins ?? 0),
  draws: LmsToNumber(entry.draws ?? 0),
  losses: LmsToNumber(entry.losses ?? 0),
  points: LmsToNumber(entry.points ?? 0)
});

export const mapStandingsGroupToRows = (entries?: LadderEntry[]): StandingRow[] =>
  (entries ?? [])
    .slice()
    .sort((left, right) => LmsToNumber(left.rank ?? 0) - LmsToNumber(right.rank ?? 0))
    .map(mapLadderEntryToStandingRow);

export const formatWorldCupRoundLabel = (roundNo: number): string => `Round ${roundNo}`;

export const buildWorldCupRoundOptions = (
  info?: PlayerTournamentInformation | null,
  fixtures?: PlayerActiveRoundFixturesResponse | null
): WorldCupRoundOption[] => {
  const totalRounds = LmsToNumber(fixtures?.total_round_count ?? info?.total_round_count ?? info?.max_rounds ?? 0);
  const currentRound = LmsToNumber(
    fixtures?.current_round_no ?? fixtures?.selected_round_no ?? info?.player_current_round ?? 1
  );
  const roundCount = Math.max(totalRounds, currentRound, 1);

  return Array.from({ length: roundCount }, (_, index) => {
    const roundNo = index + 1;
    return { roundNo, label: formatWorldCupRoundLabel(roundNo) };
  });
};

export const resolveWorldCupDefaultRoundNo = (
  fixtures?: PlayerActiveRoundFixturesResponse | null,
  info?: PlayerTournamentInformation | null
): number => {
  return LmsToNumber(
    fixtures?.current_round_no ??
      fixtures?.selected_round_no ??
      fixtures?.active_round_no ??
      info?.player_current_round ??
      info?.active_round_count ??
      1
  );
};

const mapFixtureTeam = (name: string, logoUrl?: string): Team => ({
  name: name || '-',
  flagSrc: logoUrl || DEFAULT_TEAM_IMAGE
});

const unixToLocalDate = (unixValue?: string | number): Date | null => {
  const seconds = LmsToNumber(unixValue ?? 0);
  if (seconds <= 0) return null;
  return new Date(seconds * 1000);
};

/** Local calendar day key (YYYY-MM-DD) from kickoff unix — used for date headers and grouping. */
export const getWorldCupFixtureLocalDateKey = (unixValue?: string | number): string | null => {
  const date = unixToLocalDate(unixValue);
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** e.g. "June 12 at 1:00 AM" — same local timezone as date group headers. */
export const formatWorldCupMatchDatetime = (unixValue?: string | number): string => {
  const date = unixToLocalDate(unixValue);
  if (!date) return '';

  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = date.getDate();
  const time = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return `${month} ${day} at ${time}`;
};

export const formatFixtureOddValue = (price?: string): string => (price ? Number(price).toFixed(2).toString() : '--');

const buildFixtureOdds = (
  fixture: PlayerFixtureView,
  homeName: string,
  awayName: string
): [MatchOdd, MatchOdd, MatchOdd] => {
  const fixtureOdds = fixture.fixture_odds;

  return [
    {
      label: fixtureOdds?.home?.team_name || homeName,
      value: formatFixtureOddValue(fixtureOdds?.home?.price_decimal)
    },
    { label: 'Draw', value: formatFixtureOddValue(fixtureOdds?.draw?.price_decimal) },
    {
      label: fixtureOdds?.away?.team_name || awayName,
      value: formatFixtureOddValue(fixtureOdds?.away?.price_decimal)
    }
  ];
};

export const mapFixtureToWorldCupMatch = (fixture: PlayerFixtureView, leagueName: string): Match => {
  const homeName = fixture.home_team_name || fixture.home_team?.team_name || '-';
  const awayName = fixture.away_team_name || fixture.away_team?.team_name || '-';

  return {
    id: String(fixture.id),
    league: leagueName,
    datetime: formatWorldCupMatchDatetime(fixture.starts_at_unix),
    team1: mapFixtureTeam(homeName, fixture.home_team_logo_url || fixture.home_team?.team_logo_url),
    team2: mapFixtureTeam(awayName, fixture.away_team_logo_url || fixture.away_team?.team_logo_url),
    odds: buildFixtureOdds(fixture, homeName, awayName)
  };
};

const resolveFixtureGroupKey = (fixture: PlayerFixtureView, teamGroupLookup: Map<string, string>): string => {
  const homeGroup = teamGroupLookup.get(fixture.home_team_id ?? '');
  const awayGroup = teamGroupLookup.get(fixture.away_team_id ?? '');

  if (homeGroup && awayGroup) {
    return homeGroup === awayGroup ? homeGroup : homeGroup;
  }

  return homeGroup ?? awayGroup ?? 'Other';
};

const groupMatches = (
  fixtures: PlayerFixtureView[],
  resolveGroupKey: (_fixture: PlayerFixtureView) => string,
  leagueName: string
): MatchGroup[] => {
  const grouped = new Map<string, Match[]>();

  for (const fixture of fixtures) {
    const key = resolveGroupKey(fixture);
    const matches = grouped.get(key) ?? [];
    matches.push(mapFixtureToWorldCupMatch(fixture, leagueName));
    grouped.set(key, matches);
  }

  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
    .map(([label, matches]) => ({
      id: label.toLowerCase().replace(/\s+/g, '-'),
      label,
      matches
    }));
};

export const collectWorldCupFixtures = (response?: PlayerActiveRoundFixturesResponse | null): PlayerFixtureView[] => {
  if (!response) return [];

  const fromDayGroups = (response.day_groups ?? []).flatMap(group => group.fixtures ?? []);
  if (fromDayGroups.length > 0) return fromDayGroups;

  return response.fixtures ?? [];
};

const isWorldCupFixtureTerminal = (fixture: PlayerFixtureView): boolean => {
  const status = String(fixture.status || fixture.match_status || '').toUpperCase();
  return status === 'CLOSED' || status === 'FINISHED' || status === 'CANCELLED';
};

/** True when kickoff is in the future and the fixture is not terminal. */
export const isWorldCupFixtureUpcoming = (fixture: PlayerFixtureView, nowMs = Date.now()): boolean => {
  const kickoffMs = LmsToNumber(fixture.starts_at_unix) * 1000;
  if (kickoffMs <= 0) return false;
  if (isWorldCupFixtureTerminal(fixture)) return false;
  return kickoffMs > nowMs;
};

/** Earliest upcoming fixture by kickoff time, or null when none remain. */
export const findNextWorldCupFixture = (
  fixtures: PlayerFixtureView[],
  nowMs = Date.now()
): PlayerFixtureView | null => {
  const upcoming = fixtures
    .filter(fixture => isWorldCupFixtureUpcoming(fixture, nowMs))
    .sort((left, right) => LmsToNumber(left.starts_at_unix) - LmsToNumber(right.starts_at_unix));

  return upcoming[0] ?? null;
};

export const buildWorldCupNextMatchView = (
  fixture: PlayerFixtureView,
  standings: PlayerTournamentStandings | null | undefined,
  leagueName: string
): WorldCupNextMatchView => {
  const mapped = mapFixtureToWorldCupMatch(fixture, leagueName);
  const teamGroupLookup = buildWorldCupTeamGroupLookup(standings);
  const groupLabel = resolveFixtureGroupKey(fixture, teamGroupLookup);
  const competition = fixture.competition || leagueName;
  const matchInfo = groupLabel !== 'Other' ? `${groupLabel} · ${competition}` : competition;

  return {
    team1: mapped.team1,
    team2: mapped.team2,
    kickoffLabel: formatWorldCupMatchDatetime(fixture.starts_at_unix),
    matchInfo,
    kickoffUnix: LmsToNumber(fixture.starts_at_unix)
  };
};

const padCountdownPart = (value: number): string => String(value).padStart(2, '0');

export const buildWorldCupKickoffCountdownCells = (
  kickoffUnix: number,
  labels: WorldCupKickoffCountdownLabels,
  nowMs = Date.now()
): WorldCupCountdownCell[] => {
  const remainingMs = Math.max(0, kickoffUnix * 1000 - nowMs);
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    { value: padCountdownPart(days), label: labels.days },
    { value: padCountdownPart(hours), label: labels.hours },
    { value: padCountdownPart(minutes), label: labels.minutes },
    { value: padCountdownPart(seconds), label: labels.seconds }
  ];
};

export const resolveWorldCupTotalRoundCount = (
  info?: PlayerTournamentInformation | null,
  fixtures?: PlayerActiveRoundFixturesResponse | null
): number => {
  const fromFixtures = LmsToNumber(fixtures?.total_round_count ?? 0);
  const fromInfo = LmsToNumber(info?.total_round_count ?? info?.max_rounds ?? 0);
  const currentRound = resolveWorldCupDefaultRoundNo(fixtures, info);

  return Math.max(fromFixtures, fromInfo, currentRound, 1);
};

const buildMatchGroupsByDate = (response: PlayerActiveRoundFixturesResponse, leagueName: string): MatchGroup[] => {
  const fixtures = collectWorldCupFixtures(response)
    .slice()
    .sort((left, right) => LmsToNumber(left.starts_at_unix) - LmsToNumber(right.starts_at_unix));

  const byLocalDate = new Map<string, PlayerFixtureView[]>();

  for (const fixture of fixtures) {
    const dateKey = getWorldCupFixtureLocalDateKey(fixture.starts_at_unix) ?? 'unknown-date';
    const dayFixtures = byLocalDate.get(dateKey) ?? [];
    dayFixtures.push(fixture);
    byLocalDate.set(dateKey, dayFixtures);
  }

  return [...byLocalDate.entries()].map(([dateKey, dayFixtures]) => ({
    id: dateKey,
    label: dateKey === 'unknown-date' ? 'Fixtures' : formatDateToWeekdayOrdinalMonth(dateKey),
    matches: dayFixtures.map(fixture => mapFixtureToWorldCupMatch(fixture, leagueName))
  }));
};

const buildMatchGroupsByGroup = (
  response: PlayerActiveRoundFixturesResponse,
  standings: PlayerTournamentStandings | null | undefined,
  leagueName: string
): MatchGroup[] => {
  const teamGroupLookup = buildWorldCupTeamGroupLookup(standings);
  const fixtures = collectWorldCupFixtures(response);

  return groupMatches(fixtures, fixture => resolveFixtureGroupKey(fixture, teamGroupLookup), leagueName);
};

export const buildWorldCupMatchesViewModel = (input: {
  info?: PlayerTournamentInformation | null;
  standings?: PlayerTournamentStandings | null;
  fixtures?: PlayerActiveRoundFixturesResponse | null;
  viewMode: WorldCupMatchesViewMode;
}): WorldCupMatchesViewModel => {
  const leagueName =
    input.standings?.competition_name ||
    input.info?.competition_name ||
    input.fixtures?.fixtures?.[0]?.competition ||
    DEFAULT_LEAGUE_LABEL;

  const roundOptions = buildWorldCupRoundOptions(input.info, input.fixtures);
  const defaultRoundNo = resolveWorldCupDefaultRoundNo(input.fixtures, input.info);

  if (!input.fixtures) {
    return { roundOptions, matchGroups: [], leagueName, defaultRoundNo };
  }

  const matchGroups =
    input.viewMode === 'date'
      ? buildMatchGroupsByDate(input.fixtures, leagueName)
      : buildMatchGroupsByGroup(input.fixtures, input.standings, leagueName);

  return { roundOptions, matchGroups, leagueName, defaultRoundNo };
};

type SeasonSportsbookStandingsGroup = NonNullable<
  NonNullable<NonNullable<SeasonSportsbookOverview['tables']>[number]>['groups']
>[number];

export const getSeasonSportsbookStandingsGroups = (
  overview?: SeasonSportsbookOverview | null
): SeasonSportsbookStandingsGroup[] => {
  return overview?.tables?.find(table => table.type === 'total')?.groups ?? overview?.tables?.[0]?.groups ?? [];
};

export const formatSeasonSportsbookGroupLabel = (group: SeasonSportsbookStandingsGroup): string => {
  const raw = String(group.group_name || group.name || group.id || '').trim();
  if (!raw) return 'Group';
  if (/^group\s/i.test(raw)) return raw;
  return `Group ${raw}`;
};

export const buildSeasonSportsbookStandingsGroupOptions = (
  overview?: SeasonSportsbookOverview | null
): WorldCupStandingsGroupOption[] =>
  [...getSeasonSportsbookStandingsGroups(overview)]
    .sort((left, right) =>
      formatSeasonSportsbookGroupLabel(left).localeCompare(formatSeasonSportsbookGroupLabel(right), undefined, {
        numeric: true
      })
    )
    .map(group => ({
      id: group.id || formatSeasonSportsbookGroupLabel(group),
      label: formatSeasonSportsbookGroupLabel(group)
    }));

export const mapSeasonSportsbookEntryToStandingRow = (entry: SeasonSportsbookStandingsEntry): StandingRow => ({
  rank: LmsToNumber(entry.rank ?? 0),
  team: {
    name: entry.team_name || '-',
    flagSrc: entry.team_image || DEFAULT_TEAM_IMAGE
  },
  played: LmsToNumber(entry.played ?? 0),
  wins: LmsToNumber(entry.wins ?? 0),
  draws: LmsToNumber(entry.draws ?? 0),
  losses: LmsToNumber(entry.losses ?? 0),
  points: LmsToNumber(entry.points ?? 0)
});

export const mapSeasonSportsbookGroupToRows = (entries?: SeasonSportsbookStandingsEntry[]): StandingRow[] =>
  (entries ?? [])
    .slice()
    .sort((left, right) => LmsToNumber(left.rank ?? 0) - LmsToNumber(right.rank ?? 0))
    .map(mapSeasonSportsbookEntryToStandingRow);

export const buildSeasonSportsbookTeamGroupLookup = (
  overview?: SeasonSportsbookOverview | null
): Map<string, string> => {
  const lookup = new Map<string, string>();

  for (const group of getSeasonSportsbookStandingsGroups(overview)) {
    const label = formatSeasonSportsbookGroupLabel(group);
    for (const entry of group.entries ?? []) {
      if (entry.team_id) {
        lookup.set(entry.team_id, label);
      }
    }
  }

  return lookup;
};

const KNOCKOUT_DRAW_ROUND_IDS = ['round-of-32', 'round-of-16', 'quarter-finals', 'semi-finals', 'final'] as const;

const KNOCKOUT_DRAW_ROUND_SIZES = [16, 8, 4, 2, 1] as const;

export type WorldCupKnockoutRoundId = (typeof KNOCKOUT_DRAW_ROUND_IDS)[number];

export type WorldCupFixtureFilterId = `matchweek:${number}` | `knockout:${WorldCupKnockoutRoundId}`;

export type WorldCupDrawRoundLabel = (typeof DRAW_TABS)[number];

export type WorldCupFixtureFilterOption =
  | { id: `matchweek:${number}`; kind: 'matchweek'; matchweek: number }
  | { id: `knockout:${WorldCupKnockoutRoundId}`; kind: 'knockout'; label: WorldCupDrawRoundLabel };

export const isWorldCupKnockoutFixtureFilter = (
  filterId: WorldCupFixtureFilterId
): filterId is `knockout:${WorldCupKnockoutRoundId}` => filterId.startsWith('knockout:');

export const parseWorldCupMatchweekFixtureFilter = (filterId: WorldCupFixtureFilterId): number =>
  Number(filterId.replace('matchweek:', ''));

const getSeasonSportsbookKnockoutFixtures = (
  overview?: SeasonSportsbookOverview | null
): SeasonSportsbookFixtureEntry[] =>
  (overview?.fixtures ?? [])
    .filter(entry => LmsToNumber(entry.fixture?.matchweek ?? 0) === 0)
    .sort(
      (left, right) => LmsToNumber(left.fixture?.starts_at_unix ?? 0) - LmsToNumber(right.fixture?.starts_at_unix ?? 0)
    );

const splitKnockoutFixturesIntoRounds = (
  fixtures: SeasonSportsbookFixtureEntry[]
): SeasonSportsbookFixtureEntry[][] => {
  let offset = 0;

  return KNOCKOUT_DRAW_ROUND_SIZES.map(size => {
    const roundFixtures = fixtures.slice(offset, offset + size);
    offset += size;
    return roundFixtures;
  });
};

export const buildSeasonSportsbookMatchweekOptions = (overview?: SeasonSportsbookOverview | null): number[] => {
  const matchweeks = new Set<number>();

  for (const entry of overview?.fixtures ?? []) {
    const matchweek = LmsToNumber(entry.fixture?.matchweek ?? 0);
    if (matchweek > 0) matchweeks.add(matchweek);
  }

  return [...matchweeks].sort((left, right) => left - right);
};

export const buildSeasonSportsbookFixtureFilterOptions = (
  overview?: SeasonSportsbookOverview | null
): WorldCupFixtureFilterOption[] => {
  const options: WorldCupFixtureFilterOption[] = buildSeasonSportsbookMatchweekOptions(overview).map(matchweek => ({
    id: `matchweek:${matchweek}`,
    kind: 'matchweek',
    matchweek
  }));

  const knockoutFixtures = getSeasonSportsbookKnockoutFixtures(overview);
  const fixtureRounds = splitKnockoutFixturesIntoRounds(knockoutFixtures);

  KNOCKOUT_DRAW_ROUND_IDS.forEach((roundId, index) => {
    if ((fixtureRounds[index]?.length ?? 0) === 0) return;

    options.push({
      id: `knockout:${roundId}`,
      kind: 'knockout',
      label: DRAW_TABS[index]
    });
  });

  return options;
};

export const getSeasonSportsbookFixturesForFilter = (
  overview: SeasonSportsbookOverview | null | undefined,
  filterId: WorldCupFixtureFilterId
): SeasonSportsbookFixtureEntry[] => {
  if (isWorldCupKnockoutFixtureFilter(filterId)) {
    const roundId = filterId.replace('knockout:', '') as WorldCupKnockoutRoundId;
    const roundIndex = KNOCKOUT_DRAW_ROUND_IDS.indexOf(roundId);
    if (roundIndex < 0) return [];

    const fixtureRounds = splitKnockoutFixturesIntoRounds(getSeasonSportsbookKnockoutFixtures(overview));
    return fixtureRounds[roundIndex] ?? [];
  }

  const matchweek = parseWorldCupMatchweekFixtureFilter(filterId);
  return (overview?.fixtures ?? []).filter(entry => LmsToNumber(entry.fixture?.matchweek ?? 0) === matchweek);
};

const resolveKnockoutRoundIdForFixtureIndex = (fixtureIndex: number): WorldCupKnockoutRoundId | null => {
  let offset = 0;

  for (let index = 0; index < KNOCKOUT_DRAW_ROUND_SIZES.length; index += 1) {
    const size = KNOCKOUT_DRAW_ROUND_SIZES[index];
    if (fixtureIndex < offset + size) return KNOCKOUT_DRAW_ROUND_IDS[index];
    offset += size;
  }

  return null;
};

export const resolveSeasonSportsbookDefaultFixtureFilter = (
  overview?: SeasonSportsbookOverview | null
): WorldCupFixtureFilterId => {
  const options = buildSeasonSportsbookFixtureFilterOptions(overview);
  if (options.length === 0) return 'matchweek:1';

  const nowMs = Date.now();
  const nextFixture = (overview?.fixtures ?? [])
    .filter(entry => {
      const kickoffMs = LmsToNumber(entry.fixture?.starts_at_unix ?? 0) * 1000;
      const status = String(entry.fixture?.status || entry.fixture?.match_status || '').toUpperCase();
      return kickoffMs > nowMs && status !== 'CLOSED' && status !== 'FINISHED' && status !== 'CANCELLED';
    })
    .sort(
      (left, right) => LmsToNumber(left.fixture?.starts_at_unix ?? 0) - LmsToNumber(right.fixture?.starts_at_unix ?? 0)
    )[0];

  if (nextFixture?.fixture) {
    const matchweek = LmsToNumber(nextFixture.fixture.matchweek ?? 0);
    if (matchweek > 0) return `matchweek:${matchweek}`;

    const knockoutFixtures = getSeasonSportsbookKnockoutFixtures(overview);
    const fixtureIndex = knockoutFixtures.indexOf(nextFixture);
    const roundId = resolveKnockoutRoundIdForFixtureIndex(fixtureIndex);
    if (roundId) return `knockout:${roundId}`;
  }

  return options[options.length - 1].id;
};

export const resolveSeasonSportsbookDefaultMatchweek = (overview?: SeasonSportsbookOverview | null): number => {
  const matchweekOptions = buildSeasonSportsbookMatchweekOptions(overview);
  if (matchweekOptions.length === 0) return 1;

  const nowMs = Date.now();
  const nextFixture = (overview?.fixtures ?? [])
    .filter(entry => {
      const kickoffMs = LmsToNumber(entry.fixture?.starts_at_unix ?? 0) * 1000;
      const status = String(entry.fixture?.status || entry.fixture?.match_status || '').toUpperCase();
      return kickoffMs > nowMs && status !== 'CLOSED' && status !== 'FINISHED' && status !== 'CANCELLED';
    })
    .sort(
      (left, right) => LmsToNumber(left.fixture?.starts_at_unix ?? 0) - LmsToNumber(right.fixture?.starts_at_unix ?? 0)
    )[0];

  if (nextFixture?.fixture?.matchweek) {
    return LmsToNumber(nextFixture.fixture.matchweek);
  }

  return matchweekOptions[matchweekOptions.length - 1] ?? 1;
};

const normalizeSportsbookOutcomeType = (type?: string): string => String(type ?? '').toLowerCase();

const buildSportsbookFixtureOdds = (
  entry: SeasonSportsbookFixtureEntry,
  homeName: string,
  awayName: string
): [MatchOdd, MatchOdd, MatchOdd] => {
  const bundle = entry.live?.markets?.length ? entry.live : entry.prematch;
  const market =
    bundle?.markets?.find(candidate => /h2h|match.?result|winner/i.test(candidate.name ?? '')) ?? bundle?.markets?.[0];
  const outcomes = market?.books?.[0]?.outcomes ?? [];
  const home = outcomes.find(outcome => normalizeSportsbookOutcomeType(outcome.type) === 'home');
  const draw = outcomes.find(outcome => normalizeSportsbookOutcomeType(outcome.type) === 'draw');
  const away = outcomes.find(outcome => normalizeSportsbookOutcomeType(outcome.type) === 'away');
  const [firstOutcome, secondOutcome, thirdOutcome] = outcomes;
  const sportsbookUrl = bundle?.url;

  return [
    {
      label: homeName,
      value: formatFixtureOddValue(home?.odds_decimal ?? firstOutcome?.odds_decimal),
      url: sportsbookUrl
    },
    {
      label: 'Draw',
      value: formatFixtureOddValue(draw?.odds_decimal ?? secondOutcome?.odds_decimal),
      url: sportsbookUrl
    },
    {
      label: awayName,
      value: formatFixtureOddValue(away?.odds_decimal ?? thirdOutcome?.odds_decimal),
      url: sportsbookUrl
    }
  ];
};

export const mapSeasonSportsbookFixtureToMatch = (entry: SeasonSportsbookFixtureEntry, leagueName: string): Match => {
  const fixture = entry.fixture;
  const homeName = fixture?.home_team_name || '-';
  const awayName = fixture?.away_team_name || '-';

  return {
    id: String(fixture?.id || fixture?.external_fixture_id || `${homeName}-${awayName}`),
    league: leagueName,
    datetime: formatWorldCupMatchDatetime(fixture?.starts_at_unix),
    team1: mapFixtureTeam(homeName, fixture?.home_team_logo_url),
    team2: mapFixtureTeam(awayName, fixture?.away_team_logo_url),
    odds: buildSportsbookFixtureOdds(entry, homeName, awayName)
  };
};

const resolveSeasonSportsbookFixtureGroupKey = (
  entry: SeasonSportsbookFixtureEntry,
  teamGroupLookup: Map<string, string>
): string => {
  const fixture = entry.fixture;
  const homeGroup = teamGroupLookup.get(fixture?.home_team_id ?? '');
  const awayGroup = teamGroupLookup.get(fixture?.away_team_id ?? '');

  if (homeGroup && awayGroup) {
    return homeGroup === awayGroup ? homeGroup : homeGroup;
  }

  return homeGroup ?? awayGroup ?? 'Other';
};

const buildSeasonSportsbookMatchGroupsByDate = (
  fixtures: SeasonSportsbookFixtureEntry[],
  leagueName: string
): MatchGroup[] => {
  const sortedFixtures = fixtures
    .slice()
    .sort(
      (left, right) => LmsToNumber(left.fixture?.starts_at_unix ?? 0) - LmsToNumber(right.fixture?.starts_at_unix ?? 0)
    );

  const byLocalDate = new Map<string, SeasonSportsbookFixtureEntry[]>();

  for (const entry of sortedFixtures) {
    const dateKey = getWorldCupFixtureLocalDateKey(entry.fixture?.starts_at_unix) ?? 'unknown-date';
    const dayFixtures = byLocalDate.get(dateKey) ?? [];
    dayFixtures.push(entry);
    byLocalDate.set(dateKey, dayFixtures);
  }

  return [...byLocalDate.entries()].map(([dateKey, dayFixtures]) => ({
    id: dateKey,
    label: dateKey === 'unknown-date' ? 'Fixtures' : formatDateToWeekdayOrdinalMonth(dateKey),
    matches: dayFixtures.map(fixture => mapSeasonSportsbookFixtureToMatch(fixture, leagueName))
  }));
};

const buildSeasonSportsbookMatchGroupsByGroup = (
  fixtures: SeasonSportsbookFixtureEntry[],
  overview: SeasonSportsbookOverview | null | undefined,
  leagueName: string
): MatchGroup[] => {
  const teamGroupLookup = buildSeasonSportsbookTeamGroupLookup(overview);
  const grouped = new Map<string, Match[]>();

  for (const entry of fixtures) {
    const key = resolveSeasonSportsbookFixtureGroupKey(entry, teamGroupLookup);
    const matches = grouped.get(key) ?? [];
    matches.push(mapSeasonSportsbookFixtureToMatch(entry, leagueName));
    grouped.set(key, matches);
  }

  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
    .map(([label, matches]) => ({
      id: label.toLowerCase().replace(/\s+/g, '-'),
      label,
      matches
    }));
};

export const buildSeasonSportsbookMatchesViewModel = (input: {
  overview?: SeasonSportsbookOverview | null;
  standingsOverview?: SeasonSportsbookOverview | null;
  viewMode: WorldCupMatchesViewMode;
  isKnockout?: boolean;
}): Pick<WorldCupMatchesViewModel, 'matchGroups' | 'leagueName'> => {
  const leagueName = resolveSeasonSportsbookLeagueLabel(input.overview ?? input.standingsOverview);
  const standingsOverview = input.standingsOverview ?? input.overview;
  const fixtures = input.overview?.fixtures ?? [];

  const matchGroups =
    input.isKnockout || input.viewMode === 'date'
      ? buildSeasonSportsbookMatchGroupsByDate(fixtures, leagueName)
      : buildSeasonSportsbookMatchGroupsByGroup(fixtures, standingsOverview, leagueName);

  return { matchGroups, leagueName };
};

const isSeasonSportsbookFixtureTerminal = (fixture?: SeasonSportsbookFixtureEntry['fixture']): boolean => {
  const status = String(fixture?.status || fixture?.match_status || '').toUpperCase();
  return status === 'CLOSED' || status === 'FINISHED' || status === 'CANCELLED';
};

export const isSeasonSportsbookFixtureUpcoming = (entry: SeasonSportsbookFixtureEntry, nowMs = Date.now()): boolean => {
  const kickoffMs = LmsToNumber(entry.fixture?.starts_at_unix ?? 0) * 1000;
  if (kickoffMs <= 0) return false;
  if (isSeasonSportsbookFixtureTerminal(entry.fixture)) return false;
  return kickoffMs > nowMs;
};

export const findNextSeasonSportsbookFixture = (
  overview?: SeasonSportsbookOverview | null,
  nowMs = Date.now()
): SeasonSportsbookFixtureEntry | null => {
  const upcoming = (overview?.fixtures ?? [])
    .filter(entry => isSeasonSportsbookFixtureUpcoming(entry, nowMs))
    .sort(
      (left, right) => LmsToNumber(left.fixture?.starts_at_unix ?? 0) - LmsToNumber(right.fixture?.starts_at_unix ?? 0)
    );

  return upcoming[0] ?? null;
};

export const buildSeasonSportsbookNextMatchView = (
  entry: SeasonSportsbookFixtureEntry,
  overview: SeasonSportsbookOverview | null | undefined,
  leagueName: string
): WorldCupNextMatchView => {
  const mapped = mapSeasonSportsbookFixtureToMatch(entry, leagueName);
  const teamGroupLookup = buildSeasonSportsbookTeamGroupLookup(overview);
  const groupLabel = resolveSeasonSportsbookFixtureGroupKey(entry, teamGroupLookup);
  const matchInfo = groupLabel !== 'Other' ? `${groupLabel} · ${leagueName}` : leagueName;

  return {
    team1: mapped.team1,
    team2: mapped.team2,
    kickoffLabel: formatWorldCupMatchDatetime(entry.fixture?.starts_at_unix),
    matchInfo,
    kickoffUnix: LmsToNumber(entry.fixture?.starts_at_unix ?? 0)
  };
};

export const buildPromoCardProps = (image: GalleryImage) => ({
  bgImage: image.image_url.startsWith('/') ? image.image_url : `${image.image_url}?w=1500&sat=15&auto=format&q=100`,
  category: image.title ?? '',
  title: image.description ?? '',
  ctaText: image.alt_text ?? '',
  href: image.url,
  urlType: image.url_type
});

export type WorldCupDrawViewModel = {
  rounds: DrawRound[];
  defaultTab: WorldCupDrawRoundLabel;
};

const formatDrawMatchSchedule = (unixValue?: string | number): { date: string; time: string } => {
  const date = unixToLocalDate(unixValue);
  if (!date) return { date: '-- ---', time: '--:--' };

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

  return { date: `${day} ${month}`, time };
};

const mapSeasonSportsbookFixtureToDrawMatch = (entry: SeasonSportsbookFixtureEntry): DrawMatch => {
  const fixture = entry.fixture;
  const homeName = fixture?.home_team_name || '-';
  const awayName = fixture?.away_team_name || '-';
  const { date, time } = formatDrawMatchSchedule(fixture?.starts_at_unix);

  return {
    id: String(fixture?.id || fixture?.external_fixture_id || `${homeName}-${awayName}`),
    date,
    time,
    team1: mapFixtureTeam(homeName, fixture?.home_team_logo_url),
    team2: mapFixtureTeam(awayName, fixture?.away_team_logo_url)
  };
};

export const resolveSeasonSportsbookDefaultDrawTab = (
  knockoutFixtures: SeasonSportsbookFixtureEntry[]
): WorldCupDrawRoundLabel => {
  if (knockoutFixtures.length === 0) return DRAW_TABS[0];

  let offset = 0;

  for (let index = 0; index < KNOCKOUT_DRAW_ROUND_SIZES.length; index += 1) {
    const size = KNOCKOUT_DRAW_ROUND_SIZES[index];
    const roundFixtures = knockoutFixtures.slice(offset, offset + size);
    offset += size;

    if (roundFixtures.length === 0) continue;

    const hasOpenFixture = roundFixtures.some(entry => !isSeasonSportsbookFixtureTerminal(entry.fixture));
    if (hasOpenFixture) return DRAW_TABS[index];
  }

  return DRAW_TABS[DRAW_TABS.length - 1];
};

export const buildSeasonSportsbookDrawViewModel = (
  overview?: SeasonSportsbookOverview | null
): WorldCupDrawViewModel => {
  const knockoutFixtures = getSeasonSportsbookKnockoutFixtures(overview);
  const fixtureRounds = splitKnockoutFixturesIntoRounds(knockoutFixtures);

  const rounds: DrawRound[] = KNOCKOUT_DRAW_ROUND_IDS.map((id, index) => ({
    id,
    matches: fixtureRounds[index]?.map(mapSeasonSportsbookFixtureToDrawMatch) ?? []
  }));

  return {
    rounds,
    defaultTab: resolveSeasonSportsbookDefaultDrawTab(knockoutFixtures)
  };
};

export const buildSeasonSportsbookDrawTabs = (rounds: DrawRound[]): WorldCupDrawRoundLabel[] =>
  DRAW_TABS.filter((_, index) => (rounds[index]?.matches.length ?? 0) > 0);

export const buildSeasonSportsbookVisibleDrawRounds = (
  rounds: DrawRound[],
  activeTab: WorldCupDrawRoundLabel
): DrawRound[] => {
  const activeIndex = DRAW_TABS.indexOf(activeTab);
  if (activeIndex < 0) return rounds.filter(round => round.matches.length > 0);

  return rounds.slice(activeIndex).filter(round => round.matches.length > 0);
};

export const resolveSeasonSportsbookDrawBracketHeight = (rounds: DrawRound[]): number => {
  const firstColumnCount = Math.max(rounds[0]?.matches.length ?? 1, 1);
  return firstColumnCount * 64 + Math.max(0, firstColumnCount - 1) * 12;
};
