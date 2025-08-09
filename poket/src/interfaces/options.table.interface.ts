
export interface IColumns {
    nombre: string;
    key: string;
    sortable: boolean;
    aling: "start" | "center" | "end";

}

export interface IColumnsFilter {
    key: string,
    nombre: string
}



// =========== Table Custos V2 

export interface IColumnsFilters {
    key: number;
    colum: string;
    text: string
}

export interface ITableCustomComponentProps<T> {
    columnsFilters?: Array<IColumnsFilters>;
    data: T[];
    componentOptional?: React.ReactNode;
    pending: boolean;
    textInfo: string | null,
    expandableRows?: boolean;
    pagination?: boolean;
    filter?: boolean;
    expandableRowsComponent? : any
}

export interface IDataRow {
    title: string;
    director: string;
    year: string;
}