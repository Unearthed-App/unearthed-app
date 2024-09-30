import { BookOpenText } from "lucide-react";

export function AnimatedLoader() {
  return (
    <div className="animate-pulse">
      <BookOpenText className="h-12 w-12" />
    </div>
  );
}
