export const fetchApi = async (
  route: string,
  endpoint: string,
  options: { method: string; body?: any; headers?: any }
): Promise<any> => {
  const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${route}${endpoint}`;

  const { method, body } = options;

  let { headers } = options;
  if (!headers) {
    headers = {};
  }

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const init: RequestInit = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(fullUrl, init);

    if (!response.ok) {
      throw new Error(
        `Error fetching api: ${response.status} ${
          response.statusText
        } - ${await response.text()}`
      );
    }

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      return { response, data };
    } else {
      const text = await response.text();
      return { response, text };
    }
  } catch (error) {
    console.error(`Error in fetcher: ${error}`);
    throw error;
  }
};

export class ApiError extends Error {
  private readonly status: number;

  constructor(
    message: string,
    errorBody: { message: string; name: string; status: number }
  ) {
    super(message);
    this.name = errorBody.name;
    this.status = errorBody.status;
    this.cause = errorBody.message;
  }
}
