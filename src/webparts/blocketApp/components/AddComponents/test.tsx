import * as React from 'react';
import { IListItem } from '../../IListItem';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { TextField, IDropdownOption, Dropdown} from 'office-ui-fabric-react/lib';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp} from "@pnp/sp";
import { IBlocketAppProps } from '../IBlocketAppProps';
import { string } from 'prop-types';

export interface ITestProps {
    items: IListItem[];
    context: WebPartContext;
    openDialog: boolean;
    closeDialog: () => void;
}

export interface ITestState {
    values: {
        Id: number;
        Title: string;
        Pris: any;
        Beskrivning: string;
        Kategori: string;
        UsersId: number;
        BildUrl: string;
    };
}

export default class Test extends React.Component<ITestProps, ITestState> {

    private _options: IDropdownOption[];

    constructor(props: ITestProps, state: ITestState)
    {
        super(props);
        this.state = {
            values: {
                Id: 1,
                Pris: 0,
                Title: '',
                UsersId: 0,
                Beskrivning: '',
                Kategori: '',
                BildUrl: ''
            }
        };
        this._options = [
            { key: '1', text: 'Alla Kategorier' },
            { key: '2', text: 'Fordon' },
            { key: '3', text: 'Elektronik' },
            { key: '4', text: 'Hushåll & Vitvaror' },
            { key: '5', text: 'Hobby' },
            { key: '6', text: 'Övrigt' },
          ];
        
    }  
    
    // public componentWillReceiveProps(): void {
    //   this.setState( prevState => ({
    //       values:{
    //     ...prevState.values,
    //     Pris: this.props.items[0].Pris,
    //     Title: this.props.items[0].Title,
    //     UsersId: this.props.items[0].UsersId,
    //     Beskrivning: this.props.items[0].Beskrivning,
    //     Kategori: this.props.items[0].Kategori,
    //     BildUrl: this.props.items[0].BildUrl
    // }  
    // }));
  
    // }
    

    public render():  React.ReactElement<ITestProps> {

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
            //   subText: 'Dinn Annons är nu upplagd, tack för du använder MarketPlace'
            }}
            modalProps={{
              isBlocking: false,
              styles: { main: { minWidth: 900 } }
            }}>
              <TextField label="Mata in Rubrik för din annons" defaultValue={result.Title} className="Title" onChange={this._onChangeTitle}/>
              <TextField label="Mata in Beskrivning" defaultValue={result.Beskrivning} className="Description" onChange={this._onChangeDesc}/>
              <TextField label="Mata in Pris för Objektet" defaultValue={result.Pris}  className="Price" type="number" prefix="kr" onChange={this._onChangePrice}/>
              <Dropdown label="Välj Kategori" options={this._options} defaultSelectedKey={'1'} className="Category" onChanged={this._onChangeCategory}/>
              {
                
              }
              <TextField label="Länk till objektets bild" defaultValue={result.BildUrl} className="BildUrl" onChange={this._onChangeBild}/>
              <PeoplePicker
                    context={this.props.context}
                    titleText="People Picker"
                    personSelectionLimit={3}
                    groupName={""} // Leave this blank in case you want to filter from all users
                    showtooltip={true}
                    isRequired={true}
                    disabled={false}
                    ensureUser={true}
                    selectedItems={this._getPeoplePickerItems}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000}
                     />
            <DialogFooter>
              <PrimaryButton onClick={this.updateValues} text="Spara" />
              <DefaultButton onClick={this.props.closeDialog} text="Avbryt" />
            </DialogFooter>
          </Dialog>
        )})
        return (
            <div>
                {dialog}
            </div>
        )


    }

    
    private choosenCat = (cat: string) => {
        let s = this._options.filter(value => value.text === 'Alla Kategorier')
        

        console.log('choosenCat', s.filter(value=>[value.key[0]]))
        

    }

    private updateState = (): void => {
            this.setState( prevState => ({
            values:{
          ...prevState.values,
          Pris: this.props.items[0].Pris,
          Title: this.props.items[0].Title,
          UsersId: this.props.items[0].UsersId,
          Beskrivning: this.props.items[0].Beskrivning,
          Kategori: this.props.items[0].Kategori,
          BildUrl: this.props.items[0].BildUrl
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
        this.updateState();
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


    
}