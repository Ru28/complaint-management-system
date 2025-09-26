import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  resolution?: { response?: string } | null;
}

export default function Admin() {
  const { token, isAuthenticated, isAdmin } = useAuth();
  const [items, setItems] = useState<ComplaintItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [response, setResponse] = useState("");

  const fetchAll = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch("/api/admin/all-complaints", {
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

  useEffect(() => { if (isAuthenticated && isAdmin) fetchAll(); }, [isAuthenticated, isAdmin, token]);

  const openResolve = (id: string) => { setActiveId(id); setResponse(""); setOpen(true); };

  const submitResolve = async () => {
    if (!activeId || !token) return;
    try {
      const res = await fetch(`/api/admin/resolve-complaint?complaintId=${encodeURIComponent(activeId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ response }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed (${res.status})`);
      toast.success("Complaint resolved");
      setOpen(false);
      fetchAll();
    } catch (e: any) {
      toast.error("Resolve failed", { description: e.message });
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <section className="container mx-auto px-4 py-16">
        <p className="text-muted-foreground">Admins only.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">All Complaints</h1>
      {loading && <p className="mt-6 text-muted-foreground">Loading...</p>}
      <div className="mt-6 grid gap-4">
        {items?.map((c) => (
          <div key={c._id} className="rounded-lg border p-4 bg-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{c.firstName} {c.lastName} <span className="text-xs text-muted-foreground">({c.email})</span></h3>
                <p className="text-xs text-muted-foreground">{c.phoneNumber}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-secondary">{c.complaintStatus}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{c.complaintDetail}</p>
            {c.resolution?.response && (
              <p className="mt-2 text-sm">Response: {c.resolution.response}</p>
            )}
            <div className="mt-4">
              {c.complaintStatus !== "Resolved" && (
                <Button onClick={() => openResolve(c._id)}>Resolve</Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolution</DialogTitle>
            <DialogDescription>Provide a response to this complaint.</DialogDescription>
          </DialogHeader>
          <textarea
            className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Type your response..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submitResolve}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
