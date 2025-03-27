import Returns from "@/components/store/product-page/return-privacy-security-card/returns";
import SecurityPrivacyCard from "@/components/store/product-page/return-privacy-security-card/security-privacy-card";

const ReturnPrivacySecurityCard = ({
  returnPolicy,
}: {
  returnPolicy: string;
}) => {
  return (
    <div className="mt-2 space-y-2">
      <Returns returnPolicy={returnPolicy} />
      <SecurityPrivacyCard />
    </div>
  );
};

export default ReturnPrivacySecurityCard;
