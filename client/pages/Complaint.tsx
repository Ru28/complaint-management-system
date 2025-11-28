import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const phoneRegex = /^[0-9+()\-\s]{7,20}$/;

const schema = z.object({
  firstName: z.string().min(2, "Enter first name"),
  lastName: z.string().min(2, "Enter last name"),
  email: z.string().email("Enter a valid email"),
  mobile: z.string().regex(phoneRegex, "Enter a valid mobile number"),
  details: z.string().min(10, "Please describe your complaint"),
});

type FormData = z.infer<typeof schema>;

interface ComplaintItem {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  complaintDetail?: string;
  complaintStatus?: string;
  created: string;
  resolution?: { response?: string } | null;
}

export default function Complaint() {
  const { token, isAuthenticated, isAdmin } = useAuth();
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const fetchComplaints = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const endpoint = isAdmin
        ? "/api/admin/all-complaints"
        : "/api/complaint/myComplaint";
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed (${res.status})`);
      setComplaints(data.data || []);
    } catch (e: any) {
      toast.error("Failed to fetch complaints", { description: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchComplaints();
  }, [isAuthenticated, token]);

  const onSubmit = async (values: FormData) => {
    try {
      const res = await fetch("/api/complaint/raiseComplaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.mobile,
          complaintDetail: values.details,
        }),
      });
      const data = await res.json().catch(() => ({}) as any);
      if (!res.ok) throw new Error(data?.message || `Failed (${res.status})`);
      toast.success("Complaint submitted", {
        description: data?.message || "Submitted successfully",
      });
      reset();
      setShowForm(false);
      fetchComplaints();
    } catch (e: any) {
      toast.error("Submission error", {
        description: e.message || "Something went wrong",
      });
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      (c.complaintDetail ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (c.firstName ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" ||
      (c.complaintStatus ?? "").toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold">Complaints</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Manage and track your complaints
          </p>
        </div>
        {!isAdmin && (
          <Button
            onClick={() => setShowForm(!showForm)}
            size="lg"
            className="whitespace-nowrap"
          >
            {showForm ? "Cancel" : "Create Complaint"}
          </Button>
        )}
      </div>

      {showForm && !isAdmin && (
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-8">Create New Complaint</h2>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
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
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="+1 555 123 4567"
                {...register("mobile")}
              />
              {errors.mobile && (
                <p className="text-sm text-destructive">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="details">Complaint Details</Label>
              <textarea
                id="details"
                placeholder="Describe your issue with relevant dates, locations, or references."
                className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                {...register("details")}
              />
              {errors.details && (
                <p className="text-sm text-destructive">
                  {errors.details.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Create"}
            </Button>
          </form>
        </div>
      )}

      {isAdmin && (
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-3">
            <input
              type="text"
              placeholder="Search title/description"
              className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Priority">All Priority</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Filter</Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading complaints...</p>
      ) : filteredComplaints.length === 0 ? (
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-muted-foreground">
            {isAdmin
              ? "No complaints found."
              : "No complaints yet. Create your first complaint to get started."}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-x-auto shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 font-semibold">ID</th>
                <th className="text-left py-3 px-4 font-semibold">Title</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Priority</th>
                {isAdmin && (
                  <th className="text-left py-3 px-4 font-semibold">Owner</th>
                )}
                <th className="text-left py-3 px-4 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((c) => (
                <tr key={c._id} className="border-b hover:bg-muted/30">
                  <td className="py-3 px-4 text-primary font-semibold">
                    {c._id.slice(0, 8)}
                  </td>
                  <td className="py-3 px-4 text-primary max-w-xs">
                    {c.complaintDetail.slice(0, 40)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-secondary">
                      {c.complaintStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">-</td>
                  {isAdmin && (
                    <td className="py-3 px-4 text-sm">
                      {c.firstName} {c.lastName}
                    </td>
                  )}
                  <td className="py-3 px-4 text-xs">
                    {new Date(c.created).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
