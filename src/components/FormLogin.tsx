import React, { FormEventHandler } from 'react';
import {
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Checkbox,
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import PersonIcon from '@mui/icons-material/Person';
import HttpsIcon from '@mui/icons-material/Https';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';

interface FormLoginProps {
  handleSubmit: FormEventHandler<HTMLFormElement>;
}

interface SignInForm {
  userNameOrEmailAddress: string;
  password: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function FormLogin({ handleSubmit }: FormLoginProps): JSX.Element {
  return (
    <Box
      mt={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#fff',
        minHeight: '100px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        marginBottom: '30px',
        padding: '20px',
        fontSize: '14px',
        color: '#555',
      }}
    >
      <Typography variant="h6" align="center" sx={{ margin: '10px 0' }}>
        Log in
      </Typography>
      <Formik
        initialValues={{
          userNameOrEmailAddress: '',
          password: '',
        }}
        onSubmit={async (values) => {
            await sleep(500);
          }}
        validationSchema={Yup.object().shape({
          userNameOrEmailAddress: Yup.string().required(),
          password: Yup.string().required(),
        })}
      >
        {(props: FormikProps<SignInForm>) => {
          const { values, touched, errors, handleBlur, handleChange } = props;
          return (
            <Form onSubmit={handleSubmit}>
              <Grid>
                <Grid item lg={10} md={10} sm={10} xs={10}>
                  <PersonIcon />
                  <TextField
                    name="userNameOrEmailAddress"
                    id="userNameOrEmailAddress"
                    label="User name or email *"
                    value={values.userNameOrEmailAddress}
                    type="text"
                    error={
                      errors.userNameOrEmailAddress &&
                      touched.userNameOrEmailAddress
                        ? true
                        : false
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid item lg={10} md={10} sm={10} xs={10}>
                  <HttpsIcon />
                  <TextField
                    name="password"
                    id="password"
                    label="Password *"
                    value={values.password}
                    type="text"
                    error={errors.password && touched.password ? true : false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid item lg={10} md={10} sm={10} xs={10}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          '&.Mui-checked': {
                            color: '#ff4081',
                          },
                        }}
                      />
                    }
                    label="Remember me"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={
                      !(values.userNameOrEmailAddress && values.password)
                        ? true
                        : false
                    }
                    sx={{ backgroundColor: '#ff4081' }}
                  >
                    Log in
                  </Button>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}

export default FormLogin;
