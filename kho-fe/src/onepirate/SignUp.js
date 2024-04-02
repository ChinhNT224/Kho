import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';
import { Field, Form, FormSpy } from 'react-final-form';
import Typography from './modules/components/Typography';
import AppAppBar from './modules/views/AppAppBar';
import AppForm from './modules/views/AppForm';
import { required, email } from './modules/form/validation';
import RFTextField from './modules/form/RFTextField';
import FormButton from './modules/form/FormButton';
import FormFeedback from './modules/form/FormFeedback';
import withRoot from './modules/withRoot';

function SignUp() {
  const [sent, setSent] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (values) => {
    const errors = required(['loginname', 'email', 'password', 'employeeid'], values);

    if (!errors.email) {
      const emailError = email(values.email);
      if (emailError) {
        errors.email = emailError;
      }
    }

    return errors;
  };

  const handleSubmit = async (values) => {
    try {
      if (!values.email) {
        throw new Error('Email cannot be blank');
      }
      
      const response = await fetch('http://localhost:3000/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginname: values.loginname,
          password: values.password,
          email: values.email,
          employeeid: parseInt(values.employeeid),
          roleid: 2, 
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setSent(true);
        setSuccess(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };
  

  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Sign Up
          </Typography>
          {success && (
            <Typography variant="body2" align="center" color="success">
              Account created successfully! <RouterLink to="/sign-in">Sign in</RouterLink>
            </Typography>
          )}
          {!success && (
            <Typography variant="body2" align="center">
              <RouterLink to="/sign-in" underline="always">Already have an account?</RouterLink>
            </Typography>
          )}
        </React.Fragment>
        <Form
          onSubmit={handleSubmit}
          subscription={{ submitting: true }}
          validate={validate}
        >
          {({ handleSubmit: handleSubmit2, submitting }) => (
            <Box component="form" onSubmit={handleSubmit2} noValidate sx={{ mt: 6 }}>
              <Field
                autoComplete="loginname"
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Loginname"
                margin="normal"
                name="loginname"
                required
              />
              <Field
                autoComplete="email"
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Email"
                margin="normal"
                name="email"
                required
              />
              <Field
                fullWidth
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="password"
                autoComplete="new-password"
                label="Password"
                type="password"
                margin="normal"
              />
              <Field
                fullWidth
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="employeeid"
                label="Employee ID"
                type="number"
                margin="normal"
              />
              <FormSpy subscription={{ submitError: true }}>
                {({ submitError }) =>
                  submitError ? (
                    <FormFeedback error sx={{ mt: 2 }}>
                      {submitError}
                    </FormFeedback>
                  ) : null
                }
              </FormSpy>
              <FormButton
                sx={{ mt: 3, mb: 2 }}
                disabled={submitting || sent}
                color="secondary"
                fullWidth
              >
                {submitting || sent ? 'In progress…' : 'Sign Up'}
              </FormButton>
            </Box>
          )}
        </Form>
      </AppForm>
    </React.Fragment>
  );
}

export default withRoot(SignUp);
