import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, withState } from 'recompose';
import { pick } from 'lodash';

import { Box, Flex } from '@rebass/grid';
import Container from './Container';
import { P } from './Text';
import StyledButton from './StyledButton';
import StyledCard from './StyledCard';
import StyledInputField from './StyledInputField';
import StyledInputGroup from './StyledInputGroup';
import StyledInput from './StyledInput';
import { FormattedMessage } from 'react-intl';

const Tab = ({ active, children, setActive }) => (
  <Container
    bg={active ? 'white.full' : 'black.50'}
    color="black.700"
    cursor="pointer"
    px={4}
    py={3}
    textAlign="center"
    width={0.5}
    tabIndex={0}
    onClick={setActive}
    onKeyDown={event => event.key === 'Enter' && setActive(event)}
  >
    <P fontWeight={active ? '600' : 'normal'}>{children}</P>
  </Container>
);

const enhance = compose(
  withState('state', 'setState', ({ errors }) => ({ errors, tab: 'personal' })),
  withHandlers({
    getFieldError: ({ state, errors }) => name => (errors && errors[name]) || state.errors[name],
    onChange: ({ setState, onEmailChange }) => ({ target }) => {
      // Email state is not local so any changes should be handled seprately
      if (target.name === 'email') {
        onEmailChange(target.value);
        setState(state => ({
          ...state,
          errors: { ...state.errors, [target.name]: null },
        }));
      } else {
        setState(state => ({
          ...state,
          [target.name]: target.value,
          errors: { ...state.errors, [target.name]: null },
        }));
      }
    },
    onInvalid: ({ setState }) => event => {
      event.persist();
      event.preventDefault();
      setState(state => ({
        ...state,
        errors: { ...state.errors, [event.target.name]: event.target.validationMessage },
      }));
    },
  }),
  // follows composition of onChange && onInvalid to access them from props
  withHandlers({
    getFieldProps: ({ state, onChange, onInvalid }) => name => ({
      defaultValue: state[name] || '',
      fontSize: 'Paragraph',
      lineHeight: 'Paragraph',
      onChange,
      onInvalid,
      type: 'text',
      width: 1,
    }),
  }),
);

/**
 * Component for handling the creation of profiles, either personal or organizational
 */
const CreateProfile = enhance(
  ({
    getFieldError,
    getFieldProps,
    onPersonalSubmit,
    onOrgSubmit,
    onSecondaryAction,
    state,
    setState,
    submitting,
    email,
    ...props
  }) => (
    <StyledCard width={1} maxWidth={480} {...props}>
      <Flex>
        <Tab active={state.tab === 'personal'} setActive={() => setState({ ...state, tab: 'personal' })}>
          <FormattedMessage id="contribution.createPersoProfile" defaultMessage="Create Personal Profile" />
        </Tab>
        <Tab active={state.tab === 'organization'} setActive={() => setState({ ...state, tab: 'organization' })}>
          <FormattedMessage id="contribution.createOrgProfile" defaultMessage="Create Organization Profile" />
        </Tab>
      </Flex>

      {state.tab === 'personal' && (
        <Box
          as="form"
          p={4}
          onSubmit={event => {
            event.preventDefault();
            const data = pick(state, ['firstName', 'lastName']);
            onPersonalSubmit({ ...data, email });
          }}
          method="POST"
        >
          <Box mb={3}>
            <StyledInputField label="Email" htmlFor="email" error={getFieldError('email')}>
              {inputProps => (
                <StyledInput
                  {...inputProps}
                  {...getFieldProps(inputProps.name)}
                  type="email"
                  placeholder="i.e. yourname@yourhost.com"
                  value={email}
                  required
                />
              )}
            </StyledInputField>
          </Box>

          <Box mb={3}>
            <StyledInputField label="First Name" htmlFor="firstName" error={getFieldError('firstName')}>
              {inputProps => <StyledInput {...inputProps} {...getFieldProps(inputProps.name)} />}
            </StyledInputField>
          </Box>

          <Box mb={4}>
            <StyledInputField label="Last Name" htmlFor="lastName" error={getFieldError('lastName')}>
              {inputProps => <StyledInput {...inputProps} {...getFieldProps(inputProps.name)} />}
            </StyledInputField>
          </Box>

          <StyledButton
            buttonStyle="primary"
            disabled={!email}
            width={1}
            type="submit"
            fontWeight="600"
            loading={submitting}
          >
            <FormattedMessage id="contribution.createPersoProfile" defaultMessage="Create Personal Profile" />
          </StyledButton>
        </Box>
      )}

      {state.tab === 'organization' && (
        <Box
          as="form"
          p={4}
          onSubmit={event => {
            event.preventDefault();
            const data = pick(state, ['firstName', 'lastName', 'orgName', 'website', 'githubHandle', 'twitterHandle']);
            onOrgSubmit({ ...data, email });
          }}
          method="POST"
        >
          <P fontSize="LeadParagraph" lineHeight="LeadParagraph" color="black.600" mb={3} fontWeight="500">
            Your personal information
          </P>
          <Box mb={3}>
            <StyledInputField label="Email" htmlFor="email" error={getFieldError('email')}>
              {inputProps => (
                <StyledInput
                  {...inputProps}
                  {...getFieldProps(inputProps.name)}
                  type="email"
                  value={email}
                  placeholder="i.e. yourname@yourhost.com"
                  required
                />
              )}
            </StyledInputField>
          </Box>

          <Box mb={3}>
            <StyledInputField label="First Name" htmlFor="firstName" error={getFieldError('firstName')}>
              {inputProps => <StyledInput {...inputProps} {...getFieldProps(inputProps.name)} />}
            </StyledInputField>
          </Box>

          <Box mb={4}>
            <StyledInputField label="Last Name" htmlFor="lastName" error={getFieldError('lastName')}>
              {inputProps => <StyledInput {...inputProps} {...getFieldProps(inputProps.name)} />}
            </StyledInputField>
          </Box>

          <P fontSize="LeadParagraph" lineHeight="LeadParagraph" color="black.600" mb={3} fontWeight="500">
            Organization&apos;s information
          </P>
          <Box mb={3}>
            <StyledInputField label="Org Name" htmlFor="orgName" error={getFieldError('orgName')}>
              {inputProps => (
                <StyledInput
                  {...inputProps}
                  {...getFieldProps(inputProps.name)}
                  placeholder="i.e. AirBnb, Women Who Code"
                  required
                />
              )}
            </StyledInputField>
          </Box>

          <Box mb={3}>
            <StyledInputField label="Website" htmlFor="website" error={getFieldError('website')}>
              {inputProps => <StyledInput {...inputProps} {...getFieldProps(inputProps.name)} type="url" />}
            </StyledInputField>
          </Box>

          <Box mb={3}>
            <StyledInputField label="GitHub (optional)" htmlFor="githubHandle" error={getFieldError('githubHandle')}>
              {inputProps => (
                <StyledInputGroup {...inputProps} {...getFieldProps(inputProps.name)} prepend="github.com/" />
              )}
            </StyledInputField>
          </Box>

          <Box mb={4}>
            <StyledInputField label="Twitter (optional)" htmlFor="twitterHandle" error={getFieldError('twitterHandle')}>
              {inputProps => <StyledInputGroup {...inputProps} {...getFieldProps(inputProps.name)} prepend="@" />}
            </StyledInputField>
          </Box>

          <StyledButton
            buttonStyle="primary"
            disabled={!email || !state.orgName}
            width={1}
            type="submit"
            fontWeight="600"
            loading={submitting}
          >
            <FormattedMessage id="contribution.createOrgProfile" defaultMessage="Create Organization Profile" />
          </StyledButton>
        </Box>
      )}

      <Container alignItems="center" bg="black.50" display="flex" justifyContent="space-between" px={4} py={3}>
        <P color="black.700">Already have an account?</P>
        <StyledButton asLink fontSize="Paragraph" fontWeight="bold" onClick={onSecondaryAction} disabled={submitting}>
          <FormattedMessage id="signIn" defaultMessage="Sign In" />
        </StyledButton>
      </Container>
    </StyledCard>
  ),
);

CreateProfile.propTypes = {
  /** a map of errors to the matching field name, i.e. `{ email: 'Invalid email' }` will display that message until the email field */
  errors: PropTypes.objectOf(PropTypes.string),
  /** handles submissions of personal profile form */
  onPersonalSubmit: PropTypes.func.isRequired,
  /** handles submission of organization profile form */
  onOrgSubmit: PropTypes.func.isRequired,
  /** handles redirect from profile create, i.e. Sign In */
  onSecondaryAction: PropTypes.func.isRequired,
  /** Disable submit and show a spinner on button when set to true */
  submitting: PropTypes.bool,
  /** Set the value of email input */
  email: PropTypes.string.isRequired,
  /** handles changes in the email input */
  onEmailChange: PropTypes.func.isRequired,
  /** All props from `StyledCard` */
  ...StyledCard.propTypes,
};

CreateProfile.defaultProps = {
  errors: {},
  submitting: false,
};

export default CreateProfile;
