import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { customStylesTable, paginationComponentOptions } from '../../utils/funtions.table';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from '@nextui-org/react';
import { SearchIcon } from '../../assets/icons/SearchIcon';
import FilterIcon from '../../assets/icons/Filter.svg';
import { LoaderComponent } from './Loader.component';
import { pageLastIcon, pageFirstIcon, pageNextIcon, pagePreviousIcon, ShortIcon }  from '../../assets/icons/Table'
import { ITableCustomComponentProps } from '../../interfaces/options.table.interface';


export function TableCustomComponent<T>({ columns, columnsFilters = [], componentOptional, data, pending, textInfo = null, expandableRows = false, expandableRowsComponent, pagination = true, filter = true }: ITableCustomComponentProps<T>) {

    const [filterText, setFilterText] = useState<string>(''); 
    const [selectedColumns, setSelectedColumns] = useState<number[]>([]);
    const [selectedKeys, setSelectedKeys] = useState(new Set([columnsFilters[0].colum]));

  
    const activeFilters = selectedColumns.length > 0
        ? selectedColumns
        : [columnsFilters[0].key];
    
    
    const filteredItems = data.filter(item => {
        return activeFilters.some(filterKey => {
            const column = columnsFilters.find(col => col.key === filterKey);
            if (column) {
                const value = (item as any)[column.colum.toLowerCase()];
                return value?.toString().toLowerCase().includes(filterText.toLowerCase());
            }
            return false;
        });
    });

    const handleColumnSelection = (key: number) => {
        setSelectedColumns(prev => {
            if (prev.includes(key)) {
                return prev.filter(item => item !== key); 
            }
            return [...prev, key]; 
        });
    };


    return (
        <div>
            
            <div className='mb-3 mt-3 flex justify-between'>
                {filter && (
                    <div>
                        <Input
                            id="search"
                            type="text"
                            placeholder="Buscar"
                            label="Buscar"
                            className='font-bold text-xl w-80'
                            labelPlacement='outside'
                            startContent={<SearchIcon />}
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                        />
                    </div>
                )}
                <div className='mt-5 flex'>
                    {filter && (
                        <div className='mr-5'>
                            <Dropdown>
                                <DropdownTrigger className="hidden sm:flex">
                                    <Button variant="solid" color="primary">
                                        <img src={FilterIcon} alt="Filtrar" className="h-auto" /><span className="text-lg mr-2 ml-2 font-semibold"> Filtrar </span>
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns Filter"
                                    closeOnSelect={false}
                                    selectedKeys={selectedKeys}
                                    onSelectionChange={(keys) => setSelectedKeys(new Set(keys as unknown as string[]))}
                                    selectionMode="multiple" >
                                    {columnsFilters.map(column => (
                                        <DropdownItem
                                            key={column.colum}
                                            className="capitalize"
                                            onClick={() => handleColumnSelection(column.key)}
                                            isSelected={selectedColumns.includes(column.key)}
                                        >
                                            {column.text}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    )}
                    <div>
                        {componentOptional && <div className="mb-3">{componentOptional}</div>}
                    </div>

                </div>
            </div>

            
            <DataTable
                striped
                pagination={pagination}
                responsive
                persistTableHead
                highlightOnHover
                pointerOnHover
                fixedHeader
                fixedHeaderScrollHeight={'500px'}
                progressPending={pending}
                progressComponent={<LoaderComponent size='lg' className='p-5 mt-3' textInfo={textInfo} />}
                data={filteredItems} // Usa los datos filtrados
                columns={columns}
                customStyles={customStylesTable}
                noDataComponent={<h1 className='font-semibold p-8 text-xl'>No se encontraron registros.</h1>}
                paginationComponentOptions={paginationComponentOptions}
                paginationIconFirstPage={pageFirstIcon()}
                paginationIconLastPage={pageLastIcon()}
                paginationIconNext={pageNextIcon()}
                paginationIconPrevious={pagePreviousIcon()}
                sortIcon={ShortIcon()}
                expandableRows={expandableRows}
                expandableRowsComponent={expandableRowsComponent}
                expandOnRowClicked
            />
        </div>
    );
}