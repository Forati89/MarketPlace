import * as React from 'react';
import { IListItem } from '../../IListItem';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { TextField, IDropdownOption, Dropdown, DocumentCardImage, ImageFit} from 'office-ui-fabric-react/lib';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp} from "@pnp/sp";
import styles from './ViewAd.module.scss'
import { CurrentUser } from '@pnp/sp/src/siteusers';

export interface IViewAdProps {
    items: IListItem[];
    context: WebPartContext;
    openDialog: boolean;
    closeDialog: () => void;
    userEmail: string;
    userTitle: any;

}

export interface IViewAdState {
    hideEdit: boolean;
    validEditUser: boolean;
    message: string;
    values: {
        Id: number;
        Title: string;
        Pris: any;
        Beskrivning: string;
        Kategori: string;
        UsersId: number;
        BildUrl: string;
        Datum: Date;
        currentUserId: number;
    };
}

export default class ViewAd extends React.Component<IViewAdProps, IViewAdState> {

    private _options: IDropdownOption[];

    constructor(props: IViewAdProps, state: IViewAdState)
    {
        super(props);
        this.state = {
            hideEdit: true,
            validEditUser: false,
            message: '',
            values: {
                Id: 1,
                Pris: 0,
                Title: '',
                UsersId: 0,
                Beskrivning: '',
                Kategori: '',
                BildUrl: '',
                Datum: new Date(),

                currentUserId: 10
            }
        };
        this._options = [
            { key: '1', text: 'Alla' },
            { key: '2', text: 'Fordon' },
            { key: '3', text: 'Elektronik' },
            { key: '4', text: 'Hushåll & Vitvaror' },
            { key: '5', text: 'Hobby' },
            { key: '6', text: 'Övrigt' },
          ];
        
    }
    public componentDidMount(): void {
      this.getSPCUData();
    }  
    
    public render():  React.ReactElement<IViewAdProps> {

        const dialog = this.props.items.map(result => {
            // variable for kategori to be comapred and return the number of key value //
            let cat = this.choosenCat(result.Kategori);
            return(
            <Dialog
            hidden={this.props.openDialog}
            onDismiss={this.props.closeDialog}
            dialogContentProps={{
              type: DialogType.largeHeader,
              title: result.Title,
            }}
            modalProps={{
              isBlocking: false,
              styles: { main: { minWidth: 900 } }
            }}>

              <div>
              <h1>{result.Title}</h1>
              <DocumentCardImage height={150}  imageFit={ImageFit.centerContain} imageSrc={result.BildUrl} />
              <p>Beskrivning:</p>
              <p>{result.Beskrivning}</p>
              <h2>Pris: {result.Pris} kr</h2>
              <h3>Kategori: {result.Kategori}</h3>
              <p>Publicerad: {result.Datum}</p>
              <p>Publicerad av: <h3>{this.props.userTitle}</h3></p>
              <h3 color="green">{this.state.message}</h3>
              </div>
              <div  hidden={this.state.hideEdit}>
              <TextField label="Mata in Rubrik för din annons" defaultValue={result.Title} className="Title" onChange={this._onChangeTitle}/>
              <TextField label="Mata in Beskrivning" defaultValue={result.Beskrivning} className="Description" onChange={this._onChangeDesc}/>
              <TextField label="Mata in Pris för Objektet" defaultValue={result.Pris}  className="Price" type="number" prefix="kr" onChange={this._onChangePrice}/>
              <Dropdown label="Välj Kategori" options={this._options} defaultSelectedKey={cat} className="Category" onChanged={this._onChangeCategory}/>
              {
                
              }
              <TextField label="Länk till objektets bild" defaultValue={result.BildUrl} className="BildUrl" onChange={this._onChangeBild}/>
              <PeoplePicker
                    context={this.props.context}
                    titleText="People Picker"
                    personSelectionLimit={3}
                    groupName={""}
                    showtooltip={true}
                    isRequired={true}
                    disabled={true}
                    ensureUser={true}
                    selectedItems={this._getPeoplePickerItems}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000}
                    defaultSelectedUsers={[this.props.userEmail]}
                     />
              <PrimaryButton onClick={e => this.deleteItem(this.props.items[0].Id)} text="Ta Bort"/>       
              </div>              

            <DialogFooter>
              <PrimaryButton onClick={this.updateValues} text="Spara" />
              <DefaultButton onClick={this.props.closeDialog} text="Avbryt" />
              <DefaultButton onClick={this.showEditPanel} text="Redigera" />
            </DialogFooter>
          </Dialog>
        )})
        return (
            <div>
                {dialog}
            </div>
        )


    }

    private showEditPanel = () => {
      this.validUser();

      if(this.state.validEditUser !== true)
      return null
      else 
      {
        this.setState({hideEdit: false, message: 'Ditt Id har Verifierats! du kan nu ändra annonsen'})

      }

    }

    private validUser = () => {
      this.updateState();
      if(this.props.items[0].AuthorId !== this.state.values.currentUserId)
      return (this.setState({message: 'Du är inte behörig för ändringar av denna annons!'}))
      else
      {
        console.log('valid user passed')
        this.setState({validEditUser: true, hideEdit: false})
      }
    }
    
    private getSPCUData(): void {      
      sp.web.currentUser.get().then((r: CurrentUser) => { console.log(r) 
        this.setState( prevState => ({
          values:{
        ...prevState.values,
            currentUserId: r['Id']
        }  
        }));  
      });  
    } 
    private choosenCat = (cat: string) => {

        let catetgory = this._options.filter(value => value.text === cat)
        let key = catetgory.map(key => { return key.key[0]})

        return key

    }

    private updateState = (): void => {
       this.setState( prevState => ({
            values:{
          ...prevState.values,
          Pris: this.props.items[0].Pris,
          Title: this.props.items[0].Title,
          UsersId: this.props.items[0].AuthorId,
          Beskrivning: this.props.items[0].Beskrivning,
          BildUrl: this.props.items[0].BildUrl,
          Kategori: this.props.items[0].Kategori
      }  
      }));
    }

    private _getPeoplePickerItems = (items: any) => {

        const process = () =>{
          if(items.length === 0)
          {
            this.setUserState(10);
  
          }  
          else
          {
            this.setUserState(items[0].id)
          }
        }
        try{
          process();

        }catch(error){
          alert(error);
        }
        return process;
    }

    private setUserState = (value: any) => {
      this.setState( prevState => ({
        values:{
      ...prevState.values,
        UsersId: value
    }  
    }));

    }


    private _onChangeTitle = (ev: React.FormEvent<HTMLInputElement>, newValue?: any) => {
        this.setState( prevState => ({
           values:{
          ...prevState.values,
            Title: newValue
        }  
        }));
      }
      // Handle Description input field //
    private _onChangeDesc = (ev: React.FormEvent<HTMLInputElement>, newValue?: any) => {
        
        this.setState( prevState => ({
           values:{
          ...prevState.values,
            Beskrivning: newValue
        }  
        }));
      }
      // Handle Price input field //
    private _onChangePrice = (ev: React.FormEvent<HTMLInputElement>, newValue?: any) => {
        
        this.setState( prevState => ({
           values:{
          ...prevState.values,
            Pris: newValue
        }  
        }));
      }
    private _onChangeBild = (ev: React.FormEvent<HTMLInputElement>, newValue?: any) => {
        
        this.setState( prevState => ({
           values:{
          ...prevState.values,
            BildUrl: newValue
        }  
        }));
      }
       // Handle Kategori input field //
    private _onChangeCategory = (newValue: any) => {
        this.setState( prevState => ({
           values:{
          ...prevState.values,
            Kategori: newValue.text
        }  
        }));
      }

    private updateValues = (): void => {
        let list = sp.web.lists.getByTitle('MarketPlaceList');
        list.items.getById(this.props.items[0].Id).update({
          Title: this.state.values.Title,
          Beskrivning: this.state.values.Beskrivning,
          Pris: this.state.values.Pris,
          Kategori: this.state.values.Kategori,
          BildUrl: this.state.values.BildUrl,  
          UsersId: {
            results: [this.state.values.UsersId] 
          }
        }).then(i => {
          console.log(i);
          
          });
          this.props.closeDialog();
      }

      private deleteItem = (Id: number): void => {
          let list = sp.web.lists.getByTitle("MarketPlaceList");

            list.items.getById(Id).delete().then(_ => {});
            this.props.closeDialog();
      }


    
}