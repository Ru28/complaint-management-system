import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const SHOWN_KEY = "account_modal_shown";

export default function CreateAccountModal() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !sessionStorage.getItem(SHOWN_KEY)) {
      setOpen(true);
      sessionStorage.setItem(SHOWN_KEY, "1");
    }
  }, [isAuthenticated]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account Ready</DialogTitle>
          <DialogDescription>
            Your account has been created. You can now raise and track complaints.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex gap-3">
          <Link to="/complaint">
            <Button>Raise a Complaint</Button>
          </Link>
          <Link to="/track">
            <Button variant="secondary">Track Complaint</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
