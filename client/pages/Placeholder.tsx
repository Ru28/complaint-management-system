import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Placeholder({ title, description }: { title: string; description?: string }) {
  return (
    <section className="container mx-auto px-4 py-24 text-center">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-4 text-muted-foreground">{description}</p>
        ) : (
          <p className="mt-4 text-muted-foreground">
            This page is a placeholder. Tell me to fill it with full functionality and UI.
          </p>
        )}
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
          <Link to="/track">
            <Button variant="secondary">Track Complaint</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
