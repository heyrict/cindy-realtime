/**
 *
 * PuzzlePage AddPuzzleBtn
 *
 */

import React from 'react';
import styled from 'styled-components';
import { RouterLink, ImgSm } from 'style-store';
import { withLocale } from 'common';

import plusIcon from 'images/plus.svg';
import { ButtonCircle } from 'rebass';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

const BtnMsg = styled.b`
  font-size: 1em;
  color: #859900;
`;

class AddPuzzleBtn extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tip: false,
    };
  }

  render() {
    return (
      <RouterLink to={withLocale('/puzzle/add')}>
        <ButtonCircle
          bg="transparent"
          px={5}
          py={5}
          style={{ minHeight: '40px' }}
          onMouseEnter={() => this.setState({ tip: true })}
          onMouseLeave={() => this.setState({ tip: false })}
        >
          {this.state.tip ? (
            <BtnMsg>
              <FormattedMessage {...messages.addPuzzle} />
            </BtnMsg>
          ) : (
            <ImgSm src={plusIcon} alt="add puzzle" />
          )}
        </ButtonCircle>
      </RouterLink>
    );
  }
}

export default AddPuzzleBtn;
