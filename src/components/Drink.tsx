import React from 'react';
import styled from 'styled-components/native';

const PHOTO_SIZE = 85;
const PHOTO_BR = 20;

export default ({photo, name}) => (
  <Wrapper>
    <PhotoWrapper>
      <Photo source={{uri: photo}} />
      <PhotoShadow />
    </PhotoWrapper>
    <InfoWrapper>
      <Title>{name}</Title>
      <Description>The drink of the century.</Description>
    </InfoWrapper>
  </Wrapper>
);

const Wrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
  padding-left: 17px;
`;

const PhotoWrapper = styled.View`
  position: relative;
  margin-right: 16px;
`;
const Photo = styled.Image`
  height: ${PHOTO_SIZE}px;
  width: ${PHOTO_SIZE}px;
  border-radius: ${PHOTO_BR}px;
`;
const PhotoShadow = styled.View`
  position: absolute;
  z-index: -1;
  height: ${PHOTO_SIZE}px;
  width: ${PHOTO_SIZE}px;
  border-radius: ${PHOTO_BR}px;
  background-color: #262626;
  top: 17px;
  left: -17px;
`;

const InfoWrapper = styled.View`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: white;
`;
const Description = styled.Text`
font-size: 18px
   color: white;
`;
