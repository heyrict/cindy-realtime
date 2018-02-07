/*
 * RegisterForm Messages
 *
 * This contains all the text for the RegisterForm component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  usernameHelp: {
    id: 'app.containers.RegisterForm.usernameHelp',
    defaultMessage:
      'Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.' +
      'You need username to Login but it never shows in public.',
  },
  nicknameHelp: {
    id: 'app.containers.RegisterForm.nicknameHelp',
    defaultMessage:
      'Your nickname will be shown in public. Take care not to use some offensive words.',
  },
  passwordHelp: {
    id: 'app.containers.RegisterForm.passwordHelp',
    defaultMessage:
      'Required. 8 characters or more with at least one letter and one digit.',
  },
  usernameLabel: {
    id: 'app.containers.RegisterForm.usernameLabel',
    defaultMessage: 'Username',
  },
  nicknameLabel: {
    id: 'app.containers.RegisterForm.nicknameLabel',
    defaultMessage: 'Nickname',
  },
  passwordLabel: {
    id: 'app.containers.RegisterForm.passwordLabel',
    defaultMessage: 'Password',
  },
  passwordConfirmLabel: {
    id: 'app.containers.RegisterForm.passwordConfirmLabel',
    defaultMessage: 'Password (Confirm)',
  },
  submitLabel: {
    id: 'app.containers.RegisterForm.submitLabel',
    defaultMessage: 'Submit',
  },
  policyReadPrompt: {
    id: 'app.containers.RegisterForm.policyReadPrompt',
    defaultMessage: 'I have read the user policy above',
  },
});
