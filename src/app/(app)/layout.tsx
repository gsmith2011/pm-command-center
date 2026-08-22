import { Shell } from "@/components/shell";

// The application shell (sidebar + top bar) wraps every route in the (app)
// group. The marketing landing page lives outside this group, so it renders
// without the shell.
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Shell>{children}</Shell>;
}
