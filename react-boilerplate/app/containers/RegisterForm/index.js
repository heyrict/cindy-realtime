/**
 *
 * RegisterForm
 *
 */

/* eslint-disable react/jsx-indent */

import React from 'react';
import PropTypes from 'prop-types';
import { text2md } from 'common';
import { Formik } from 'formik';
import * as yup from 'yup';

import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import { ButtonOutline, Input } from 'style-store';

import Constrained from 'components/Constrained';
import FieldGroup from 'components/FieldGroup';
import { setCurrentUser } from 'containers/UserNavbar/actions';
import { withModal } from 'components/withModal';
import RegisterFormMutation from 'graphql/RegisterFormMutation';

import { nAlert } from 'containers/Notifier/actions';
import rulesMessages from 'containers/RulesPage/messages';
import modalMessages from 'components/withModal/messages';
import messages from './messages';
import { registerSucceeded } from './actions';

const registerFormSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .max(150)
    .matches(/^[a-zA-Z0-9@\-+._]+$/),
  nickname: yup
    .string()
    .required()
    .max(64)
    .trim(),
  password: yup
    .string()
    .required()
    .min(8)
    .matches(/[0-9]+/)
    .matches(/[a-zA-Z]+/)
    .matches(/^[a-zA-Z0-9@.+\-_]+$/),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password')])
    .required(),
});

const innerRegisterForm = ({
  values,
  errors,
  touched,
  handleBlur,
  handleChange,
  handleSubmit,
  isSubmitting,
  setFieldValue,
}) => {
  if (values.displayPolicy) {
    return (
      <Constrained level={5}>
        <div style={{ maxHeight: '340px', overflow: 'auto' }}>
          <FormattedMessage {...rulesMessages.rules}>
            {(msg) => (
              <div dangerouslySetInnerHTML={{ __html: text2md(msg) }} />
            )}
          </FormattedMessage>
        </div>
        <ButtonOutline
          onClick={() => setFieldValue('displayPolicy', false)}
          style={{ borderRadius: 0, width: '100%' }}
        >
          <FormattedMessage {...messages.policyReadPrompt} />
        </ButtonOutline>
      </Constrained>
    );
  }
  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup
        id="formRegisterNickname"
        name="nickname"
        label={<FormattedMessage {...messages.nicknameLabel} />}
        Ctl={Input}
        type="text"
        value={values.nickname}
        valid={touched.nickname && errors.nickname ? 'error' : null}
        help={<FormattedMessage {...messages.nicknameHelp} />}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <FieldGroup
        id="formRegisterUsername"
        name="username"
        label={<FormattedMessage {...messages.usernameLabel} />}
        Ctl={Input}
        type="text"
        value={values.username}
        valid={touched.username && errors.username ? 'error' : null}
        help={<FormattedMessage {...messages.usernameHelp} />}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <FieldGroup
        id="formRegisterPassword"
        name="password"
        label={<FormattedMessage {...messages.passwordLabel} />}
        Ctl={Input}
        type="password"
        value={values.password}
        valid={touched.password && errors.password ? 'error' : null}
        help={<FormattedMessage {...messages.passwordHelp} />}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <FieldGroup
        id="formRegisterPasswordConfirm"
        name="passwordConfirm"
        label={<FormattedMessage {...messages.passwordConfirmLabel} />}
        Ctl={Input}
        type="password"
        value={values.passwordConfirm}
        valid={
          touched.passwordConfirm && errors.passwordConfirm ? 'error' : null
        }
        onChange={handleChange}
        onBlur={handleBlur}
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
};

innerRegisterForm.propTypes = {
  values: PropTypes.shape({
    username: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    passwordConfirm: PropTypes.string.isRequired,
    displayPolicy: PropTypes.bool.isRequired,
  }),
  errors: PropTypes.shape({
    username: PropTypes.string,
    nickname: PropTypes.string,
    password: PropTypes.string,
    passwordConfirm: PropTypes.string,
    displayPolicy: PropTypes.string,
  }),
  touched: PropTypes.shape({
    username: PropTypes.bool,
    nickname: PropTypes.bool,
    password: PropTypes.bool,
    passwordConfirm: PropTypes.bool,
    displayPolicy: PropTypes.bool,
  }),
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

const RegisterForm = (props) => (
  <Formik
    initialValues={{
      username: '',
      nickname: '',
      password: '',
      passwordConfirm: '',
      displayPolicy: true,
    }}
    validationSchema={registerFormSchema}
    onSubmit={(values, { setSubmitting }) => {
      const { username, nickname, password } = values;
      props
        .mutate({
          variables: {
            input: { username, nickname, password },
          },
        })
        .then(({ data }) => {
          const user = data.register.user;
          props.updateCurrentUser({
            ...user,
            userId: user.rowid,
          });
          props.registerSucceeded(user.rowid);
          setSubmitting(false);
        })
        .catch((error) => {
          props.alert(error.message);
          setSubmitting(false);
        });
    }}
    render={innerRegisterForm}
  />
);

RegisterForm.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  updateCurrentUser: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  registerSucceeded: PropTypes.func.isRequired,
  // onHide: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  registerSucceeded: (userId) => dispatch(registerSucceeded(userId)),
  updateCurrentUser: (user) => dispatch(setCurrentUser(user)),
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(
  null,
  mapDispatchToProps
);

const withMutation = graphql(RegisterFormMutation);

export default compose(
  withMutation,
  withConnect,
  withModal({
    header: 'Register',
    footer: {
      close: true,
    },
  })
)(RegisterForm);
