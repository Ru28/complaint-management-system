import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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

interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}

export default function Dashboard() {
  const { token, isAuthenticated, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !token) return;
      try {
        setLoading(true);
        if (isAdmin) {
          const res = await fetch("/api/admin/all-complaints", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok)
            throw new Error(data?.message || `Failed (${res.status})`);
          const complaints = data.data || [];
          setRecentComplaints(complaints.slice(0, 5));
          const stats = {
            total: complaints.length,
            open: complaints.filter((c: any) => c.complaintStatus === "Open")
              .length,
            inProgress: complaints.filter(
              (c: any) => c.complaintStatus === "In Progress",
            ).length,
            resolved: complaints.filter(
              (c: any) => c.complaintStatus === "Resolved",
            ).length,
          };
          setStats(stats);
        } else {
          const res = await fetch("/api/complaint/myComplaint", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok)
            throw new Error(data?.message || `Failed (${res.status})`);
          const complaints = data.data || [];
          setRecentComplaints(complaints.slice(0, 5));
          const stats = {
            total: complaints.length,
            open: complaints.filter((c: any) => c.complaintStatus === "Open")
              .length,
            inProgress: complaints.filter(
              (c: any) => c.complaintStatus === "In Progress",
            ).length,
            resolved: complaints.filter(
              (c: any) => c.complaintStatus === "Resolved",
            ).length,
          };
          setStats(stats);
        }
      } catch (e: any) {
        toast.error("Failed to fetch data", { description: e.message });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, isAuthenticated, isAdmin]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        {!isAdmin && (
          <Link to="/dashboard/complaints">
            <Button>Create Complaint</Button>
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="text-3xl font-bold mt-2">{stats.open}</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-3xl font-bold mt-2">{stats.inProgress}</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-3xl font-bold mt-2">{stats.resolved}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <h2 className="text-xl font-bold mb-4">Recent Complaints</h2>
            {recentComplaints.length === 0 ? (
              <p className="text-muted-foreground">
                {isAdmin
                  ? "No complaints yet."
                  : "No complaints yet. Create your first complaint to get started."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">ID</th>
                      <th className="text-left py-2 px-2">Title</th>
                      <th className="text-left py-2 px-2">Status</th>
                      <th className="text-left py-2 px-2">Priority</th>
                      <th className="text-left py-2 px-2">Owner</th>
                      <th className="text-left py-2 px-2">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentComplaints.map((c) => (
                      <tr key={c._id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-2 text-primary font-semibold">
                          {c._id.slice(0, 8)}
                        </td>
                        <td className="py-2 px-2 text-primary">
                          {c.complaintDetail.slice(0, 30)}...
                        </td>
                        <td className="py-2 px-2">
                          <span className="px-2 py-1 rounded-full text-xs bg-secondary">
                            {c.complaintStatus}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-xs">-</td>
                        <td className="py-2 px-2 text-xs">
                          {c.firstName} {c.lastName}
                        </td>
                        <td className="py-2 px-2 text-xs">
                          {new Date(c.created).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
