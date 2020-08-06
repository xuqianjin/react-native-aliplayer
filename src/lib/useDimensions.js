import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const dWindow = Dimensions.get('window');
const dScreen = Dimensions.get('screen');

const isOrientationLandscape = ({ width, height }) => width >= height;

export default function useDimensions() {
  const [dimensions, setDimensions] = useState({
    window: {
      width: dWindow.width,
      height: dWindow.height,
    },
    screen: {
      height: isOrientationLandscape(dWindow) ? dScreen.width : dScreen.height,
      width: isOrientationLandscape(dWindow) ? dScreen.height : dScreen.width,
    },
  });

  const onChange = ({ window, screen }) => {
    setDimensions({
      window: {
        width: window.width,
        height: window.height,
      },
      screen: {
        height: isOrientationLandscape(window) ? screen.width : screen.height,
        width: isOrientationLandscape(window) ? screen.height : screen.width,
      },
    });
  };

  useEffect(() => {
    Dimensions.addEventListener('change', onChange);

    return () => Dimensions.removeEventListener('change', onChange);
  }, []);

  return dimensions;
}
