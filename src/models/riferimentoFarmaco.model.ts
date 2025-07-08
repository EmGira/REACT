export interface RiferimentoFarmaco{
    id_farmaco: string, 
    dose: number, 
    frequenza: 1 | 2 | 3, 
    periodo:string, 
    assunzioni:{
        data: string,
        stato: 'assunto' | 'pianificato' | 'dimenticato'
        
    }[]
}