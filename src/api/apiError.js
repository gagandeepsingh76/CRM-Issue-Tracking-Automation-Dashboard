export const getApiErrorMessage = (error) => {
  const response = error.response?.data;

  if (response?.errors?.length) {
    return response.errors
      .map((item) => item.message)
      .filter(Boolean)
      .join(" ");
  }

  return response?.message ?? error.message ?? "Request failed.";
};

export const unwrapApiData = (response) => response.data?.data ?? response.data;

export const unwrapApiMeta = (response) => response.data?.meta ?? null;
