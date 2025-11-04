import { useState } from "react";
import { Link, useNavigate, NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const USER_TABS = [
  { label: "Complaints", path: "/dashboard/complaints" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Profile", path: "/dashboard/profile" },
];

const ADMIN_TABS = [
  { label: "Complaints", path: "/dashboard/complaints" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Profile", path: "/dashboard/profile" },
  { label: "Admin", path: "/dashboard/admin" },
  { label: "Users", path: "/dashboard/users" },
];

export default function AuthenticatedLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { isAdmin, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const tabs = isAdmin ? ADMIN_TABS : USER_TABS;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Header - Mobile */}
      <div className="md:hidden border-b bg-card sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-500" />
            <span className="text-sm font-semibold hidden sm:inline">CMS</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="border-t bg-background">
            <div className="container mx-auto px-4 py-2 space-y-1">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </Button>
            </div>
          </nav>
        )}
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-56 border-r bg-card min-h-screen sticky top-0">
        <div className="p-4 space-y-4">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-500" />
            <span className="text-sm font-semibold">CMS</span>
          </Link>

          <div className="space-y-1 mb-6 pb-6 border-b">
            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground">
              Menu
            </p>
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:bg-muted"
                  )
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>

          <div className="space-y-2 py-4 border-t">
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                Logged in as:
              </p>
              <p className="text-sm font-medium truncate">
                {user?.email || "User"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
