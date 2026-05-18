const BLOCKED_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !BLOCKED_KEYS.has(key))
        .map(([key, item]) => [key, sanitizeValue(item)]),
    );
  }

  if (typeof value === 'string') {
    return value.replaceAll('\0', '').trim();
  }

  return value;
};

export const sanitizeRequest = (req, res, next) => {
  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query);
  req.params = sanitizeValue(req.params);
  next();
};
