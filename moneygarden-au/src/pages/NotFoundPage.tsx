import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-black">Page not found</h1>
        <p className="mb-4 mt-2 text-muted-foreground">That branch does not exist in the app.</p>
        <Button asChild>
          <Link to="/app/tree">Back to Learning Tree</Link>
        </Button>
      </div>
    </div>
  );
}
