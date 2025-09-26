import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ComplaintItem {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  complaintDetail: string;
  complaintStatus: string;
  created: string;
}

export default function Track() {
  const { token, isAuthenticated } = useAuth();
  const [items, setItems] = useState<ComplaintItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!isAuthenticated || !token) return;
      try {
        setLoading(true);
        const res = await fetch("/api/complaint/myComplaint", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || `Failed (${res.status})`);
        setItems(data.data || []);
      } catch (e: any) {
        toast.error("Failed to fetch complaints", { description: e.message });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <section className="container mx-auto px-4 py-16">
        <p className="text-muted-foreground">
          Please login to view your complaints.
        </p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">My Complaints</h1>
      {loading && <p className="mt-6 text-muted-foreground">Loading...</p>}
      {!loading && items && items.length === 0 && (
        <p className="mt-6 text-muted-foreground">No complaints found.</p>
      )}
      <div className="mt-6 grid gap-4">
        {items?.map((c) => (
          <div key={c._id} className="rounded-lg border p-4 bg-card">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {c.firstName} {c.lastName}
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                {c.complaintStatus}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {c.complaintDetail}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {new Date(c.created).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
