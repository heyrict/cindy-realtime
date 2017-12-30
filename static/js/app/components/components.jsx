// {{{1 Imports
import * as React from "react";
import {
  Button,
  ButtonToolbar,
  Col,
  ControlLabel,
  FormGroup,
  FormControl,
  Modal,
  Panel,
  Popover,
  OverlayTrigger
} from "react-bootstrap";
import { createFragmentContainer } from "react-relay";
import { Link } from "react-router-dom";
import jQuery from "jquery";
import common from "../common";

// {{{1 function StatusLabel(props)
export function StatusLabel(props) {
  var baseClass = "status_label " + props.extClass;
  return <div className={baseClass}>{props.content}</div>;
}

// {{{1 class MondaiStatusLable
export class MondaiStatusLable extends React.Component {
  render() {
    const status = this.props.status;
    const status_class = common.status_class_dict[status];
    const status_color = common.status_color_dict[status];
    const translatedStatus = common.status_code_dict[status];
    return (
      <StatusLabel
        extClass={status_class}
        color={status_color}
        content={translatedStatus}
      />
    );
  }
}

// {{{1 function ProcessLabel(props)
export function ProcessLabel(props) {
  var baseClass = "process_label " + props.extClass;
  return <div className={baseClass}>{props.content}</div>;
}

// {{{1 class MondaiProcessLabel
export class MondaiProcessLabel extends React.Component {
  render() {
    const qCount = this.props.qCount;
    const uaCount = this.props.uaCount;
    const content = uaCount + "/" + qCount;
    if (uaCount == 0) {
      return <ProcessLabel extClass="answered" content={content} />;
    } else {
      return <ProcessLabel extClass="unanswered" content={content} />;
    }
  }
}

// {{{1 class MondaiTitleLabel
export class MondaiTitleLabel extends React.Component {
  render() {
    const translatedGenre = common.genre_code_dict[this.props.genre];
    return (
      <span className="title_label">
        <span className="glyphicon glyphicon-chevron-right visible-xs-inline" />
        <Link to={common.urls.mondai_show(this.props.mondaiId)}>
          {`[${translatedGenre}] ${this.props.title}`}
        </Link>
      </span>
    );
  }
}

// {{{1 class MondaiScoreLabel
export class MondaiScoreLabel extends React.Component {
  render() {
    var scale_one = num => Math.floor(num * 10) / 10;
    const starCount = this.props.starCount,
      starSum = this.props.starSum;
    if (starCount > 0) {
      return (
        <span className="mondai_score">
          {"✯" + starSum + "(" + starCount + ")"}
        </span>
      );
    } else {
      return "";
    }
  }
}
// {{{1 class MondaiGiverLabel
export class MondaiGiverLabel extends React.Component {
  render() {
    const user = this.props.user;
    return (
      <span>
        <Link to={common.urls.profile(user.rowid)}>{user.nickname}</Link>
        <UserAwardPopover userAward={user.currentAward} />
      </span>
    );
  }
}

// {{{1 class MondaiCreatedLabel
export class MondaiCreatedLabel extends React.Component {
  render() {
    const time = this.props.time;
    return (
      <font color="#888">
        [{gettext("created")}:{moment(time).calendar()}]
      </font>
    );
  }
}

// {{{1 class UserAwardPopover
export class UserAwardPopover extends React.Component {
  render() {
    const ua = this.props.userAward;
    if (!ua) {
      return null;
    } else {
      const popoverAward = (
        <Popover id={ua.id} title={ua.award.name}>
          {ua.award.description}
          <br />
          <span className="pull-right" style={{ color:"#ff582b", fontWeight:"bold"}}>
            🏆{ua.created}
          </span>
        </Popover>
      );
      return (
        <OverlayTrigger placement="top" trigger="focus" overlay={popoverAward}>
          <a
            href="javascript:void(0);"
            role="button"
            style={{ color: "black" }}
          >
            [{ua.award.name}]
          </a>
        </OverlayTrigger>
      );
    }
  }

  togglePopover() {
    this.setState((prevState, props) => ({
      show: !prevState.show
    }));
  }
}

// {{{1 function MarkdownEditorContainer
export function MarkdownEditorContainer(props) {
  return <FormControl {...props} componentClass="textarea" />;
}

// {{{1 function MarkdownPreviewerContainer
export class MarkdownPreviewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };

    this.togglePreview = this.togglePreview.bind(this);
  }

  render() {
    return (
      <div>
        <Button onClick={this.togglePreview} block>
          {this.state.open ? gettext("Hide Preview") : gettext("Show Preview")}
        </Button>
        <Panel collapsible expanded={this.state.open}>
          <div
            dangerouslySetInnerHTML={{
              __html: common.text2md(this.props.content)
            }}
          />
        </Panel>
      </div>
    );
  }

  togglePreview(e) {
    this.setState((prevState, props) => ({
      open: !prevState.open
    }));
  }
}

// {{{1 function PreviewEditor
export class PreviewEditor extends React.Component {
  render() {
    return (
      <div>
        <MarkdownEditorContainer
          value={this.props.content}
          onChange={this.props.onChange}
          style={{ minHeight: "200px" }}
        />
        <MarkdownPreviewer content={this.props.content} />
      </div>
    );
  }
}

// {{{1 function FieldGroup
export function FieldGroup({ id, label, help, Ctl, ...props }) {
  return (
    <FormGroup controlId={id}>
      {help && <HelpBlock>{help}</HelpBlock>}
      <Col componentClass={ControlLabel} xs={2}>
        {label}
      </Col>
      <Col xs={10}>
        <Ctl {...props} />
      </Col>
    </FormGroup>
  );
}
// {{{1 class ModalContainer
export class ModalContainer extends React.Component {
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
// {{{1 const ComponentsFragmentUserLabel
export const ComponentsFragmentUserLabel = createFragmentContainer(MondaiGiverLabel, {
  user: graphql`
    fragment components_user on UserNode {
      rowid
      nickname
      currentAward {
        id
        created
        award {
          id
          name
          description
        }
      }
    }
  `
});
