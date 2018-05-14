import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ReactTextareaAutosize from 'react-textarea-autosize';
import {
  Flex,
  Button as RebassButton,
  ButtonOutline as RebassButtonOutline,
  Star as RebassStar,
  Switch as RebassSwitch,
  Panel as RebassPanel,
} from 'rebass';

export const AutoResizeTextarea = styled(ReactTextareaAutosize)`
  border-radius: 10px;
  border: 1px solid #2075c7;
  color: #073642;
  font-size: 1.1em;
  margin: 0;
  max-height: 120px;
  padding: 5px;
  width: 100%;
  &:focus {
    border: 2px solid #2075c7;
  }
`;

const NavbarBase = styled(Flex)`
  min-height: 50px;
  margin-bottom: 20px;
  position: fixed;
  left: 0;
  right: 0;
  border-radius: 0;
`;

export const Navbar = NavbarBase.extend`
  top: 0;
  border-color: #e7e7e7;
  background-color: #c6b571;
  z-index: 1030;
`;

export const SubNavbar = NavbarBase.extend`
  border-color: #e7e7e7;
  background-color: #d7c682;
  padding: 0 8px;
  z-index: 1029;
`;

export const RouterLink = styled(Link)`
  color: #002731;
`;

export const ImgSm = styled.img`
  max-height: 30px;
  padding: 0;
  margin: 0;
`;

export const ImgXs = styled.img`
  max-height: 18px;
  padding: 0;
  margin: 0;
`;

export const ImgMd = styled.img`
  max-height: 60px;
  padding: 0;
  margin: 0;
`;

export const Star = styled(RebassStar)`
  color: ${(props) =>
    props.checked ? props.color || 'orange' : 'rgba(0, 0, 0, 0.125)'};
`;

export const LightNicknameLink = styled(Link)`
  font-size: 1.3em;
  color: chocolate;
  word-break: break-all;
  word-wrap: break-word;
`;

export const DarkNicknameLink = styled(Link)`
  font-size: 1em;
  color: #006388;
  margin: 5px;
  word-break: break-all;
  word-wrap: break-word;
`;

export const Time = styled.span`
  font-size: 0.8em;
  color: gray;
  margin: 5px;
`;

export const Splitter = styled.hr`
  border-top: 1px solid #006388;
  margin: 5px 0;
  width: 100%;
`;

export const Indexer = styled.span`
  background-color: #006388;
  color: #fce6d3;
  font-weight: bold;
  padding: 2px;
  min-width: 24px;
  border-radius: 100px;
`;

export const Heading = styled.div`
  font-size: 3em;
  color: chocolate;
  margin-left: 0.5em;
  margin-top: 0;
  margin-bottom: 0.5em;
  padding-top: 0.5em;
`;

export const Button = styled(RebassButton)`
  border-radius: 10px;
  color: blanchedalmond;
  background-color: #2075c7;
  font-weight: bold;
  &:hover {
    color: blanchedalmond;
    background-color: #2075c7;
  }
`;

export const ButtonOutline = styled(RebassButtonOutline)`
  border-radius: 10px;
  color: #2075c7;
  font-weight: bold;
  &:hover {
    color: blanchedalmond;
    background-color: #2075c7;
  }
`;

export const Select = styled.select`
  border-radius: 10px;
  border: 1px solid #2075c7;
  background-color: rgba(255, 255, 255, 60);
  padding: 5px;
  width: 100%;
  color: #073642;
  font-size: 1.1em;
  &:focus {
    border: 2px solid #2075c7;
  }
`;

export const Input = styled.input`
  border-radius: 10px;
  border: 1px solid #2075c7;
  padding: 5px;
  width: 100%;
  color: #073642;
  font-size: 1.1em;
  &:focus {
    border: 2px solid #2075c7;
  }
`;

export const EditButton = ButtonOutline.extend`
  padding: 5px 10px;
  margin: 0 5px;
`;

export const PuzzleFrame = styled.div`
  border-radius: 10px;
  border: 2px solid #006388;
  padding: 5px;
  margin-bottom: 10px;
  background-color: rgba(255, 255, 255, 0.5);
`;

export const Textarea = styled.textarea`
  border-radius: 10px;
  border: 1px solid #2075c7;
  margin-bottom: 5px;
  padding: 5px;
  width: 100%;
  min-height: 75px;
  color: #073642;
  font-size: 1.1em;
  &:focus {
    border: 2px solid #2075c7;
  }
`;

export const RoundedPanel = styled(RebassPanel)`
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.382);
`;

export const Switch = styled(RebassSwitch)`
  color: #2075c7;
  margin: 2px 5px;
  background-color: ${(props) => (props.checked ? '#2075C7' : 'transparent')};
  select: {
    padding: 10px;
  }
  &::after {
    background-color: ${(props) =>
      props.checked ? 'blanchedalmond' : '#2075C7'};
  }
`;
