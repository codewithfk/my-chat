import React from 'react';

export function useHover(styleOnHover, styleOnNotHover = {}) {
  const [style, setStyle] = React.useState(styleOnNotHover);

  const onMouseEnter = () => setStyle(styleOnHover);
  const onMouseLeave = () => setStyle(styleOnNotHover);

  return { style, onMouseEnter, onMouseLeave };
}
