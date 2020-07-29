import { useEffect, useRef } from 'react';
/**
 * 仅更新时执行
 * Idea stolen from: https://stackoverflow.com/a/55075818/1526448
 * @param {Function} effect
 * @param {Array<any>} dependencies
 */
function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      effect();
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
}

export default useUpdateEffect;
