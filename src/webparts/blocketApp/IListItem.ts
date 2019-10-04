import IBildStrings from './IBildStrings';

export interface IListItem{
    Title: string;
    Id: number;
    Beskrivning: string;
    Pris: string;
    Datum: Date;
    UsersId: any;
    Kategori: string;
    Bild: string[];
    BildUrl: string;
}