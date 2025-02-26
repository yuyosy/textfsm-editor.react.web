export const request = async (
  requestUrl: RequestInfo | URL,
  requestBody?: RequestInit | undefined
) => {
  try {
    const response = await fetch(requestUrl, requestBody);
    if (!response.ok) {
      throw new Error(
        `An error has occured: ${response.status} - ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error: unknown) {
    throw new Error(String(error));
  }
};
