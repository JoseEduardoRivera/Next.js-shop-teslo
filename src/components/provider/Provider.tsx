"use client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { SessionProvider } from "next-auth/react";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export const Provider = ({ children }: Props) => {
  // Variables de entorno no funcionaron
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          "Aam1v4QF_PfOqsrQVyR-xJsUHxp0V8Dn_kJBKw88icM5orcAHX1ScLyWzwW5EtiOlf1E1Cgui8YJ8K9y" ??
          "",
        intent: "capture",
        currency: "USD",
      }}
    >
      <SessionProvider>{children}</SessionProvider>;
    </PayPalScriptProvider>
  );
};
