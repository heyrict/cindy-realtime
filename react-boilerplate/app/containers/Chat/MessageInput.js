import styled from 'styled-components';
import Textarea from 'react-textarea-autosize';

const MessageInput = styled(Textarea)`
  border-radius: 10px 0 0 10px;
  border-color: #2075c7;
  color: #073642;
  font-size: 1.1em;
  margin: 0;
  min-height: 36px;
  max-height: 100px;
  padding: 5px;
  width: 100%;
  box-shadow: inset 0 0 0 1px #2075c7;
  &:focus {
    box-shadow: inset 0 0 0 2px #2075c7;
  }
`;

export default MessageInput;
