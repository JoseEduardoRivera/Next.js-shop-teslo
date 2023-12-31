import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";



interface State {
    cart: CartProduct[]

    getTotalItems: ()=> number;
    //getSumaryInformation: () =>void;
    getSumaryInformation: () => {
        subTotal: number;
        tax: number;
        total: number;
        itemsInCart: number;
    }
    // addProductTo cart
    addProductToCart: (product: CartProduct)=> void
    // updateProductQuantity
    updateProductQuantity: (product: CartProduct, quantity: number ) => void
    // removeProduct
    removeProduct: (product: CartProduct)=> void
    clearCart: () => void
}

export const useCartStore = create<State>()(

    persist (
        
    (set, get)=> ({
        cart:[],

        // Metodos
        getTotalItems:()=>{
            const {cart} = get();
            return cart.reduce((total, item)=> total + item.quantity,0);
        },

        getSumaryInformation: () =>{
            const {cart} = get();
            const subTotal = cart.reduce((subtotal, producto)=> (producto.quantity * producto.price)+subtotal ,0);


            const tax = subTotal * 0.15;
            const total = subTotal + tax;
            const itemsInCart = cart.reduce((total, item)=> total + item.quantity,0);

            return {
                subTotal, tax, total, itemsInCart
            }
        },
    
        addProductToCart: (product: CartProduct) => {
            const {cart} = get();
            
    
            // Revisar si el producto existe en el carrito con la talla seleccionada
            const productInCart = cart.some(
                (item) => (item.id === product.id && item.size === product.size)
            );
    
            if (!productInCart) {
                set({
                    cart:[...cart, product]
    
                })
                return
            }
            //se que el producto existe por la talla, tengo que incrementar la cantidad
            const updateCartProducts = cart.map((item)=>{
                if (item.id === product.id && item.size === product.size) {
                    return ({...item, quantity: item.quantity + product.quantity})
                }
                return item;
            })
            set({cart:updateCartProducts})
        },



        updateProductQuantity: (product:CartProduct, quantity: number)=> {
            const {cart} = get()

            const updatedCartProducts = cart.map(item=>{
                if (item.id === product.id && item.size === product.size) {
                    return ({...item, quantity: quantity})
                }
                return item;
            })
            set({
                cart:updatedCartProducts
            });
        },
        removeProduct: (product: CartProduct)=>{
            const {cart} = get()

            const updatedCartProducts = cart.filter(item=>
                item.id !== product.id || item.size !== product.size
            )
            set({
                cart:updatedCartProducts
            });
        },
        clearCart: () => {
            set({cart:[]})
        },
    }),



        {
            name:'shopping-cart',
        }
    )


)