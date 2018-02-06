/**
 *
 * ModalWrapper
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Modal } from 'react-bootstrap';
import { Button } from 'style-store';

const StyledButton = Button.extend`
  padding: 10px;
  border-radius: 5px;
  margin: 0 5px;
`;

const ModalBody = styled(Modal.Body)`
  background-color: #d7c682;
  overflow: auto;
`;

const ModalHeader = styled(Modal.Header)`
  background-color: #c6b571;
  border-bottom: 1px solid #c6b571 !important;
`;

const ModalFooter = styled(Modal.Footer)`
  background-color: #d7c682;
  border-top: 1px solid #c6b571 !important;
`;

/* eslint-disable no-undef */

export function withModal(p) {
  const header = p.header;
  const footer = p.footer;
  return (Wrapped) => {
    /* Change a component to modal.
   * props:
   * - header: String
   * - body: Component!
   * - footer: { close: string or bool, confirm: string or bool }
   *   body component should have a `confirm` function if confirm == true
   */
    class withModalWrapper extends React.PureComponent {
      constructor(props) {
        super(props);
        this.handleConfirm = this.handleConfirm.bind(this);
      }
      // {{{ handleConfirm
      handleConfirm() {
        this.childBody.confirm();
      }
      // }}}
      // {{{ render
      render() {
        return (
          <Modal
            show={this.props.show}
            onHide={this.props.onHide}
            bsSize="large"
          >
            {header && (
              <ModalHeader closeButton>
                <Modal.Title>{header}</Modal.Title>
              </ModalHeader>
            )}
            <ModalBody>
              <Wrapped
                ref={(instance) => {
                  this.childBody = instance;
                }}
                {...this.props}
              />
            </ModalBody>
            {footer && (
              <ModalFooter>
                {footer.confirm ? (
                  <StyledButton onClick={this.handleConfirm}>
                    {footer.confirm === true
                      ? gettext('Confirm')
                      : footer.confirm}
                  </StyledButton>
                ) : null}
                {footer.close ? (
                  <StyledButton onClick={this.props.onHide}>
                    {footer.close === true ? gettext('Close') : footer.close}
                  </StyledButton>
                ) : null}
              </ModalFooter>
            )}
          </Modal>
        );
      }
      // }}}
    }

    withModalWrapper.propTypes = {
      show: PropTypes.bool.isRequired,
      onHide: PropTypes.func.isRequired,
    };

    return withModalWrapper;
  };
}

export default withModal;
