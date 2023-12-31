"use server"

import { auth } from "@/auth.config";
import { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";


interface ProductToOrder {
    productId: string,
    quantity: number,
    size: Size,
}

export const placeOrder = async(productsIDs: ProductToOrder[], address: Address)=>{

    const session = await auth()

    const userID = session?.user.id;

// Verificar sesion de usuario
    if (!userID) {
        return {
            ok:false,
            message: 'Np hay sesion de usuario'
        }
    }

    // console.log({productsIDs,address,userID});
    

    // Obtener la informacion de los productos
    // Nota: recuerden que podemos llevar 2 o mas productos con el mismo ID
    const products = await prisma.product.findMany({
        where:{
            id:{
                in: productsIDs.map(p => p.productId)}
        }
    })


    //calcular los montos
    const itemsInOrder = productsIDs.reduce( (count,producto) => count + producto.quantity,0)

    // Los totales de tax, subtotal y total
    const {subTotal, tax, total} = productsIDs.reduce((totales, item)=> {

        const productQuantity = item.quantity;
        const product = products.find(product => product.id === item.productId)

        if ((!product) ) {
            throw new Error( `${item.productId} no existe`)
        }

            const subTotal = product?.price * productQuantity;

            totales.subTotal += subTotal;
            totales.tax += subTotal * 0.15;
            totales.total += subTotal * 1.15;



        return totales
    }, {subTotal: 0, tax: 0,total:0})
    

    // Crear la transaccion de la base de datos

    try {

        const prismaTx = await prisma.$transaction(async(tx)=>{
            // 1. Actualizar el stock de los productos
            const updatedProductsPromises = products.map((product)=> {
    
                // Acumular los valores de diferentes productos con el mismo ID
                const productQuantity = productsIDs.filter(
                    p => p.productId === product.id
                ).reduce((acc,item)=> item.quantity +acc,0)
    
                if (productQuantity ===0) {
                    throw new Error ('El item no tiene cantidad definida')
                }
    
                return tx.product.update({
                    where:{id: product.id},
                    data:{
                        // inStock: product.inStock - productQuantity
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                })
    
                
            })
            const updatedProducts = await Promise.all(updatedProductsPromises);
    
            // Verificar valores negatios en la existencia
            updatedProducts.forEach(product => {
                if (product.inStock < 0) {
                    throw new Error (`${product.title} no cuenta con las existencias suficientes`)
                }
            })
    
    
            // 2. Crear el encabezado de la orden y el detalle
            const order = await tx.order.create({
                data:{
                    userId: userID,
                    itemsInOrder:itemsInOrder,
                    subTotal:subTotal,
                    tax:tax,
                    total:total,
                    OrderItem: {
                        createMany: {
                            data: productsIDs.map(p =>({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            });
    
            // Validad, si el price es 0, entonces lanzar un error
    
    
            // 3. Crear la direccion de la orden
            const  {country, ...restAddress} = address
            const orderAddress = await tx.orderAddress.create({
                data:{
                    ...restAddress,
                    countryId: country,
                    orderId: order.id
                }
            })
    
    
            return {
                order: order,
                orderAddress: orderAddress,
                updatedProducts:updatedProducts,
            }
        })

        return {
            ok:true,
            order: prismaTx.order,
            prismaTx:prismaTx
        }

        
    } catch (error:any) {
        return {
            ok:false,
            message: error?.message
        }
    }


}