import { v4 } from 'uuid';

export const getProcessId = (prefix?: string) => {
  return prefix ? `${prefix}-${v4()}` : v4();
};

export const stringifyForLog = (value: unknown) => {
  try {
    return JSON.stringify(value);
  } catch {
    return '[Unserializable value]';
  }
};
