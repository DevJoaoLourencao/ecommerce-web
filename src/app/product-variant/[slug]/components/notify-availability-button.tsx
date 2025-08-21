"use client";

import { BellIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface NotifyAvailabilityButtonProps {
  productVariantId: string;
  productName: string;
  variantName: string;
}

const NotifyAvailabilityButton = ({
  productVariantId,
  productName,
  variantName,
}: NotifyAvailabilityButtonProps) => {
  const [isNotifying, setIsNotifying] = useState(false);

  const handleNotifyClick = async () => {
    setIsNotifying(true);

    // Simular chamada de API para cadastro de notificação
    setTimeout(() => {
      setIsNotifying(false);
      toast.success(
        `Você será notificado quando "${productName} - ${variantName}" estiver disponível!`,
      );
    }, 1000);
  };

  if (isNotifying) {
    return (
      <Button className="rounded-full" size="lg" variant="outline" disabled>
        <CheckIcon className="mr-2 h-4 w-4" />
        Notificação ativada
      </Button>
    );
  }

  return (
    <Button
      className="rounded-full"
      size="lg"
      variant="outline"
      onClick={handleNotifyClick}
    >
      <BellIcon className="mr-2 h-4 w-4" />
      Avise-me
    </Button>
  );
};

export default NotifyAvailabilityButton;
