import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function Selection() {
    const [age, setAge] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl variant="standard" fullWidth>
                <InputLabel id="demo-simple-select-label">Ratio</InputLabel>
                <Select
                    sx={{ borderColor: "#fff" }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Age"
                    onChange={handleChange}
                >
                    <MenuItem value={""}>Ten</MenuItem>
                    <MenuItem value={""}>Twenty</MenuItem>
                    <MenuItem value={""}>Thirty</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}