import * as React from 'react';
import { Link } from 'react-router-dom'; 
import { Field, Form, FormSpy } from 'react-final-form';
import Box from '@mui/material/Box';
import Typography from './modules/components/Typography';
import AppAppBar from './modules/views/AppAppBar';
import AppForm from './modules/views/AppForm';
import { email, required } from './modules/form/validation';
import RFTextField from './modules/form/RFTextField';
import FormButton from './modules/form/FormButton';
import FormFeedback from './modules/form/FormFeedback';
import withRoot from './modules/withRoot';
import axios from 'axios';

function ForgotPassword() {
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const validate = (values) => {
    const errors = required(['email'], values);

    if (!errors.email) {
      const emailError = email(values.email);
      if (emailError) {
        errors.email = emailError;
      }
    }

    return errors;
  };

  const handleSubmit = async ({ email }) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/accounts/reset-password', { email });
      setSent(true);
      setError('');
    } catch (error) {
      setError('Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Forgot your password?
          </Typography>
          <Typography variant="body2" align="center">
            {"Enter your email address below and we'll " +
              'send you a link to reset your password.'}
          </Typography>
        </React.Fragment>
        <Form
          onSubmit={handleSubmit}
          subscription={{ submitting: true }}
          validate={validate}
        >
          {({ handleSubmit: handleSubmit2, submitting }) => (
            <Box component="form" onSubmit={handleSubmit2} noValidate sx={{ mt: 6 }}>
              <Field
                autoFocus
                autoComplete="email"
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Email"
                margin="normal"
                name="email"
                required
                size="large"
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
                disabled={submitting || sent || loading}
                size="large"
                color="secondary"
                fullWidth
              >
                {loading ? 'Sending...' : (submitting || sent ? 'In progress…' : 'Send reset link')}
              </FormButton>
              {error && <Typography color="error" align="center">{error}</Typography>}
              {sent && <Typography color="primary" align="center">Reset link sent successfully</Typography>}
              <Box sx={{ textAlign: 'center' }}>
                <Link to="/sign-in" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="textPrimary">
                    Back to Sign In
                  </Typography>
                </Link>
              </Box>
            </Box>
          )}
        </Form>
      </AppForm>
    </React.Fragment>
  );
}

export default withRoot(ForgotPassword);
