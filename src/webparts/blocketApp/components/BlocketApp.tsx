import * as React from 'react';
import styles from './BlocketApp.module.scss';
import { IBlocketAppProps } from './IBlocketAppProps';
import {DefaultButton, autobind, people } from 'office-ui-fabric-react';
import { IListItem } from '../IListItem';
import { IUserItem } from '../IUserItem';
import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardTitle,
  DocumentCardDetails,
  DocumentCardImage,
  IDocumentCardStyles,
  IDocumentCardActivityPerson
} from 'office-ui-fabric-react/lib/DocumentCard';
import { ImageFit } from 'office-ui-fabric-react/lib/Image';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import NavBar from './StatelessComponents/NavBar';
import NewAd from './AddComponents/NewAd';
import ViewAd from './AddComponents/ViewAd'
import { Checkbox} from 'office-ui-fabric-react/lib/Checkbox';
import { sp} from "@pnp/sp";
import {IUserItemList} from './IUserItemList';
import { DisplayMode } from '@microsoft/sp-core-library';

export interface IBlocketAppState {
  items: IListItem[];
  newItems: IListItem[];
  user: IUserItem[];
  sortColumn: string;
  asc: boolean;
  dateDisabled: boolean;
  priceDisabled: boolean;
  ascDisabled: boolean;
  descDisabled: boolean;
  searchvalue: string
  search: boolean;
  openDialog: boolean;
  getEMail: any;
  EMail: any;
}

 export const cardStyles: IDocumentCardStyles = {
    root: { display: 'inline-block', paddingTop: 40, marginRight: 20, marginBottom: 20, minWidth: 500, textAlign: "center", fontWeight: 'bold', color: 'black' }
 };
    

export default class BlocketApp extends React.Component<IBlocketAppProps, IBlocketAppState> {

  public constructor(props: IBlocketAppProps, state: IBlocketAppState,){
    super(props);
    this.state = {
        items: [],
        user: [],
        newItems: [],
        sortColumn: 'Id',
        asc: true,
        priceDisabled: false,
        dateDisabled: false,
        ascDisabled: false,
        descDisabled: false,
        searchvalue: '',
        search: false,
        openDialog: true,
        getEMail: '',
        EMail: 'H.Allak@allaksp.onmicrosoft.com'
    };
    
  }

  public componentDidMount(): void {
    this._loadListItems();
    this.loadOpenDialog(1);
    this.getUser(1);
  }

  public render(): React.ReactElement<IBlocketAppProps> {
    const checkboxStyles = () => {
      return {
        root: {
          marginTop: '10px',
          backgroundColor: 'white',
        },
      };
    };

    let results  = this.state.items.map((result: IListItem) => {
        let dateFromate = [result.Datum];
        let stringDate = dateFromate.slice(0,10)
      return (<div>
              <DocumentCard styles={cardStyles}>
                <DocumentCardImage height={150}  imageFit={ImageFit.centerContain} imageSrc={result.BildUrl} />
                <DocumentCardDetails>
                  <h1>{result.Title}</h1>
                  <h3>{result.Pris +' kr'}</h3>
                  <p>{result.Beskrivning.slice(0,10)+"..."}</p>
                  <h3>{"Annons Skapad: " + stringDate}</h3>
                  <DefaultButton onClick={e=> this.setId(result.Id)} text="Visa"/>
                </DocumentCardDetails>
              </DocumentCard>
       </div>);
    });
    let userResults  = this.state.user.map((result: IUserItem) => {
      return (<div>
        <p>{result.Author}</p>
        <p>{result[0].Author[0].Name}</p>
        <p>{result[0].Author[0].Id}</p>
       </div>);
    });
    return (
      <div className={ styles.blocketApp }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
                {/* <NavBar> <h1>Welcome to Market Place</h1> </NavBar> */}
                <NewAd context={this.props.context}
                 loadListItems={this.props.loadListItems}
                 loadUserItems={this.props.loadUserItems}
                  />
                 <ViewAd
                 context={this.props.context} 
                 items={this.state.newItems} 
                 openDialog={this.state.openDialog}
                 closeDialog={this.closeDialog}
                 userEmail={this.state.EMail}
                   />
                <br/>
                <div className={styles.checkBoxes}>
                  <Checkbox styles={checkboxStyles} checked={this.state.dateDisabled} label="Sortera på pris"  onChange={this._onPriceChecked} />
                  <Checkbox styles={checkboxStyles} checked={this.state.priceDisabled} label="Sortera på datum" onChange={this._onDateChecked} />
                  <Checkbox styles={checkboxStyles} checked={this.state.descDisabled} label="Stigande" onChange={this._onASCChecked} />
                  <Checkbox styles={checkboxStyles} checked={this.state.ascDisabled} label="Fallande" onChange={this._onDESCChecked} />
                </div>
                <div className={styles.checkBoxes}>
                  <TextField value={this.state.searchvalue} onChanged={e => this.onSearch(e)} />
                  <DefaultButton secondaryText="Bekräftar sortering" onClick={this._loadListItems} text="Sök"  /> 
                  </div>
              {results}
              {userResults}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private readUserItems = () => {
    let data = Array.prototype.concat(this.state.getEMail)
      data.map(res => {
       this.setState({EMail: [res][0].Author.EMail})
    })
  }

  private getUser = (Id: number) => {
     sp.web.lists.getByTitle("MarketPlaceList").items
    .getById(Id)
    .select("Author", "Author/EMail", "Author/ID", "Author/Title").expand("Author").get().then(items => {
      this.setState({getEMail: items})
      });
    }


  private closeDialog = () => {
      this.setState({openDialog: true})
  }

  
  private setId = (Id: number) => {
    this.setState({openDialog: false});
    this.loadOpenDialog(Id);
    this.readUserItems();
    
  }

  private loadOpenDialog = (Id: number): void => {

    sp.web.lists.getByTitle("MarketPlaceList").items
    .filter(`Id eq ${Id} `).get().then(result =>
      {
        this.setState({newItems: result})
    })
    

  }


  @autobind
  private async _loadListItems(): Promise<void> {
    const items: IListItem[] = await this.props.loadListItems(this.state.sortColumn, this.state.asc, this.state.searchvalue, this.state.search);
    this.setState({items: items});
  }

  @autobind
  private async _loadUserItems(): Promise<void> {
    const items: IUserItem[] = await this.props.loadUserItems();
    console.log('items in JSX', items);
    this.setState({user: items});
  }

  private _onDateChecked = (ev: React.FormEvent<HTMLElement>, priceChecked: boolean): void => {
    if(this.state.priceDisabled === false)
    this.setState({priceDisabled: true, dateDisabled: false, sortColumn: 'Datum'})
    else
    this.setState({priceDisabled: false, sortColumn: 'Id'})
    console.log('blocketappUsersId', this.state.newItems[0].UsersId[0])

  }

  private _onPriceChecked = (ev: React.FormEvent<HTMLElement>, priceChecked: boolean): void => {
    if(this.state.dateDisabled === false)
    this.setState({dateDisabled: true, priceDisabled: false, sortColumn: 'Pris'})
    else
    this.setState({dateDisabled: false, sortColumn: 'Id'})
  }

  private _onASCChecked = (ev: React.FormEvent<HTMLElement>): void => {
    if(this.state.descDisabled === false)
    this.setState({descDisabled: true, ascDisabled: false, asc: true})
    else
    this.setState({descDisabled: false, asc: false})
  }

  private _onDESCChecked = (ev: React.FormEvent<HTMLElement>): void => {
    if(this.state.ascDisabled === false)
    this.setState({ascDisabled: true, descDisabled: false, asc: false})
    else
    this.setState({ascDisabled: false, asc: false})
  }

  private onSearch = (searchPhrase: string) => {
    if(searchPhrase.length >= 1)
    {
      this.setState({ searchvalue: searchPhrase, search: true })
    }
    else
    {
      this.setState({ searchvalue: searchPhrase, search: false })
    }

  }


}
