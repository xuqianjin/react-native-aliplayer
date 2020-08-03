import React from 'react';
import { Icon } from 'react-native-elements';

function ControlIcon({ ...props }) {
  return <Icon type="antdesign" color="white" size={20} underlayColor="transparent" {...props} />;
}

export default ControlIcon;
