/* eslint-disable indent */

import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ReactTextareaAutosize from 'react-textarea-autosize';
import ReactDatePicker from 'react-datepicker';
import {
  Flex,
  Button as RebassButton,
  ButtonOutline as RebassButtonOutline,
  Switch as RebassSwitch,
  Panel as RebassPanel,
  NavLink as RebassNavLink,
} from 'rebass';

const formatScalar = (value, defaultValue) => {
  const def = defaultValue || 'auto';
  if (value) {
    if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'number') {
      return `${value * 100}%`;
    }
  }
  return def;
};

export const AutoResizeTextarea = styled(ReactTextareaAutosize)`
  border-radius: 10px;
  border: 1px solid #2075c7;
  color: #073642;
  font-size: 1.1em;
  margin: 0;
  padding: 5px;
  width: 100%;
`;

export const DatePicker = styled(ReactDatePicker)`
  border-radius: 10px;
  border: 1px solid ${({ valid }) => (valid === 'error' ? 'tomato' : '#2075c7')};
  padding: 5px;
  width: 100%;
  color: #073642;
  font-size: 1.1em;
`;

export const Navbar = styled(Flex)`
  top: 0;
  background-color: #c6b571;
  z-index: 1030;
  position: fixed;
  min-height: 50px;
`;

export const SubNavbar = styled(Flex)`
  top: 50px;
  background-color: #d7c682;
  padding: 0 8px;
  z-index: 1029;
`;

export const RouterLink = styled(Link)`
  color: #002731;
`;

export const ImgSm = styled.img`
  max-height: 2.1em;
  min-height: 0.8em;
  padding: 0;
  margin: 0;
`;

export const ImgXs = styled.img`
  max-height: 1.4em;
  min-height: 0.5em;
  padding: 0;
  margin: 0;
`;

export const ImgMd = styled.img`
  max-height: 4em;
  min-height: 1em;
  padding: 0;
  margin: 0;
`;

export const Star = styled.div`
  position: relative;
  width: 1em;
  height: 1em;
  color: ${(props) => (props.checked ? 'orange' : 'rgba(0, 0, 0, 0.125)')};
  &::after {
    display: ${(props) => (props.half ? 'block' : 'none')},
    content: '★',
    position: absolute,
    left: 0,
    top: 0,
    width: 1em,
    height: 1em,
    clip: rect(0, .45em, 1em, 0)
  }
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
  display: inline-block;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  width: ${(props) => formatScalar(props.w, 'auto')};
  cursor: pointer;
  &:hover {
    color: blanchedalmond;
  }
`;

Button.defaultProps = {
  bg: 'cyan',
  color: 'white',
};

export const ButtonOutline = styled(RebassButtonOutline)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  width: ${(props) => formatScalar(props.w, 'auto')};
  cursor: pointer;
  &:hover {
    color: ${(props) =>
      props.bg && props.theme
        ? props.theme.colors[props.bg] || props.bg
        : 'blanchedalmond'};
    background-color: ${(props) =>
      props.color && props.theme
        ? props.theme.colors[props.color] || props.color
        : '#2075c7'};
  }
`;

ButtonOutline.defaultProps = {
  color: 'cyan',
  border: '2px solid #2075c7',
  borderRadius: 10,
};

export const WarningBtn = styled(ButtonOutline)`
  color: tomato;
  width: 100%;
  border: 2px solid tomato;
  &:hover {
    background-color: tomato;
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
`;

export const Input = styled.input`
  border-radius: 10px;
  min-width: 200px;
  border: 1px solid ${({ valid }) => (valid === 'error' ? 'tomato' : '#2075c7')};
  padding: 5px;
  width: 100%;
  color: #073642;
  font-size: 1.1em;
`;

export const EditButton = styled(ButtonOutline)`
  padding: 5px 10px;
  margin: 0 5px;
  width: auto;
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

export const NavLink = styled(RebassNavLink)`
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
