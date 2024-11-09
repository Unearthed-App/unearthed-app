import { Checkout } from "@/components/Checkout";
import { FeaturePremiumCard } from "@/components/FeaturePremiumCard";

export default async function GetPremium() {
  return (
    <div className="w-full pt-32 p-4 flex flex-wrap justify-center">
      <div className="w-full">
        <FeaturePremiumCard />
      </div>
      <div className="w-full flex justify-center mt-12">
        <Checkout />
      </div>
    </div>
  );
}
