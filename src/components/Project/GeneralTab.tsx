/* eslint-disable no-unneeded-ternary */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/member-delimiter-style */
import React from 'react';
import { Box, Grid, Typography, MenuItem, FormControl, Select, FormHelperText, InputLabel, Button } from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
 

const Wrapper = styled(Box)({
  backgroundColor: '#fff',
  color: '#000000DE',
});

const Title = styled(Typography)({
  color: '#000000DE',
  fontSize: '14px',
  fontWeight: '700',
  mb: '5px',
});

interface GeneralTabProps {
  errors: any;
  register: any;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function GeneralTab({ errors, register }: GeneralTabProps): JSX.Element {
  const allCustomers: {id: number; name: string}[] = [
    {
      id: 1,
      name: 'Hoang'
    },
    {
      id: 2,
      name: 'Nguyens'
    },
  ]
  return (
    <Wrapper>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={2}>
          <Title>Client*</Title>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl sx={{ width: '100%' }} error={errors.customerId ? true : false}>
            <InputLabel id="select-label">Choose a client</InputLabel>
            <Select
              {...register('customerId')}
              name="customerId"
              id="customerId"
              labelId="select-label"
              displayEmpty
              label="Choose a client"
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {allCustomers.map((customer, index) => (
                <MenuItem key={index} value={customer.id} sx={{ maxWidth: '375px' }}>
                  {customer.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.customerId ? 'Project customer is required!' : ''}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button startIcon={<AddIcon />} sx={{ padding: '6px 16px' }} variant="contained">
            New Client
          </Button>
        </Grid>
      </Grid>
    </Wrapper>
  );
}

export default GeneralTab;
