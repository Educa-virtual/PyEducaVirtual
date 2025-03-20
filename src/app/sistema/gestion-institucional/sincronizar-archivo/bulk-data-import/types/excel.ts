type ColumnLetter = `${Uppercase<string>}`
type Column =
    | ColumnLetter
    | `${ColumnLetter}${ColumnLetter}`
    | `${ColumnLetter}${ColumnLetter}${ColumnLetter}`
type Row = `${number}`
type Cell = `${Column}${Row}`
type Range = `${Cell}:${Cell}`

export interface Excel {
    Range: Range
    Cell: Cell | Range
}
