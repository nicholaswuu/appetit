// SearchBar.js
import React, { useState, useRef } from 'react';
import { Box, InputAdornment, Paper, IconButton, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Autocomplete } from '@react-google-maps/api';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

const SearchBar = ({ onPlaceSelected }) => {
    const [inputValue, setInputValue] = useState('');
    const autocompleteRef = useRef(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    if (loadError) return <div>Error loading Google Maps</div>;
    if (!isLoaded) return <div>Loading...</div>;

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (place && onPlaceSelected) {
            onPlaceSelected(place.name || inputValue);
        }
    };

    const handleInputKeyPress = (event) => {
        if (event.key === 'Enter' && inputValue.trim()) {
            onPlaceSelected(inputValue); 
            event.preventDefault();
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <Paper
            component="form"
            sx={{
                alignItems: 'center',
                width: '100%',
                maxWidth: 900,
                boxShadow: 1,
                backgroundColor: 'transparent',
                '&:hover': {
                backgroundColor: 'rgb(255 235 210)',
                },
            }}
            >
                <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={handlePlaceChanged}
                >
                    <FormControl fullWidth variant="outlined">
                    <InputLabel 
                        htmlFor="restaurant-search"
                        sx={{
                            color: 'rgb(180 83 9)',
                            '&.Mui-focused': {
                                color: 'rgb(180 83 9)',
                            },
                        }}
                    >
                        Restaurant Name
                    </InputLabel>
                    <OutlinedInput
                        id="restaurant-search"
                        value={inputValue}
                        label="Restaurant Name"
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleInputKeyPress}
                        sx={{
                            color: 'black',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgb(217 119 6)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgb(217 119 6)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgb(217 119 6)',
                                borderWidth: 2,
                            },
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="search"
                                    edge="end"
                                    onClick={() => onPlaceSelected(inputValue)}
                                >
                                    <ArrowForwardIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    </FormControl>
                </Autocomplete>
            </Paper>
        </Box>
    );
};

export default SearchBar;