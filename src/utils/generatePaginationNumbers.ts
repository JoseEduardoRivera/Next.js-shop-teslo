export const generatePaginationNumbers = (currentPage:number, totalPages:number) =>{

    //Si el numbero total de paginas es 7 o menos
    //vamos a mostrar todas las paginas sin puntos suspensivos
    if(totalPages <=7){
        return Array.from({ length:totalPages}, (_,i)=> i+1) //[1,2,3,4,5,6,7]
    }

    //Si la pagina actual esta entre las primeras 3 paginas
    //mostrar las primeras 3, puntos suspensivos, y las ulvimas dos
    if (currentPage <=3) {
        return [1,2,3,'...', totalPages -1, totalPages] //[1,2,3,...,49,50]
    }

    //si la pagina actal esta entre las ultimas 3 paginas
    //mostrar las primeras 2, puntos suspensivos y ;as ultimas 3

    if (currentPage >= totalPages-2) {
        return [1,2,'...',totalPages-2, totalPages -1, totalPages] //[1,2,,...,48,49,50]
    }

    //si la pagina actual esta en otro lugar medio
    //mostrar la primera pagina, puntos suspensivos, pagina actual y vecinos
    return [
        1,
        '...',
        currentPage-1,
        currentPage,
        currentPage+1,
        '...',
        totalPages
    ]
}