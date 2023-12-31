"use client";
import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export const PlaceOrder = () => {
  const router = useRouter();

  const [loaded, setloaded] = useState(false);
  const [isPlacingOrder, setIsplacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const address = useAddressStore((state) => state.address);
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
    state.getSumaryInformation()
  );

  useEffect(() => {
    setloaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsplacingOrder(true);

    const productToSend = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    const resp = await placeOrder(productToSend, address);
    if (!resp.ok) {
      setIsplacingOrder(false);
      setErrorMessage(resp.message);
      return;
    }
    // Todo salio bien
    clearCart();
    router.replace("/orders/" + resp.order?.id);
  };

  if (!loaded) {
    setloaded(true);
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7 sticky top-10 h-fit">
      <Link
        className="hover:text-blue-500 cursor-pointer underline"
        href={"/checkout/address"}
      >
        Editar direccion
      </Link>
      <h2 className="text-2xl mb-2">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.country} {address.city}
        </p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Resumen de orden</h2>

      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
          {itemsInCart === 1 ? "1 Articulo " : `${itemsInCart} Articulos`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">
          {currencyFormat(total)}
        </span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          {/* Disclaimer */}
          <span className="text-xs">
            {`Al hacer clic en "Colocar orden", aceptas nuestros`}{" "}
            <a href="#" className="underline">
              términos y condiciones
            </a>{" "}
            y{" "}
            <a href="#" className="underline">
              política de privacidad
            </a>
          </span>
        </p>

        <p className="text-red-500">{errorMessage}</p>

        <button
          onClick={onPlaceOrder}
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}
          // href="/orders/123"
        >
          Colocar orden
        </button>
      </div>
    </div>
  );
};
