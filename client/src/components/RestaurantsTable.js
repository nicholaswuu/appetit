import * as React from 'react';
import { Box, InputAdornment, Rating, TextField } from '@mui/material';
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
import { useAuth } from '../AuthContext';
import SearchBar from './SearchBar';

const RestaurantsTable = () => {
    const { user } = useAuth();
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});

    React.useEffect(() => {
        const fetchRows = async () => {
            if (user) {
                const token = await user.getIdToken();
                try {
                    const response = await fetch('https://appetit-d10d8fac3d83.herokuapp.com/api/visits', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
        
                    if (!response.ok) { 
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
        
                    const data = await response.json();
                    data.sort((a, b) => b.id - a.id);
                    setRows(data);
                } catch (error) {
                    console.error('Error fetching rows:', error);
                }
            }
        };

        fetchRows();
    }, [user]);

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel((prevModel) => ({
            ...prevModel,
            [id]: { mode: GridRowModes.Edit },
        }));
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel((prevModel) => ({
            ...prevModel,
            [id]: { mode: GridRowModes.View },
        }));
    };

    const handleDeleteClick = (id) => async () => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
        if (user) {
            const token = await user.getIdToken();
            try {
                const response = await fetch(`https://appetit-d10d8fac3d83.herokuapp.com/api/visits/row/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error('Error deleting row:', error);
            }
        }
    };
    
    
    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    };

    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows((prevRows) => {
            const updatedRows = prevRows.map((row) => (row.id === newRow.id ? updatedRow : row));
            updatedRows.sort((a, b) => b.id - a.id);
            return updatedRows;
        });

        if (user) {
            const token = await user.getIdToken();
            try {
                await fetch('https://appetit-d10d8fac3d83.herokuapp.com/api/visits/row', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ row: updatedRow }),
                });
            } catch (error) {
                console.error('Error saving row:', error);
            }
        }

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
                return <Rating name="hover-feedback" value={params.value} precision={0.5} readOnly />;
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

export default RestaurantsTable;