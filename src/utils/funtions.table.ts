import { PaginationOptions, TableStyles } from "react-data-table-component";

export function formatearTexto(text: string) {
    return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";
}

export const customStylesTable : TableStyles  = {
    table: {
        style: {
            backgroundColor: '#E2E8F0',
        }
    },
    headRow: {
        style: {
            background: '#234596',
            color: 'white',
            fontSize: '15px',
            fontWeight: 'bold',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
        },
    },
    cells: {
        style: {
            paddingLeft: '8px',
            paddingRight: '8px',
        },
    },
    pagination: {
        style: {
            fontSize: '15px',
            minHeight: '56px',
            borderTopStyle: 'solid',
            borderTopWidth: '0px',
            display: 'flex',
            justifyContent: 'center',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
        }
    },
    expanderButton: {
        style: {
            backgroundColor: 'transparent',
            borderRadius: '10px',
            transition: '1s',
            height: '100%',
            width: '100%',
            svg: {
                margin: 'auto',
            },
        },
    },
};


export const paginationComponentOptions: PaginationOptions  = {
    rowsPerPageText: 'Registros por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: false,
    selectAllRowsItemText: 'Todos',
};