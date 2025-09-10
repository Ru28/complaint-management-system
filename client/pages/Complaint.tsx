import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const phoneRegex = /^[0-9+()\-\s]{7,20}$/;

const schema = z.object({
  firstName: z.string().min(2, "Enter first name"),
  lastName: z.string().min(2, "Enter last name"),
  email: z.string().email("Enter a valid email"),
  mobile: z.string().regex(phoneRegex, "Enter a valid mobile number"),
  details: z.string().min(10, "Please describe your complaint")
});

type FormData = z.infer<typeof schema>;

export default function Complaint() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormData) => {
    await new Promise((r) => setTimeout(r, 700));
    const ref = `CMP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    toast.success("Complaint submitted", { description: `Reference: ${ref}` });
    reset();
  };

  return (
    <section className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Complaint Form</h1>
      <p className="mt-3 text-muted-foreground">Provide accurate details so we can resolve your issue quickly.</p>

      <form className="mt-8 grid gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" placeholder="First name" {...register("firstName")} />
            {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" placeholder="Last name" {...register("lastName")} />
            {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="mobile">Mobile no</Label>
          <Input id="mobile" type="tel" placeholder="+1 555 123 4567" {...register("mobile")} />
          {errors.mobile && <p className="text-sm text-destructive">{errors.mobile.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="details">Complaint Details</Label>
          <textarea
            id="details"
            placeholder="Describe your issue with relevant dates, locations, or references."
            className="min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            {...register("details")}
          />
          {errors.details && <p className="text-sm text-destructive">{errors.details.message}</p>}
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" className="h-11" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </section>
  );
}
