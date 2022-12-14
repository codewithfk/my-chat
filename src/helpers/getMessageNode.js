export const getMessageNode = ({ myId, otherId }) => {
  let mn = myId > otherId ? `${myId}-${otherId}` : `${otherId}-${myId}`;
  return mn;
};
