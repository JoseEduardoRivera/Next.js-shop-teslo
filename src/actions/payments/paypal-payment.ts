"use server"

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export const paypalCheckPayment = async(paypalTransactionId:string) =>{

    const authTocken = await getPaypalBearerToken()
    console.log({authTocken});

    if (!authTocken) {
        return {
            ok:false,
            message:"No se pudo obtener el token de verificacion"
        }
    }

    const response = await verifyPayPalPayment(paypalTransactionId,authTocken);

    if (!response) {
        return {
            ok:false,
            message:"error al verificar el pago"
        }
    }

    
    const { status, purchase_units} = response;
    const { invoice_id:prderId} = purchase_units[0]

if (status !== 'COMPLETED') {
    return {
        ok:false,
        message: 'Aun no se ha completado el pago en PayPal'
    }
}


console.log({status,purchase_units});


    try {

        await prisma.order.update({
            where: { id: prderId},
            data:  {
              isPaid: true,
              paidAt: new Date()
            }
          })

        //   Revalidar path
        revalidatePath(`/orders/${prderId}`)

        return {
            ok:true
        }
        
    } catch (error) {
        return {
            ok:false,
            message:"Error 500 - No se pudo completar el pago"
        }

}
}

const getPaypalBearerToken = async():Promise<string|null> => {

    const PAYPAL_CLIENT_ID = process.env.NEXT_PAYPAL_CIENT_ID
    const PAYPAL_SECRET_ID = process.env.PAYPAL_SECRET
    const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? ''

    const base64Token = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_ID}`,
        "utf-8"
      ).toString("base64");


    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Basic ${base64Token}`);
    
    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");
    
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
      };

      try {
        const result = await fetch(oauth2Url, {
          ...requestOptions,
          cache: 'no-store'
        }).then((r) => r.json());
        return result.access_token;
      } catch (error) {
        console.log(error);
        return null;
      }
    };

const verifyPayPalPayment = async(paypalTransactionId:string, bearerTocken:string): Promise<PayPalOrderStatusResponse|null> => {

    const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${bearerTocken}`);
    
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };
    
    try {
        const resp = await fetch(paypalOrderUrl, {
          ...requestOptions,
          cache: 'no-store'
        }).then( r => r.json() );
        console.log({resp});
        return resp;
        
      } catch (error) {
        console.log(error);
        return null;
      }
}