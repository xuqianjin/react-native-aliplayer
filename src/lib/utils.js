export const formatTime = (time) => {
  const S = ('00' + (time % 60)).slice(-2);
  const M = ('00' + parseInt(time / 60)).slice(-2);
  return { M, S };
};
