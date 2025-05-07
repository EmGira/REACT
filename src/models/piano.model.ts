export interface Piano{
    id: string,
    id_paziente: string,
    data_inizio: string,
    data_fine: string,
    farmaci: [
        {
            id_farmaco: string,
            periodo: string,
            frequenza: 1 | 2 | 3,
            dose: number
        }
    ] 
}