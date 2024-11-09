import { CheckCircle, CircleDashed } from "lucide-react";

export const CheckItemSmall = ({
  content,
  variant,
}: {
  content: string;
  variant?: string;
}) => {
  return (
    <div className="flex w-full space-x-4 items-center my-1 md:my-2 text-sm lg:text-xl">
      <div
        className={`w-4 h-4 rounded-full ${
          variant === "destructive" ? "bg-destructive" : "bg-primary"
        }`}
      >
        {variant === "destructive" ? (
          <CircleDashed className="w-4 h-4" />
        ) : (
          <CheckCircle className="w-4 h-4" />
        )}
      </div>
      <div
        className={`text-sm font-semibold ${
          variant === "destructive" ? "text-muted" : ""
        }`}
      >
        {content}
      </div>
    </div>
  );
};
