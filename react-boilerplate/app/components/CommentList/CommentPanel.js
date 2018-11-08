import React from 'react';
import PropTypes from 'prop-types';
import { easing, tween } from 'popmotion';
import { from_global_id as f, withLocale } from 'common';
import { FormattedMessage } from 'react-intl';
import posed from 'react-pose';

import { Box } from 'rebass';
import { ImgXs as Img, RouterLink } from 'style-store';
import chevronYLeft from 'images/chevron-yellowgreen-left.svg';
import chevronYRight from 'images/chevron-yellowgreen-right.svg';
import chevronOLeft from 'images/chevron-orange-left.svg';
import chevronORight from 'images/chevron-orange-right.svg';
import UserLabel from 'components/UserLabel';

import messages from './messages';

const CommentContent = posed.div({
  on: {
    left: 0,
    transition: (props) =>
      tween({
        ...props,
        duration: 300,
        ease: easing.anticipate,
      }),
  },
  off: {
    left: 'calc(100% - 25px)',
    transition: (props) =>
      tween({
        ...props,
        duration: 300,
        ease: easing.easeInOut,
      }),
  },
  initialPose: 'off',
});

class CommentPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      on: false,
    };
  }
  render() {
    const { node } = this.props;

    let currentArrow;
    if (this.state.on && node.spoiler) {
      currentArrow = <Img alt="detail" src={chevronORight} />;
    } else if (this.state.on && !node.spoiler) {
      currentArrow = <Img alt="detail" src={chevronYRight} />;
    } else if (!this.state.on && node.spoiler) {
      currentArrow = <Img alt="detail" src={chevronOLeft} />;
    } else {
      currentArrow = <Img alt="detail" src={chevronYLeft} />;
    }

    return (
      <Box
        bg="blanchedalmond"
        style={{
          overflow: 'hidden',
          position: 'relative',
          border: '2px solid burlywood',
        }}
      >
        <Box
          w="calc(100% - 25px)"
          p={2}
          color="darksoil"
          style={{
            position: 'absolute',
            zIndex: 20,
            top: 0,
            width: '100%',
            height: '100%',
            overflowY: 'auto',
          }}
        >
          <FormattedMessage
            {...messages[this.props.hintMessageId || 'commentDescribe']}
            values={{
              user: <UserLabel user={node.user} />,
              puzzle_user: <UserLabel user={node.puzzle.user} />,
              puzzle_title: (
                <RouterLink
                  to={withLocale(`/puzzle/show/${f(node.puzzle.id)[1]}`)}
                  style={{ color: 'sienna', fontWeight: 'bold' }}
                >
                  {node.puzzle.title}
                </RouterLink>
              ),
            }}
          />
          {node.spoiler && (
            <Box is="span" color="red">
              <FormattedMessage {...messages.commentSpoiler} />
            </Box>
          )}
        </Box>
        <CommentContent
          pose={this.state.on ? 'on' : 'off'}
          style={{
            display: 'flex',
            position: 'relative',
            zIndex: 30,
            minHeight: '60px',
          }}
        >
          <button
            style={{
              display: 'inline-block',
              float: 'right',
            }}
            onClick={() => this.setState(({ on }) => ({ on: !on }))}
          >
            {currentArrow}
          </button>
          <Box
            w={1}
            bg={node.spoiler ? 'orange' : 'yellowgreen'}
            p={2}
            color="blanchedalmond"
          >
            {node.content}
            <div style={{ float: 'right' }}>
              ——<UserLabel user={node.user} color="blanchedalmond" />
            </div>
          </Box>
        </CommentContent>
      </Box>
    );
  }
}

CommentPanel.propTypes = {
  node: PropTypes.object.isRequired,
  hintMessageId: PropTypes.string,
};

export default CommentPanel;
