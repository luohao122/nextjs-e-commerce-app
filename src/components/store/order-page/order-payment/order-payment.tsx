"use client";

import { FC } from "react";

import PaypalWrapper from "@/components/store/cards/payment/paypal/paypal-wrapper";
import StripeWrapper from "@/components/store/cards/payment/stripe/stripe-wrapper";
import PaypalPayment from "@/components/store/cards/payment/paypal/paypal-payment";

import StripePayment from "@/components/store/cards/payment/stripe/stripe-payment";
import { OrderPaymentProps } from '@/components/store/order-page/order-payment/order-payment.types'

const OrderPayment: FC<OrderPaymentProps> = ({ amount, orderId }) => {
  return (
    <div className="h-full flex flex-col space-y-5">
      {/* Paypal */}
      <PaypalWrapper>
        <PaypalPayment orderId={orderId} />
      </PaypalWrapper>
      {/* Stripe */}
      <StripeWrapper amount={amount}>
        <StripePayment orderId={orderId} />
      </StripeWrapper>
    </div>
  );
};

export default OrderPayment;
