import { withAuth } from "next-auth/middleware";

export default withAuth;

// Optional: Configure protected routes
export const config = {
  matcher: [
    // Add your protected routes here
    "/dashboard/:path*",
    "/api/:path*",
  ],
};
