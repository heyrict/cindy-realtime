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

export class ModalWrapper extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  /* Change a component to modal.
   * props:
   * - header: String
   * - body: Component!
   * - footer: { close: bool, confirm: bool }
   *   body component should have a `confirm` function if confirm == true
   */
  // {{{ constructor
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }
  // }}}
  // {{{ render
  render() {
    var Body = this.props.body;
    return (
      <Modal show={this.state.show} onHide={this.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.header}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            <Body
              ref={instance => {
                this.childBody = instance;
              }}
            />
          }
        </Modal.Body>
        <Modal.Footer>
          {this.props.footer.confirm ? (
            <Button onClick={this.handleConfirm}>{gettext("Confirm")}</Button>
          ) : null}
          {this.props.footer.close ? (
            <Button onClick={this.hideModal}>{gettext("Close")}</Button>
          ) : null}
        </Modal.Footer>
      </Modal>
    );
  }
  // }}}
  // {{{ showModal
  showModal(e) {
    this.setState({ show: true });
  }
  // }}}
  // {{{ hideModal
  hideModal(e) {
    this.setState({ show: false });
  }
  // }}}
  // {{{ handleConfirm
  handleConfirm() {
    this.childBody.confirm();
  }
  // }}}
}

ModalWrapper.propTypes = {
  body: PropTypes.any.isRequired,
  header: PropTypes.node.isRequired,
  footer: PropTypes.shape({
    confirm: PropTypes.bool,
    close: PropTypes.bool
  })
};

export default ModalWrapper;
