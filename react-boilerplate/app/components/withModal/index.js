/**
 *
 * ModalWrapper
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { Button, Modal } from "react-bootstrap";

export const withModal = ({ header, footer }) => Wrapped =>
  // eslint-disable-line react/prefer-stateless-function
  /* Change a component to modal.
   * props:
   * - header: String
   * - body: Component!
   * - footer: { close: string or bool, confirm: string or bool }
   *   body component should have a `confirm` function if confirm == true
   */
  class extends React.PureComponent {
    constructor(props) {
      super(props);
      this.handleConfirm = this.handleConfirm.bind(this);
    }
    // {{{ render
    render() {
      return (
        <Modal show={this.props.show} onHide={this.props.onHide}>
          <Modal.Header closeButton>
            <Modal.Title>{header}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapped
              ref={instance => {
                this.childBody = instance;
              }}
              {...this.props}
            />
          </Modal.Body>
          <Modal.Footer>
            {footer.confirm ? (
              <Button onClick={this.handleConfirm}>
                {footer.confirm === true ? gettext("Confirm") : footer.confirm}
              </Button>
            ) : null}
            {footer.close ? (
              <Button onClick={this.props.onHide}>
                {footer.close === true ? gettext("Close") : footer.close}
              </Button>
            ) : null}
          </Modal.Footer>
        </Modal>
      );
    }
    // }}}
    // {{{ handleConfirm
    handleConfirm() {
      this.childBody.confirm();
    }
    // }}}
  };

export default withModal;
