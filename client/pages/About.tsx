export default function About() {
  return (
    <section className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
        About Us
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">
        The Complaint Management System is developed to streamline the process
        of submitting, tracking, and resolving complaints efficiently. It aims
        to improve transparency, responsiveness, and accountability within
        organizations. Whether you're a customer, citizen, or employee, this
        system ensures your concerns are heard and addressed on time.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border p-6 bg-card shadow-sm">
          <h3 className="font-semibold text-lg">Transparent</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Real-time tracking and status updates keep everyone informed.
          </p>
        </div>
        <div className="rounded-xl border p-6 bg-card shadow-sm">
          <h3 className="font-semibold text-lg">Responsive</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Automated workflows ensure swift routing and resolution.
          </p>
        </div>
        <div className="rounded-xl border p-6 bg-card shadow-sm">
          <h3 className="font-semibold text-lg">Accountable</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Clear ownership and timelines drive accountability.
          </p>
        </div>
      </div>
    </section>
  );
}
