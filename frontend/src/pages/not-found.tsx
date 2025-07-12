import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router";

function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Button>
        <Link to="/">Go back to Home</Link>
      </Button>
    </div>
  );
}

export default NotFound;
