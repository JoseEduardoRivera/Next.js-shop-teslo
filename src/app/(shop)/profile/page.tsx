import { auth } from "@/auth.config";
import { Title } from "@/components";
import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { IoArrowForwardOutline, IoCartOutline } from "react-icons/io5";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const { name, role, email, image } = session?.user;

  return (
    <div className=" font-sans h-screen w-full flex flex-row justify-center items-center">
      <div className="card w-96 mx-auto bg-white  shadow-xl hover:shadow -mt-20">
        {image ? (
          <Image
            className="w-32 mx-auto rounded-full -mt-20 border-8 border-white"
            src={`/imgs/${image}`}
            width={750}
            height={750}
            alt="algo"
          />
        ) : (
          <Image
            className="w-32 mx-auto rounded-full -mt-20 border-8 border-white"
            src={"/imgs/userDefault.png"}
            width={512}
            height={512}
            alt="algo"
          />
        )}
        <div className="text-center mt-2 text-3xl font-medium">{name}</div>
        <div className="text-center mt-2 font-light text-sm">{email}</div>
        <div className="text-center font-normal text-lg">{role}</div>
        <div className="px-6 text-center mt-2 font-light text-sm">
          <p className="font-bold">About me</p>
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed semper
            eros in urna lobortis, sit amet congue urna auctor. Etiam efficitur,
            sapien id ornare porta, lorem orci facilisis nisl, non hendrerit
            libero neque semper risus.{" "}
          </span>
        </div>
        <hr className="mt-8" />
        <div className="flex p-4">
          <Link
            href="/orders"
            className="w-1/2 align-center flex flex-row justify-center items-center cursor-pointer hover:text-blue-500"
          >
            <IoArrowForwardOutline size={25} className="mr-5" /> Mis Ordenes
          </Link>
          <div className="w-0 border border-gray-300"></div>
          <Link
            href="/cart"
            className="w-1/2 align-center flex flex-row justify-center items-center cursor-pointer hover:text-blue-500"
          >
            <IoCartOutline size={25} className="mr-5" /> Mi Carrito
          </Link>
        </div>
      </div>
    </div>
  );
}
