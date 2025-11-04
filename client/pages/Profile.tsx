import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const phoneRegex = /^[0-9+()\-\s]{7,20}$/;

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phoneNumber: z
    .string()
    .regex(phoneRegex, "Enter a valid phone number")
    .optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function Profile() {
  const { user, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.email?.split("@")[0] || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user?.email?.split("@")[0] || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: FormData) => {
    try {
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      setLoading(true);
      const res = await fetch("/api/accounts/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json().catch(() => ({}) as any);
      if (!res.ok) throw new Error(data?.message || `Failed (${res.status})`);

      toast.success("Profile updated", {
        description: "Your profile has been updated successfully",
      });
      setIsEditing(false);
    } catch (e: any) {
      toast.error("Update failed", {
        description: e.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button
          variant={isEditing ? "destructive" : "default"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="max-w-2xl rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {user?.email?.split("@")[0] || "User"}
            </h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Your full name"
              {...register("fullName")}
              disabled={!isEditing}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email")}
              disabled={!isEditing}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+1 555 123 4567"
              {...register("phoneNumber")}
              disabled={!isEditing}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Your address"
              {...register("address")}
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="City"
                {...register("city")}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="State"
                {...register("state")}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                placeholder="Pincode"
                {...register("pincode")}
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting || loading}>
                {isSubmitting || loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
