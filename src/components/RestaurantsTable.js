import * as React from 'react';
import { Box, Rating, TextField, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { 
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons, 
} from '@mui/x-data-grid';
import SearchBar from './SearchBar';

const initialRows = [
    { id: 1, cuisine: 'Italian', restaurant: 'Snow', order: 'Pasta', price: 35, rating: 1, },
    { id: 2, cuisine: 'French', restaurant: 'Lannister', order: 'Escargot', price: 42, rating: 2 },
    { id: 3, cuisine: 'Middle Eastern', restaurant: 'Lannister', order: 'Hummus', price: 45, rating: 3 },
    { id: 4, cuisine: 'Japanese', restaurant: 'Stark', order: 'Sushi', price: 16, rating: 10 },
    { id: 5, cuisine: 'Egyptian', restaurant: 'Targaryen', order: 'Lamb', price: 20, rating: 6 },
    { id: 6, cuisine: 'Peruvian', restaurant: 'Melisandre', order: 'Ceviche', price: 150, rating: 9 },
    { id: 7, cuisine: 'Fast Food', restaurant: 'Clifford', order: 'Burger', price: 44, rating: 4 },
    { id: 8, cuisine: 'Chinese', restaurant: 'Frances', order: 'Dim Sum', price: 36, rating: 8 },
    { id: 9, cuisine: 'Thai', restaurant: 'Roxie', order: 'Pad Thai', price: 65, rating: 9 },
];

export default function RestaurantsTable() {
    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState({});

    const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
    }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel((prevModel) => ({
            ...prevModel,
            [id]: { mode: GridRowModes.View },
        }));
    };

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows((prevRows) =>
            prevRows.map((row) => (row.id === newRow.id ? updatedRow : row))
        );
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleAddRow = (restaurantName) => {
        const newId = rows.length ? Math.max(...rows.map((row) => row.id)) + 1 : 1;
        const newRow = { id: newId, restaurant: restaurantName, cuisine: '', order: '', price: 0, rating: 0, isNew: true };
        setRows((prevRows) => [{ ...newRow }, ...prevRows]);
        setRowModesModel((prevModel) => ({
            ...prevModel,
            [newId]: { mode: GridRowModes.Edit },
        }));
    };

    const columns = [
        { field: 'cuisine', headerName: 'Cuisine', width: 150, editable: true,},
        { field: 'restaurant', headerName: 'Restaurant', width: 350, flex:1, editable: true,},
        { field: 'order', headerName: 'Order', width: 400, flex:1, editable: true,},
        { 
            field: "price", 
            headerName: "Price", 
            width: 150, 
            editable: true, 
            renderCell: (params) => {
                const price = typeof params.value === 'number' ? params.value : 0;
                return `$${price.toFixed(2)}`;
            },
            renderEditCell: (params) => (
                <TextField
                    type="number"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        inputProps: {
                            min: 0.00,
                            step: 0.01,
                        },
                    }}
                    value={params.value || ''}
                    onChange={(event) => {
                        params.api.setEditCellValue({ id: params.id, field: "price", value: parseFloat(event.target.value) || 0 }, event);
                    }}
                    fullWidth
                />
            ),
        },
        {
            field: "rating",
            width: 150,
            headerName: 'Rating',
            editable: true,
            renderCell: (params) => {
                return <Rating name="hover-feedback" value={params.value} precision={0.5} />;
            },
            renderEditCell: (params) => (
                <Rating
                    name="hover-feedback"
                    value={params.value || 0}
                    precision={0.5}
                    onChange={(event, newValue) => {
                        params.api.setEditCellValue({ id: params.id, field: 'rating', value: newValue }, event);
                    }}
                />
            ),
        },
        {
            field: 'actions',
            type: 'actions',
            width: 90,
            cellClassName: 'actions',
            resizable: false,
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Box
            sx={{
                height: 500,
                width: '100%',
                '& .actions': {
                    color: 'rgba(150,150,150)',
                    justifyContent: 'right',
                },
            }}
        >
            <SearchBar onPlaceSelected={handleAddRow} />
            <DataGrid 
                disableColumnMenu
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                experimentalFeatures={{ newEditingApi: true }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
                sx={{ 
                    mx: 10,
                    my: 5,
                    border: 'none',
                    fontFamily: [
                        '-apple-system',
                        'BlinkMacSystemFont',
                        '"Segoe UI"',
                        'Roboto',
                        '"Helvetica Neue"',
                        'Arial',
                        'sans-serif',
                        '"Apple Color Emoji"',
                        '"Segoe UI Emoji"',
                        '"Segoe UI Symbol"',
                    ].join(','),
                    WebkitFontSmoothing: 'auto',
                    letterSpacing: 'normal',
                    '& .MuiDataGrid-row--borderBottom .MuiDataGrid-columnHeader, .MuiDataGrid-filler': {
                        backgroundColor: 'rgb(184 115 51)',
                        color: 'rgba(255,255,255,0.7)',
                        borderBottom: 'none'
                    },
                    '& .MuiDataGrid-row': {
                        borderBottom: '1px solid rgb(217 119 6)',
                        backgroundColor: ({ id }) =>
                            rowModesModel[id]?.mode === GridRowModes.Edit
                            ? 'rgba(25, 24, 140, 0.8)'
                            : 'inherit',
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'rgba(184,115,51,0.03)',
                    },
                    '& .MuiDataGrid-row.Mui-selected, .MuiDataGrid-cell:focus': {
                        backgroundColor: 'rgba(184,115,51,0.05)',
                    },
                    '& .MuiDataGrid-row.Mui-selected:hover': {
                        backgroundColor: 'rgba(184,115,51,0.1)',
                    },
                    '& .MuiDataGrid-columnSeparator': {
                        color: 'rgba(255,255,255,0.2)',
                    },
                    '& .MuiDataGrid-columnSeparator:hover': {
                        color: 'rgba(255,255,255,0.7)',
                    },
                    '& .MuiDataGrid-cell': {
                        color: 'rgba(0,0,0,0.7)',
                        borderTop: 'none',
                        display: 'flex',
                        alignItems: 'center',
                    },
                    '& .MuiDataGrid-cell:focus': {
                        outline: 'solid rgb(217 119 6) 1px',
                    },
                    '& .MuiDataGrid-withBorderColor': {
                        borderTop: 'solid rgb(184 115 51) 2px'
                    }
                }}
            />
        </Box>
    );
}
