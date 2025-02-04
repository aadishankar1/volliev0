import AuthWrapper from "./AuthWrapper";
import { cookies } from 'next/headers'
export const metadata = {
  title: "Signup",
  description: "use signup for app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies()
  const user = cookieStore.has('user')

  return <AuthWrapper user={user}>{children}</AuthWrapper>;
}
