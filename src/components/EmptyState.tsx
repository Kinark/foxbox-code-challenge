import React, {ComponentType} from 'react';
import {TextInputProps} from 'react-native';
import styled from 'styled-components/native';

import BlankState from '../images/blankState.svg';

export default () => (
  <Wrapper>
    <SVGWrapper>
      <BlankState />
    </SVGWrapper>
    <Info>Oops, nothing found.</Info>
  </Wrapper>
);

const Wrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const SVGWrapper = styled.View`
  height: 300px;
  width: 300px;
`;

const Info = styled.Text`
  margin-top: 10px;
  font-size: 16px;
  color: white;
  text-align: center;
`;
