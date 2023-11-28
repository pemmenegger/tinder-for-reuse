import { RegisterInputs } from "@/components/forms/RegisterForm";
import { LoginInputs } from "@/components/forms/LoginForm";
import { JWT } from "next-auth/jwt";
import { ApiError, fetchApi } from "./base";

const API_ROUTE = "/api/accounts";

export const registerUser = async (registerInputs: RegisterInputs) => {
  const { response, data } = await fetchApi(API_ROUTE, `/register/`, {
    method: "POST",
    body: registerInputs,
  });
  if (!response.ok) throw new ApiError("Registrierung fehlgeschlagen", data);
  console.log("registerUser Response", data);
  return data;
};

export const loginUser = async (username: string, password: string) => {
  const loginInputs: LoginInputs = {
    email: username,
    password,
  };
  const { response, data } = await fetchApi(API_ROUTE, `/login/`, {
    method: "POST",
    body: loginInputs,
  });
  if (!response.ok) throw new ApiError("Login fehlgeschlagen", data);
  console.log("loginUser Response", data);
  return data;
};

// export const fetchUser = async (session: Session) => {
//   const { response, data } = await fetchApi(`/api/accounts/uploads/`, {
//     method: "GET",
//     session: session,
//   });
//   if (!response.ok) throw new ApiError("fetchUserUploads fehlgeschlagen", data);
//   console.log("fetchUserUploads Response", data);
//   return data;
// };

export const refreshToken = async (token: JWT): Promise<JWT> => {
  const { response, data } = await fetchApi(API_ROUTE, "/refresh/", {
    method: "POST",
    headers: {
      authorization: `Refresh ${token.refresh_token}`,
    },
  });
  if (!response.ok) throw new ApiError("refreshToken fehlgeschlagen", data);

  console.log("refreshToken Response", data);

  return {
    ...token,
    backendTokens: data,
  };
};
