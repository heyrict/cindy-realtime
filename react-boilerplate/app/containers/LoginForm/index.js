/**
 *
 * LoginForm
 *
 */

/* eslint-disable react/jsx-indent */

import React from 'react';
import PropTypes from 'prop-types';
import FieldGroup from 'components/FieldGroup';
import { Formik } from 'formik';
import * as yup from 'yup';

import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { graphql } from 'react-apollo';

import { ButtonOutline, Input } from 'style-store';
import { setCurrentUser } from 'containers/UserNavbar/actions';
import { nAlert } from 'containers/Notifier/actions';
import { withModal } from 'components/withModal';
import LoginFormMutation from 'graphql/LoginFormMutation';
import modalMessages from 'components/withModal/messages';
import messages from './messages';

const innerLoginForm = ({
  values,
  errors,
  touched,
  handleBlur,
  handleChange,
  handleSubmit,
  isSubmitting,
}) => (
  <form onSubmit={handleSubmit}>
    <FieldGroup
      Ctl={Input}
      id="formLoginUsername"
      label={<FormattedMessage {...messages.username} />}
      name="username"
      onBlur={handleBlur}
      onChange={handleChange}
      type="text"
      valid={touched.username && errors.username ? 'error' : null}
      value={values.username}
    />
    <FieldGroup
      Ctl={Input}
      id="formLoginPassword"
      label={<FormattedMessage {...messages.password} />}
      name="password"
      onBlur={handleBlur}
      onChange={handleChange}
      type="password"
      valid={touched.password && errors.password ? 'error' : null}
      value={values.password}
    />
    <FormattedMessage {...modalMessages.confirm}>
      {(msg) => (
        <ButtonOutline
          is="input"
          type="submit"
          w={1}
          value={msg}
          disabled={isSubmitting}
        />
      )}
    </FormattedMessage>
  </form>
);

innerLoginForm.propTypes = {
  values: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }),
  errors: PropTypes.shape({
    username: PropTypes.string,
    password: PropTypes.string,
  }),
  touched: PropTypes.shape({
    username: PropTypes.bool,
    password: PropTypes.bool,
  }),
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

const loginFormSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

export const LoginForm = (props) => (
  <Formik
    initialValues={{
      username: '',
      password: '',
    }}
    validationSchema={loginFormSchema}
    render={innerLoginForm}
    onSubmit={(values, { setSubmitting }) => {
      props
        .mutate({
          variables: { input: values },
        })
        .then(({ data }) => {
          const user = data.login.user;
          props.updateCurrentUser({
            ...user,
            userId: user.rowid,
          });
          setSubmitting(false);
        })
        .catch((error) => {
          props.alert(error.message);
          setSubmitting(false);
        });
    }}
  />
);

LoginForm.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  updateCurrentUser: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  updateCurrentUser: (user) => {
    dispatch(setCurrentUser(user));
  },
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

const withLogin = graphql(LoginFormMutation);

export default compose(
  withLogin,
  withConnect,
  withModal({
    header: 'Login',
    footer: {
      close: true,
    },
  }),
)(LoginForm);
