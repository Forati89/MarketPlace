import IBildStrings from './IBildStrings';

export interface IListItem{
    Title: string;
    Id: number;
    Beskrivning: string;
    Pris: string;
    Datum: Date;
    UsersId: number;
    Kategori: string;
    Bild: string[];
    BildUrl: string;
    AuthorId: any;
}