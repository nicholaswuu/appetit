import * as React from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { 
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons, 
} from '@mui/x-data-grid';

const initialRows = [
    { id: 1, cuisine: 'Italian', restaurant: 'Snow', order: 'Pasta', price: 35, rating: 1 },
    { id: 2, cuisine: 'French', restaurant: 'Lannister', order: 'Escargot', price: 42, rating: 2 },
    { id: 3, cuisine: 'Middle Eastern', restaurant: 'Lannister', order: 'Hummus', price: 45, rating: 3 },
    { id: 4, cuisine: 'Japanese', restaurant: 'Stark', order: 'Sushi', price: 16, rating: 10 },
    { id: 5, cuisine: 'Egyptian', restaurant: 'Targaryen', order: 'Lamb', price: 20, rating: 6 },
    { id: 6, cuisine: 'Peruvian', restaurant: 'Melisandre', order: 'Ceviche', price: 150, rating: 9 },
    { id: 7, cuisine: 'Fast Food', restaurant: 'Clifford', order: 'Burger', price: 44, rating: 4 },
    { id: 8, cuisine: 'Chinese', restaurant: 'Frances', order: 'Dim Sum', price: 36, rating: 8 },
    { id: 9, cuisine: 'Thai', restaurant: 'Roxie', order: 'Pad Thai', price: 65, rating: 9 },
];

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = 1;
    setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

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
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
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
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'cuisine', headerName: 'Cuisine', width: 200, editable: true,},
    { field: 'restaurant', headerName: 'Restaurant', width: 400, editable: true,},
    { field: 'order', headerName: 'Order', width: 400, editable: true,},
    { field: 'price', headerName: 'Price', width: 100, editable: true,},
    { field: 'rating', headerName: 'Rating', width: 160, editable: true,},
    {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
    
            if (isInEditMode) {
            return [
                <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                    color: 'primary.main',
                }}
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
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}
