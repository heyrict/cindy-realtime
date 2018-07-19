/**
 *
 * ScheduleAddForm
 *
 */

/* eslint-disable react/jsx-indent */

import 'datepicker-custom.css';

import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as yup from 'yup';
import FieldGroup from 'components/FieldGroup';
import { DatePicker, ButtonOutline, Input } from 'style-store';
import moment from 'moment';

import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';

import { graphql } from 'react-apollo';
import ScheduleListQuery from 'graphql/ScheduleList';

import { nAlert } from 'containers/Notifier/actions';
import { withModal } from 'components/withModal';
import ScheduleAddFormMutation from 'graphql/ScheduleAddFormMutation';
import modalMessages from 'components/withModal/messages';
import messages from './messages';

const innerScheduleAddForm = ({
  values,
  errors,
  touched,
  handleBlur,
  handleChange,
  setFieldValue,
  handleSubmit,
  isSubmitting,
}) => (
  <form onSubmit={handleSubmit}>
    <FieldGroup
      Ctl={DatePicker}
      id="formScheduleAddScheduled"
      label={<FormattedMessage {...messages.scheduled} />}
      name="scheduled"
      onBlur={handleBlur}
      onChange={(v) => setFieldValue('scheduled', v)}
      selected={values.scheduled}
      minDate={moment()}
      maxDate={moment().add(3, 'months')}
      showTimeSelect
      dateFormat="lll"
      timeFormat="HH:mm"
      timeIntervals={15}
    />
    <FieldGroup
      Ctl={Input}
      id="formScheduleAddContent"
      label={<FormattedMessage {...messages.content} />}
      name="content"
      onBlur={handleBlur}
      onChange={handleChange}
      valid={touched.content && errors.content ? 'error' : null}
      value={values.content}
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

innerScheduleAddForm.propTypes = {
  values: PropTypes.shape({
    scheduled: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }),
  errors: PropTypes.shape({
    scheduled: PropTypes.string,
    content: PropTypes.string,
  }),
  touched: PropTypes.shape({
    scheduled: PropTypes.bool,
    content: PropTypes.bool,
  }),
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

const scheduleAddFormSchema = yup.object().shape({
  scheduled: yup.date().required(),
  content: yup.string().required(),
});

export const ScheduleAddForm = (props) => (
  <Formik
    initialValues={{
      scheduled: moment(),
      content: '',
    }}
    validationSchema={scheduleAddFormSchema}
    render={innerScheduleAddForm}
    onSubmit={(values, { setSubmitting }) => {
      props
        .mutate({
          variables: { input: values },
          update: (
            proxy,
            {
              data: {
                createSchedule: { schedule },
              },
            }
          ) => {
            let update = false;
            const data = proxy.readQuery({ query: ScheduleListQuery });
            const responseData = {
              __typename: 'ScheduleNodeEdge',
              node: schedule,
            };
            data.allSchedules.edges = data.allSchedules.edges.map((edge) => {
              if (edge.node.id === schedule.id) {
                update = true;
                return responseData;
              }
              return edge;
            });
            if (!update) {
              data.allSchedules.edges.push(responseData);
            }
            data.allSchedules.edges.sort(
              (edge1, edge2) =>
                moment(edge1.node.scheduled) - moment(edge2.node.scheduled)
            );
            console.log(data);
            proxy.writeQuery({ query: ScheduleListQuery, data });
          },
        })
        .then(() => {
          setSubmitting(false);
          props.onHide();
        })
        .catch((error) => {
          props.alert(error.message);
          setSubmitting(false);
        });
    }}
  />
);

ScheduleAddForm.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  mutate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  onHide: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(
  null,
  mapDispatchToProps
);

const withScheduleAdd = graphql(ScheduleAddFormMutation);

export default compose(
  withScheduleAdd,
  withConnect,
  withModal({
    header: 'Add Schedule',
    footer: {
      close: true,
    },
  })
)(ScheduleAddForm);
