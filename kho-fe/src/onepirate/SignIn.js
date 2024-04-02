import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { required } from './modules/form/validation';
import RFTextField from './modules/form/RFTextField';
import FormButton from './modules/form/FormButton';
import FormFeedback from './modules/form/FormFeedback';
import AppAppBar from './modules/views/AppAppBar';
import AppForm from './modules/views/AppForm';
import { Field, Form, FormSpy } from 'react-final-form';
import Box from '@mui/material/Box';
import Typography from './modules/components/Typography';
import withRoot from './modules/withRoot';

function SignIn() {
  const [loginData, setLoginData] = useState({ loginname: '', password: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prevLoginData => ({
      ...prevLoginData,
      [name]: value
    }));
  };

  const handleSubmit = async (values) => { 
    try {
      const { loginname, password } = values; 
      const requestData = {
        loginname: loginname.trim(), 
        password: password.trim()
      };
      const response = await axios.post('http://localhost:3000/users/login', requestData);
      console.log('Phản hồi từ Backend:', response.data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('roleid', response.data.roleid);

      const roleId = response.data.roleid;
      if (roleId === 1) {
        navigate('/admin');
      } else if (roleId === 2) {
        navigate('/sale');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu đến Backend:', error);
      setError('Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập và thử lại.');
    }
  };

  const validate = (values) => {
    const errors = required(['loginname', 'password'], values); 

    return errors;
  };

  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Sign In
          </Typography>
          <Typography variant="body2" align="center">
            {'Not a member yet? '}
            <RouterLink to="/sign-up" align="center" underline="always">Sign Up here</RouterLink>
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
                autoComplete="loginname" 
                autoFocus
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Login Name" 
                margin="normal"
                name="loginname" 
                required
                size="large"
              />
              <Field
                fullWidth
                size="large"
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="password"
                autoComplete="current-password"
                label="Password"
                type="password"
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
                size="large"
                color="secondary"
                fullWidth
              >
                {submitting || sent ? 'In progress…' : 'Sign In'}
              </FormButton>
            </Box>
          )}
        </Form>
        <Typography align="center">
          <RouterLink to="/forgot-password" underline="always">Forgot password?</RouterLink>
        </Typography>
      </AppForm>
    </React.Fragment>
  );
}

export default withRoot(SignIn);
