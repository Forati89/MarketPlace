import * as React from 'react';
import styles from './BlocketApp.module.scss';
import { IBlocketAppProps } from './IBlocketAppProps';
import { escape } from '@microsoft/sp-lodash-subset';
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

export interface IBlocketAppState {
  items: IListItem[];
  user: IUserItem[];
}

 export const cardStyles: IDocumentCardStyles = {
    root: { display: 'inline-block', marginRight: 20, marginBottom: 20, width: 320 }
 }
    

export default class BlocketApp extends React.Component<IBlocketAppProps, IBlocketAppState> {

  public constructor(props: IBlocketAppProps, state: IBlocketAppState){
    super(props);
    this.state = {
        items: [],
        user: []
    };

    
  }

  public componentDidMount(): void {
    this._loadListItems();

  }
  public render(): React.ReactElement<IBlocketAppProps> {
    const people: IDocumentCardActivityPerson[] = [
      { name: 'Annie Lindqvist', profileImageSrc: '' },
      { name: 'Roko Kolar', profileImageSrc: '', initials: 'RK' },
      { name: 'Aaron Reid', profileImageSrc: ''},
      { name: 'Christian Bergqvist', profileImageSrc: '', initials: 'CB' }
    ]
    
    let results  = this.state.items.map((result: IListItem) => {
      console.log('BildUrl', result.FieldUrlValue);
      return (<div>
              <DocumentCard styles={cardStyles} onClickHref="http://bing.com">
                <DocumentCardImage height={150} imageFit={ImageFit.cover} imageSrc={result.BildUrl} />
                <DocumentCardDetails>
                  <DocumentCardTitle title={result.Title} shouldTruncate />
                </DocumentCardDetails>
                <DocumentCardActivity activity="Modified March 13, 2018" people={people.slice(0,3)}/>
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
              <h1>Welcome to Market Place</h1>
              <hr/>
              {/* <DefaultButton 
                text="Load user Items"
                title="Load user Items"
                onClick={
                  this._loadUserItems
                }
              /> */}
              {results}
              {userResults}
            </div>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  private async _loadListItems(): Promise<void> {
    const items: IListItem[] = await this.props.loadListItems();
    this.setState({items: items});
  }

  @autobind
  private async _loadUserItems(): Promise<void> {
    const items: IUserItem[] = await this.props.loadUserItems();
    console.log('items in JSX', items)
    this.setState({user: items});
  }

}
