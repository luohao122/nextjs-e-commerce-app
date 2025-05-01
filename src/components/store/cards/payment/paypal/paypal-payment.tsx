"use client";

import { useRef } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

import {
  capturePayPalPayment,
  createPayPalPayment,
} from "@/queries/paypal.query";

export default function PaypalPayment({ orderId }: { orderId: string }) {
  const router = useRouter();
  const paymentIdRef = useRef("");

  const createOrder = async () => {
    const response = await createPayPalPayment(orderId);
    paymentIdRef.current = response.id;

    return response.id;
  };

  const onApprove = async () => {
    const captureResponse = await capturePayPalPayment(
      orderId,
      paymentIdRef.current
    );
    if (captureResponse.id) router.refresh();
  };

  return (
    <div>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => console.log("Paypal Button error:", err)}
      />
    </div>
  );
}
