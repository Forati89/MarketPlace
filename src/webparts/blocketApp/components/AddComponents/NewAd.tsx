import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { IButtonProps, DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { TextField, IDropdownOption, Dropdown, values} from 'office-ui-fabric-react/lib';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { IBlocketAppProps } from '../IBlocketAppProps';
import { autobind } from 'office-ui-fabric-react';
import { sp} from "@pnp/sp";
import { getGUID } from "@pnp/common";
import { peoplePicker } from 'office-ui-fabric-react/lib/components/FloatingPicker/PeoplePicker/PeoplePicker.scss';
import Test from './test'

export interface INewAdState {
    hideDialog: boolean;
    values: {
        Title: string;
        Pris: number;
        Beskrivning: string;
        Datum: Date;
        Kategori: string;
        UsersId: number;
        BildUrl: string;
    };
}


  
export default class NewAd extends React.Component<IBlocketAppProps, INewAdState> {
    private _options: IDropdownOption[];

    constructor(props: IBlocketAppProps, state: INewAdState)
    {
        super(props);
        this.state = {
            hideDialog: true,
            values: {
                Pris: 0,
                Title: 'Emptysss',
                UsersId: 10,
                Beskrivning: 'Emptysss',
                Datum: new Date(),
                Kategori: 'Emptyss',
                BildUrl: 'https://www.nocowboys.co.nz/images/v3/no-image-available.png'
            }
        };
 
        this._options = [
            { key: '1', text: 'Alla Kategorier' },
            { key: '2', text: 'Fordon' },
            { key: '3', text: 'Elektronik' },
            { key: '4', text: 'Hushåll & Vitvaror' },
            { key: '5', text: 'Hobby' },
            { key: '2', text: 'Övrigt' },
          ];
          
    }

  
    public render():  React.ReactElement<IBlocketAppProps> {

      return (
        <div>
          <DefaultButton secondaryText="Öppnar lägg till annons form" onClick={this._showDialog} text="Lägg till annons" />
          <Dialog
            hidden={this.state.hideDialog}
            onDismiss={this._closeDialog}
            dialogContentProps={{
              type: DialogType.largeHeader,
              title: 'Lägg till annons',
            //   subText: 'Dinn Annons är nu upplagd, tack för du använder MarketPlace'
            }}
            modalProps={{
              isBlocking: false,
              styles: { main: { minWidth: 1200 } }
            }}
          >
              <TextField label="Mata in Rubrik för din annons" className="Title" onChange={this._onChangeTitle}/>
              <TextField label="Mata in Beskrivning" className="Description" onChange={this._onChangeDesc}/>
              <TextField label="Mata in Pris för Objektet" className="Price" type="number" prefix="kr" onChange={this._onChangePrice}/>
              <Dropdown label="Välj Kategori" options={this._options} className="Category" onChanged={this._onChangeCategory}/>
              {
                
              }
              <TextField label="Länk till objektets bild" className="BildUrl" onChange={this._onChangeBild}/>
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
              <PrimaryButton onClick={this.addValues} text="Spara" />
              <DefaultButton onClick={this._closeDialog} text="Avbryt" />
            </DialogFooter>
          </Dialog>
        </div>
      );
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


    private _showDialog = (): void => {
        this.setState({ hideDialog: false });
      }
      
    private _closeDialog = (): void => {
        this.setState({ hideDialog: true });
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

    private addValues = (): void => {
        sp.web.lists.getByTitle('MarketPlaceList').items.add({
          Title: this.state.values.Title,
          Beskrivning: this.state.values.Beskrivning,
          Pris: this.state.values.Pris,
          Kategori: this.state.values.Kategori,
          Datum: this.state.values.Datum,
          BildUrl: this.state.values.BildUrl,  
          UsersId: {
            results: [this.state.values.UsersId] 
          }
        }).then(i => {
          console.log(i);
          
          });
          this._closeDialog();
      }

  }