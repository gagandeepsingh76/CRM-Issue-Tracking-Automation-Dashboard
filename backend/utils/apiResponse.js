export const sendSuccess = (
  res,
  data = null,
  message = 'Request completed successfully',
  statusCode = 200,
  meta,
) =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });

export const sendCreated = (res, data, message = 'Resource created') =>
  sendSuccess(res, data, message, 201);

export const sendNoContent = (res) => res.status(204).send();
