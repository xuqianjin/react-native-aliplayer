import React from 'react';
import { TouchableOpacity } from 'react-native';

function PressView({ children, ...props }) {
  return (
    <TouchableOpacity activeOpacity={0.8} {...props}>
      {children}
    </TouchableOpacity>
  );
}

export default PressView;
