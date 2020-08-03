import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  text: {
    color: 'white',
    marginLeft: 5,
    paddingHorizontal: 10,
    fontSize: 18,
  },
});
function ChooseList({ data = [], themeColor, defaultValue, onChange }) {
  const [value, setValue] = useState(defaultValue);

  const renderItem = (item) => {
    const isSelect = item.value === value;
    const selectStyle = {
      color: themeColor,
    };
    const handlePress = () => {
      if (value !== item.value) {
        setValue(item.value);
        onChange(item);
      }
    };
    return (
      <Text key={item.value} style={[styles.text, isSelect && selectStyle]} onPress={handlePress}>
        {item.label}
      </Text>
    );
  };

  return <View style={styles.row}>{data.map(renderItem)}</View>;
}
export default ChooseList;
