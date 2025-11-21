export type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;
export type Range<From extends number, To extends number> = Exclude<Enumerate<To>, Enumerate<From>> | To;

export type Digit = Range<0, 9>;
export type NonZero = Range<1, 9>;

export type HourString = `${0}${Digit}` | `${1}${Digit}` | `${2}${0 | 1 | 2 | 3}`;
export type MinuteString = `${Range<0, 5>}${Digit}`;
export type TimeString = `${HourString}:${MinuteString}`;

export type YearString = `${Digit}${Digit}`;
export type MonthString = `${0}${Digit}` | `${1}${0 | 1 | 2}`;
export type DateString = `${0}${NonZero}` | `${1 | 2}${Digit}` | `${3}${0 | 1}`;
export type TimestampString = `${YearString}${MonthString}${DateString}${HourString}${MinuteString}`;
