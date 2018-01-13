import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Flex } from 'rebass';

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
`;

export const ImgMd = ImgSm.extend`
  max-height: 60px;
`;
