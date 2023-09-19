import * as react from 'react';

export const navigationref = react.createRef();

export function navigate(name, params) {
  navigationref.current?.navigate(name, params);
}