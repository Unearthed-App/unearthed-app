import { AnimatedLoader } from "@/components/AnimatedLoader";

export default function Loading() {
  return (
    <div className="pt-32 flex items-center justify-center">
      <AnimatedLoader />
    </div>
  );
}
