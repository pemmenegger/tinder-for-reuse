export { default } from "next-auth/middleware";

export const config = {
  matcher:
    // protected routes
    ["/my-uploads", "/account", "/building-elements/upload"],
};
