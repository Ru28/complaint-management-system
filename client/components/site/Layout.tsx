import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/complaint", label: "Complaint form" },
  { to: "/track", label: "Track Complaint" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-500" />
          <span className="text-lg font-semibold">
            Complaint Management System
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-foreground/80",
                isActive ? "text-primary" : "text-foreground/70",
              )
            }
          >
            Home
          </NavLink>
          {isAuthenticated &&
            (isAdmin ? (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-foreground/80",
                    isActive ? "text-primary" : "text-foreground/70",
                  )
                }
              >
                Admin
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/complaint"
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-foreground/80",
                      isActive ? "text-primary" : "text-foreground/70",
                    )
                  }
                >
                  Complaint form
                </NavLink>
                <NavLink
                  to="/track"
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-foreground/80",
                      isActive ? "text-primary" : "text-foreground/70",
                    )
                  }
                >
                  Track Complaint
                </NavLink>
              </>
            ))}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-foreground/80",
                isActive ? "text-primary" : "text-foreground/70",
              )
            }
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-foreground/80",
                isActive ? "text-primary" : "text-foreground/70",
              )
            }
          >
            Contact Us
          </NavLink>
          {isAuthenticated ? (
            <Button size="sm" className="ml-2" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button size="sm" className="ml-2">
                Login
              </Button>
            </Link>
          )}
        </nav>
        <button
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-input"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-2 grid gap-1">
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "px-2 py-2 rounded-md text-sm font-medium",
                  isActive ? "text-primary" : "text-foreground/70",
                )
              }
            >
              Home
            </NavLink>
            {isAuthenticated &&
              (isAdmin ? (
                <NavLink
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "px-2 py-2 rounded-md text-sm font-medium",
                      isActive ? "text-primary" : "text-foreground/70",
                    )
                  }
                >
                  Admin
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/complaint"
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "px-2 py-2 rounded-md text-sm font-medium",
                        isActive ? "text-primary" : "text-foreground/70",
                      )
                    }
                  >
                    Complaint form
                  </NavLink>
                  <NavLink
                    to="/track"
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "px-2 py-2 rounded-md text-sm font-medium",
                        isActive ? "text-primary" : "text-foreground/70",
                      )
                    }
                  >
                    Track Complaint
                  </NavLink>
                </>
              ))}
            {isAuthenticated ? (
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </Button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 grid gap-4 sm:flex sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Complaint Management System. All rights
          reserved.
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <a href="/about" className="hover:text-foreground">
            About
          </a>
          <a href="/contact" className="hover:text-foreground">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-muted/30">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
