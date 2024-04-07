import React from 'react';

type EnhancedChildren<T> = React.ReactNode | ((params: T) => React.ReactNode);

function enhanceChildren<T>(children: EnhancedChildren<T>, params: T): React.ReactNode {
  if (typeof children !== 'function') return children;
  return children(params);
}

export default enhanceChildren;
export type { EnhancedChildren };
