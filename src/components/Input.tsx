import React, {ComponentType} from 'react';
import {TextInputProps} from 'react-native';
import styled from 'styled-components/native';

export interface InputProps extends TextInputProps {
  icon?: ComponentType<any>;
}

export default React.forwardRef(({icon: Icon, ...rest}: InputProps, ref) => (
  <SearchWrapper>
    {!!Icon && <Icon />}
    <SearchInput ref={ref} {...rest} />
    {!!Icon && (
      <HiddenIcon>
        <Icon />
      </HiddenIcon>
    )}
  </SearchWrapper>
));

const HiddenIcon = styled.View`
  opacity: 0;
`;

const SearchWrapper = styled.View`
  background-color: #262626;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 10px;
`;

const SearchInput = styled.TextInput.attrs({
  placeholderTextColor: '#939393',
})`
  flex: 1;
  color: white;
  text-align: center;
  height: 45px;
`;
