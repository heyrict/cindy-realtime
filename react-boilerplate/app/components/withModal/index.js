/**
 *
 * ModalWrapper
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { intlShape } from 'react-intl';

import { Button } from 'style-store';

import messages from './messages';
import Modal from './Modal';

const StyledButton = Button.extend`
  padding: 10px;
  border-radius: 5px;
  margin: 0 5px;
`;

const HeaderCloseBtn = styled.button`
  font-size: 0.8em;
  float: right;
`;

const ModalHeader = styled.div`
  background: #c6b571;
  border-radius: 5px 5px 0 0;
  font-size: 1.6em;
  padding: 10px 20px;
`;

const ModalBody = styled.div`
  padding: 10px 20px;
`;

const ModalFooter = styled.div`
  border-top: 2px solid #c6b571;
  padding: 5px 10px;
  text-align: right;
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
        const _ = this.context.intl.formatMessage;
        return (
          <Modal
            show={this.props.show}
            onHide={this.props.onHide}
            bsSize="large"
          >
            {header && (
              <ModalHeader>
                {header}
                <HeaderCloseBtn onClick={this.props.onHide}>x</HeaderCloseBtn>
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
                      ? _(messages.confirm)
                      : footer.confirm}
                  </StyledButton>
                ) : null}
                {footer.close ? (
                  <StyledButton onClick={this.props.onHide}>
                    {footer.close === true ? _(messages.close) : footer.close}
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

    withModalWrapper.contextTypes = {
      intl: intlShape,
    };

    return withModalWrapper;
  };
}

export default withModal;
