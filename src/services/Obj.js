/**
 * transforma a hierarquia de objetos em um nome por extenso
 * @param {*} obj 
 * @param {*} prefixo 
 */
export const unificarDados = (obj, prefixo) =>{

        let objFinal = {};
        for (let column in obj) {
            obj[column] = obj[column] == null ? '' : obj[column];
            let prefixoRaiz = prefixo;
            if(typeof obj[column] === 'object'){
                prefixoRaiz = prefixoRaiz + column + '_';
                let dadosUnificados = unificarDados(obj[column], prefixoRaiz); 
                objFinal =  Object.assign(objFinal, dadosUnificados);
            }else
                objFinal = {...objFinal, [prefixo + column]: obj[column]}
        }
        return objFinal;
    }

    /**
     *  transforma um nome por extenso em uma hierarquia de objetos, onde o separador é o que segmenta o nome
     * @param {*} obj 
     * @param {*} separador 
     */
export const desUnificarDados = (obj, separador) =>{
        let objFinal = {};
        for (let column in obj)
            objFinal =  Merge (objFinal, retroceder(obj, column, separador))
        return objFinal;
    }

    const retroceder = (obj, column, separador) => {
        let columnSplit = column.split(separador).reverse();
        let atributo = {[columnSplit[0]]: obj[column] };
        for(let i = 1; i < columnSplit.length; ++i)
            atributo = {[columnSplit[i]] : atributo}
        return atributo;
    }

    /**
     * une dois objetos até o nivel mais baixo
     */
export const Merge = (to, from) =>  {
        for (let n in from) {
            if (typeof to[n] != 'object') 
                to[n] = from[n];
            else if (typeof from[n] == 'object')
                to[n] = Merge(to[n], from[n]);
        }
        return to;
    };