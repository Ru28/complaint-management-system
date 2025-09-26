import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const schema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email"),
    phone: z
      .string()
      .optional()
      .transform((v) => (v ? v.trim() : v)),
    role: z.enum(["Citizen", "Employee"], {
      required_error: "Select a role",
    }),
    password: z.string().min(6, "Min 6 characters"),
    confirm: z.string().min(6, "Confirm your password"),
    terms: z.literal<boolean>(true, {
      errorMap: () => ({ message: "You must accept the terms" }),
    }),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

export default function Index() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "Citizen" },
  });
  const { setToken, isAuthenticated } = useAuth();

  const onSubmit = async (values: FormData) => {
    try {
      const res = await fetch("/api/accounts/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: values.name,
          email: values.email,
          phoneNumber: values.phone,
          role: values.role,
          password: values.password,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}) as any);
        throw new Error(err?.message || `Signup failed (${res.status})`);
      }
      const data = await res.json();
      if (!data?.token) throw new Error("Token missing in response");
      setToken(data.token);
      toast.success("Account created", {
        description: `Welcome, ${values.name}`,
      });
      reset();
    } catch (e: any) {
      toast.error("Signup error", {
        description: e.message || "Something went wrong",
      });
    }
  };

  return (
    <section className="container mx-auto px-4 py-12 grid lg:grid-cols-2 gap-10 items-center">
      <div className="space-y-6">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Welcome to the CMS Portal
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
          Complaint Management System
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-prose">
          Submit, track, and resolve complaints with transparency and speed.
          Create your account to raise complaints and monitor progress in
          real-time.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/">
            <Button variant="default">Home</Button>
          </Link>
          <Link to="/complaint">
            <Button variant="secondary">Complaint form</Button>
          </Link>
          <Link to="/track">
            <Button variant="ghost">Track Complaint</Button>
          </Link>
          <Link to="/about">
            <Button variant="outline">About Us</Button>
          </Link>
          <Link to="/contact">
            <Button variant="link" className="px-0">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>

      {isAuthenticated ? (
        <div className="rounded-xl border bg-card shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-semibold">You are signed in</h2>
          <p className="mt-2 text-muted-foreground">Raise a complaint or track an existing one.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/complaint"><Button>Complaint form</Button></Link>
            <Link to="/track"><Button variant="secondary">Track Complaint</Button></Link>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border bg-card shadow-xl p-6 md:p-8">
          <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Rupesh Virani"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 555 123 4567"
                {...register("phone")}
              />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirm")}
                />
                {errors.confirm && (
                  <p className="text-sm text-destructive">
                    {errors.confirm.message}
                  </p>
                )}
              </div>
            </div>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-input"
                {...register("terms")}
              />
              <span>I agree to the terms and privacy policy.</span>
            </label>
            {errors.terms && (
              <p className="text-sm text-destructive">{errors.terms.message}</p>
            )}

            <Button type="submit" className="h-11" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      )}
    </section>
  );
}
