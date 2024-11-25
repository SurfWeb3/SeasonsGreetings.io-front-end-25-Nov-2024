import * as React from 'react';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

interface TransferMethodProps {
    setTransferMethod: (value: string) => void;
    transferMethod: string;
}

export default function TransferMethod({ setTransferMethod, transferMethod }: TransferMethodProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTransferMethod(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl>
                <RadioGroup
                    value={transferMethod}
                    onChange={handleChange}
                    defaultValue="CRYPTO"
                >
                    <FormControlLabel 
                        value="CRYPTO" 
                        control={<Radio size="small" />} 
                        label="Send using wallet address" 
                        sx={{ '& .MuiFormControlLabel-label': { fontSize: '14px' } }}
                        style={{ color: 'rgba(0, 0, 0, 0.7)' }}
                    />
                    <FormControlLabel 
                        value="EMAIL" 
                        control={<Radio size="small" />} 
                        label="Send using email address" 
                        sx={{ '& .MuiFormControlLabel-label': { fontSize: '14px' } }}
                        style={{ color: 'rgba(0, 0, 0, 0.7)' }}
                    />
                </RadioGroup>
            </FormControl>
        </Box>
    );
}