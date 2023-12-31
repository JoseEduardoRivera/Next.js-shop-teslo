"use client";

import { QuantitySelector, SizeSelector } from "@/components";
import { CartProduct, Product, Size } from "@/interfaces";
import { useCartStore } from "@/store";
import React, { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setposted] = useState(false);

  const addProductToCart = useCartStore((state) => state.addProductToCart);

  const addToCart = () => {
    setposted(true);
    if (!size) return;
    console.log({ size, quantity, product });
    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      size: size,
      image: product.images[0],
    };
    // TDOD: AddToCart
    addProductToCart(cartProduct);
    setposted(false);
    setQuantity(1);
    setSize(undefined);
  };

  return (
    <>
      {/* MENSAJE DE ALERTA */}
      {posted && !size && (
        <div className="flex-row flex items-center bg-red-700 rounded-sm p-3 fade-in ">
          <IoWarningOutline className="mr-2" color={"white"} size={30} />

          <span className="text-white">Debe de seleccionar una talla</span>
        </div>
      )}

      {/* Selector de Tallas */}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChanged={(size) => setSize(size)}
      />

      {/* Selector de Cantidad */}
      <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

      {/* Button */}
      <button className="btn-primary my-5" onClick={addToCart}>
        Agregar al carrito
      </button>
    </>
  );
};
