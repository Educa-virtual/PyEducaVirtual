type ColumnLetter = `${Uppercase<string>}`;
type Column =
  | ColumnLetter
  | `${ColumnLetter}${ColumnLetter}`
  | `${ColumnLetter}${ColumnLetter}${ColumnLetter}`;
type Row = `${number}`;
type Cell = `${Column}${Row}`;
type Range = `${Cell}:${Cell}`;

export interface Excel {
  Range: Range;
  Cell: Cell | Range;
}

export const isCell = (value: string): value is Cell => {
  return /^[A-Z]{1,3}[0-9]+$/.test(value);
};

export const isRange = (value: string): value is Range => {
  return /^[A-Z]{1,3}[0-9]+:[A-Z]{1,3}[0-9]+$/.test(value);
};
