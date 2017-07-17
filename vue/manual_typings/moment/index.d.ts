type formatFunction = () => string;

interface MomentDateObject {
  years?: number;
  /* One digit */
  months?: number;
  /* Day of the month */
  date?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

interface MomentLanguageData extends BaseMomentLanguage {
  /**
   * @param formatType should be L, LL, LLL, LLLL.
   */
  longDateFormat(formatType: string): string;
}

interface Duration {
  humanize(withSuffix?: boolean): string;

  as(units: string): number;

  milliseconds(): number;
  asMilliseconds(): number;

  seconds(): number;
  asSeconds(): number;

  minutes(): number;
  asMinutes(): number;

  hours(): number;
  asHours(): number;

  days(): number;
  asDays(): number;

  weeks(): number;
  asWeeks(): number;

  months(): number;
  asMonths(): number;

  years(): number;
  asYears(): number;

  add(n: number, p: UnitOfTime): Duration;
  add(n: number): Duration;
  add(d: Duration): Duration;

  subtract(n: number, p: UnitOfTime): Duration;
  subtract(n: number): Duration;
  subtract(d: Duration): Duration;

  toISOString(): string;
  toJSON(): string;
}

interface MomentInput {
  /** Year */
  years?: number;
  /** Year */
  year?: number;
  /** Year */
  y?: number;

  /** Month */
  months?: number;
  /** Month */
  month?: number;
  /** Month */
  M?: number;

  /** Week */
  weeks?: number;
  /** Week */
  week?: number;
  /** Week */
  w?: number;

  /** Day/Date */
  days?: number;
  /** Day/Date */
  day?: number;
  /** Day/Date */
  date?: number;
  /** Day/Date */
  d?: number;

  /** Hour */
  hours?: number;
  /** Hour */
  hour?: number;
  /** Hour */
  h?: number;

  /** Minute */
  minutes?: number;
  /** Minute */
  minute?: number;
  /** Minute */
  m?: number;

  /** Second */
  seconds?: number;
  /** Second */
  second?: number;
  /** Second */
  s?: number;

  /** Millisecond */
  milliseconds?: number;
  /** Millisecond */
  millisecond?: number;
  /** Millisecond */
  ms?: number;
}

interface MomentCalendar {
  lastDay?: string | formatFunction;
  sameDay?: string | formatFunction;
  nextDay?: string | formatFunction;
  lastWeek?: string | formatFunction;
  nextWeek?: string | formatFunction;
  sameElse?: string | formatFunction;
}

interface MomentRelativeTime {
  future: any;
  past: any;
  s: any;
  m: any;
  mm: any;
  h: any;
  hh: any;
  d: any;
  dd: any;
  M: any;
  MM: any;
  y: any;
  yy: any;
}

interface MomentLongDateFormat {
  L: string;
  LL: string;
  LLL: string;
  LLLL: string;
  LT: string;
  LTS: string;
  l?: string;
  ll?: string;
  lll?: string;
  llll?: string;
  lt?: string;
  lts?: string;
}

interface MomentParsingFlags {
  empty: boolean;
  unusedTokens: string[];
  unusedInput: string[];
  overflow: number;
  charsLeftOver: number;
  nullInput: boolean;
  invalidMonth?: string;
  invalidFormat: boolean;
  userInvalidated: boolean;
  iso: boolean;
  parsedDateParts: any[];
  meridiem?: string;
}

interface BaseMomentLanguage {
  months?: any;
  monthsShort?: any;
  weekdays?: any;
  weekdaysShort?: any;
  weekdaysMin?: any;
  relativeTime?: MomentRelativeTime;
  meridiem?: (hour: number, minute: number, isLowercase: boolean) => string;
  calendar?: MomentCalendar;
  ordinal?: (num: number) => string;
  week?: MomentLanguageWeek;
}

interface MomentLanguage extends BaseMomentLanguage {
  longDateFormat?: MomentLongDateFormat;
}

interface MomentLanguageWeek {
  dow?: number;
  doy?: number;
}

interface MomentBuiltinFormat {
  __momentBuiltinFormatBrand: any;
}

type MomentFormatSpecification = string | MomentBuiltinFormat | (string | MomentBuiltinFormat)[];

type UnitOfTime = ("year" | "years" | "y" |
  "quarter" | "quarters" | "Q" |
  "month" | "months" | "M" |
  "week" | "weeks" | "w" |
  "date" | "dates" | "d" |
  "day" | "days" |
  "hour" | "hours" | "h" |
  "minute" | "minutes" | "m" |
  "second" | "seconds" | "s" |
  "millisecond" | "milliseconds" | "ms");

interface MomentCreationData {
  input?: string;
  format?: string;
  locale?: MomentLocale;
  isUTC: boolean;
  strict: boolean;
}

interface MomentLocale  {
  // Details about the locale structure are not in the documentation so they are omitted here.
}

interface Moment {
  format(format: string): string;
  format(): string;

  fromNow(withoutSuffix?: boolean): string;

  startOf(unitOfTime: UnitOfTime): Moment;
  endOf(unitOfTime: UnitOfTime): Moment;

  /**
   * Mutates the original moment by adding time. (deprecated in 2.8.0)
   *
   * @param unitOfTime the unit of time you want to add (eg "years" / "hours" etc)
   * @param amount the amount you want to add
   */
  add(unitOfTime: UnitOfTime, amount: number): Moment;
  /**
   * Mutates the original moment by adding time.
   *
   * @param amount the amount you want to add
   * @param unitOfTime the unit of time you want to add (eg "years" / "hours" etc)
   */
  add(amount: number, unitOfTime: UnitOfTime): Moment;
  /**
   * Mutates the original moment by adding time. Note that the order of arguments can be flipped.
   *
   * @param amount the amount you want to add
   * @param unitOfTime the unit of time you want to add (eg "years" / "hours" etc)
   */
  add(amount: string, unitOfTime: UnitOfTime): Moment;
  /**
   * Mutates the original moment by adding time.
   *
   * @param objectLiteral an object literal that describes multiple time units {days:7,months:1}
   */
  add(objectLiteral: MomentInput): Moment;
  /**
   * Mutates the original moment by adding time.
   *
   * @param duration a length of time
   */
  add(duration: Duration): Moment;

  /**
   * Mutates the original moment by subtracting time. (deprecated in 2.8.0)
   *
   * @param unitOfTime the unit of time you want to subtract (eg "years" / "hours" etc)
   * @param amount the amount you want to subtract
   */
  subtract(unitOfTime: UnitOfTime, amount: number): Moment;
  /**
   * Mutates the original moment by subtracting time.
   *
   * @param unitOfTime the unit of time you want to subtract (eg "years" / "hours" etc)
   * @param amount the amount you want to subtract
   */
  subtract(amount: number, unitOfTime: UnitOfTime): Moment;
  /**
   * Mutates the original moment by subtracting time. Note that the order of arguments can be flipped.
   *
   * @param amount the amount you want to add
   * @param unitOfTime the unit of time you want to subtract (eg "years" / "hours" etc)
   */
  subtract(amount: string, unitOfTime: UnitOfTime): Moment;
  /**
   * Mutates the original moment by subtracting time.
   *
   * @param objectLiteral an object literal that describes multiple time units {days:7,months:1}
   */
  subtract(objectLiteral: MomentInput): Moment;
  /**
   * Mutates the original moment by subtracting time.
   *
   * @param duration a length of time
   */
  subtract(duration: Duration): Moment;

  calendar(): string;
  calendar(start: Moment): string;
  calendar(start: Moment, formats: MomentCalendar): string;

  clone(): Moment;

  /**
   * @return Unix timestamp, or milliseconds since the epoch.
   */
  valueOf(): number;

  local(): Moment; // current date/time in local mode

  utc(): Moment; // current date/time in UTC mode

  isValid(): boolean;
  invalidAt(): number;

  creationData(): MomentCreationData;
  parsingFlags(): MomentParsingFlags;

  year(y: number): Moment;
  year(): number;
  quarter(): number;
  quarter(q: number): Moment;
  month(M: number): Moment;
  month(M: string): Moment;
  month(): number;
  day(d: number): Moment;
  day(d: string): Moment;
  day(): number;
  date(d: number): Moment;
  date(): number;
  hour(h: number): Moment;
  hour(): number;
  hours(h: number): Moment;
  hours(): number;
  minute(m: number): Moment;
  minute(): number;
  minutes(m: number): Moment;
  minutes(): number;
  second(s: number): Moment;
  second(): number;
  seconds(s: number): Moment;
  seconds(): number;
  millisecond(ms: number): Moment;
  millisecond(): number;
  milliseconds(ms: number): Moment;
  milliseconds(): number;
  weekday(): number;
  weekday(d: number): Moment;
  isoWeekday(): number;
  isoWeekday(d: number): Moment;
  isoWeekday(d: string): Moment;
  weekYear(): number;
  weekYear(d: number): Moment;
  isoWeekYear(): number;
  isoWeekYear(d: number): Moment;
  week(): number;
  week(d: number): Moment;
  weeks(): number;
  weeks(d: number): Moment;
  isoWeek(): number;
  isoWeek(d: number): Moment;
  isoWeeks(): number;
  isoWeeks(d: number): Moment;
  weeksInYear(): number;
  isoWeeksInYear(): number;
  dayOfYear(): number;
  dayOfYear(d: number): Moment;

  from(f: Moment | string | number | Date | number[], suffix?: boolean): string;
  to(f: Moment | string | number | Date | number[], suffix?: boolean): string;
  toNow(withoutPrefix?: boolean): string;

  diff(b: Moment): number;
  diff(b: Moment, unitOfTime: UnitOfTime): number;
  diff(b: Moment, unitOfTime: UnitOfTime, precise: boolean): number;

  toArray(): number[];
  toDate(): Date;
  toISOString(): string;
  toJSON(): string;
  unix(): number;

  isLeapYear(): boolean;
  zone(): number;
  zone(b: number): Moment;
  zone(b: string): Moment;
  utcOffset(): number;
  utcOffset(b: number): Moment;
  utcOffset(b: string): Moment;
  daysInMonth(): number;
  isDST(): boolean;

  isBefore(): boolean;
  isBefore(b: Moment | string | number | Date | number[], granularity?: string): boolean;

  isAfter(): boolean;
  isAfter(b: Moment | string | number | Date | number[], granularity?: string): boolean;

  isSame(b: Moment | string | number | Date | number[], granularity?: string): boolean;
  isSameOrAfter(b: Moment | string | number | Date | number[], granularity?: string): boolean;
  isSameOrBefore(b: Moment | string | number | Date | number[], granularity?: string): boolean;

  isBetween(a: Moment | string | number | Date | number[], b: Moment | string | number | Date | number[], granularity?: string, inclusivity?: string): boolean;

  // Deprecated as of 2.8.0.
  lang(language: string): Moment;
  lang(reset: boolean): Moment;
  lang(): MomentLanguage;

  locale(language: string): Moment;
  locale(reset: boolean): Moment;
  locale(): string;

  locales(): string[];

  localeData(language: string): Moment;
  localeData(reset: boolean): Moment;
  localeData(): MomentLanguage;

  defineLocale(language: string, locale: MomentLanguage): MomentLanguage;
  updateLocale(language: string, locale: MomentLanguage): MomentLanguage;

  // Deprecated as of 2.7.0.
  max(date: Moment | string | number | Date | any[]): Moment;
  max(date: string, format: string): Moment;

  // Deprecated as of 2.7.0.
  min(date: Moment | string | number | Date | any[]): Moment;
  min(date: string, format: string): Moment;

  get(unit: UnitOfTime): number;
  set(unit: UnitOfTime, value: number): Moment;
  set(objectLiteral: MomentInput): Moment;

  /*This returns an object containing year, month, day-of-month, hour, minute, seconds, milliseconds.*/
  //Works with version 2.10.5+
  toObject(): MomentDateObject;
}

declare interface MomentStatic {
  (): Moment;
  (date: number): Moment;
  (date: number[]): Moment;
  (date: string, format?: MomentFormatSpecification, strict?: boolean): Moment;
  (date: string, format?: MomentFormatSpecification, language?: string, strict?: boolean): Moment;
  (date: Date): Moment;
  (date: Moment): Moment;
  (date: Object): Moment;

  version: string;
  fn: Moment;

  utc(): Moment;
  utc(date: number): Moment;
  utc(date: number[]): Moment;
  utc(date: string, format?: string, strict?: boolean): Moment;
  utc(date: string, format?: string, language?: string, strict?: boolean): Moment;
  utc(date: string, formats: string[], strict?: boolean): Moment;
  utc(date: string, formats: string[], language?: string, strict?: boolean): Moment;
  utc(date: Date): Moment;
  utc(date: Moment): Moment;
  utc(date: Object): Moment;

  unix(timestamp: number): Moment;

  invalid(parsingFlags?: Object): Moment;
  isMoment(): boolean;
  isMoment(m: any): m is Moment;
  isDate(m: any): m is Date;
  isDuration(): boolean;
  isDuration(d: any): d is Duration;

  // Deprecated in 2.8.0.
  lang(language?: string): string;
  lang(language?: string, definition?: MomentLanguage): string;

  locale(language?: string): string;
  locale(language?: string[]): string;
  locale(language?: string, definition?: MomentLanguage): string;

  localeData(language?: string): MomentLanguageData;

  updateLocale(language: string, locale: MomentLanguage): MomentLanguage;

  longDateFormat: any;
  relativeTime: any;
  meridiem: (hour: number, minute: number, isLowercase: boolean) => string;
  calendar: any;
  ordinal: (num: number) => string;

  duration(milliseconds: Number): Duration;
  duration(num: Number, unitOfTime: UnitOfTime): Duration;
  duration(input: MomentInput): Duration;
  duration(object: any): Duration;
  duration(): Duration;

  parseZone(date: string): Moment;

  months(): string[];
  months(index: number): string;
  months(format: string): string[];
  months(format: string, index: number): string;
  monthsShort(): string[];
  monthsShort(index: number): string;
  monthsShort(format: string): string[];
  monthsShort(format: string, index: number): string;

  weekdays(): string[];
  weekdays(index: number): string;
  weekdays(format: string): string[];
  weekdays(format: string, index: number): string;
  weekdays(localeSorted: boolean): string[];
  weekdays(localeSorted: boolean, index: number): string;
  weekdays(localeSorted: boolean, format: string): string[];
  weekdays(localeSorted: boolean, format: string, index: number): string;
  weekdaysShort(): string[];
  weekdaysShort(index: number): string;
  weekdaysShort(format: string): string[];
  weekdaysShort(format: string, index: number): string;
  weekdaysShort(localeSorted: boolean): string[];
  weekdaysShort(localeSorted: boolean, index: number): string;
  weekdaysShort(localeSorted: boolean, format: string): string[];
  weekdaysShort(localeSorted: boolean, format: string, index: number): string;
  weekdaysMin(): string[];
  weekdaysMin(index: number): string;
  weekdaysMin(format: string): string[];
  weekdaysMin(format: string, index: number): string;
  weekdaysMin(localeSorted: boolean): string[];
  weekdaysMin(localeSorted: boolean, index: number): string;
  weekdaysMin(localeSorted: boolean, format: string): string[];
  weekdaysMin(localeSorted: boolean, format: string, index: number): string;

  min(...moments: Moment[]): Moment;
  max(...moments: Moment[]): Moment;

  normalizeUnits(unit: string): string;
  relativeTimeThreshold(threshold: string): number | boolean;
  relativeTimeThreshold(threshold: string, limit: number): boolean;
  relativeTimeRounding(fn: (num: number) => number): boolean;
  relativeTimeRounding(): (num: number) => number;
  calendarFormat(m: Moment, now: Moment): string;

  /**
   * Constant used to enable explicit ISO_8601 format parsing.
   */
  ISO_8601: MomentBuiltinFormat;

  defaultFormat: string;
  defaultFormatUtc: string;
}

declare module "moment" {
  export = MomentStatic;
}

declare var moment: MomentStatic;
