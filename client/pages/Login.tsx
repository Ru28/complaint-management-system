import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters"),
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values: FormData) => {
    try {
      const res = await fetch("/api/accounts/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}) as any);
        throw new Error(err?.message || `Login failed (${res.status})`);
      }
      const data = await res.json();
      if (!data?.token) throw new Error("Token missing in response");
      setAuth(data.token, data.user ?? null);
      toast.success("Logged in", {
        description: `Welcome back, ${values.email}`,
      });
      navigate("/");
    } catch (e: any) {
      toast.error("Login error", {
        description: e.message || "Something went wrong",
      });
    }
  };

  return (
    <section className="container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-10 items-center">
      <div className="space-y-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-prose">
          Access your dashboard to raise new complaints, track statuses, and
          manage your profile.
        </p>
      </div>
      <div className="rounded-xl border bg-card shadow-xl p-6 md:p-8">
        <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
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
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              {...register("remember")}
            />
            <span>Remember me</span>
          </label>
          <Button type="submit" className="h-11" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/" className="text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
