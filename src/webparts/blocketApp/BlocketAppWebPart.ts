import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import * as strings from 'BlocketAppWebPartStrings';
import BlocketApp from './components/BlocketApp';
import { IBlocketAppProps } from './components/IBlocketAppProps';
import { sp, Search } from "@pnp/sp";
import { IListItem } from './IListItem';


export interface IBlocketAppWebPartProps {
  description: string;
}

export default class BlocketAppWebPart extends BaseClientSideWebPart<IBlocketAppWebPartProps> {

  public onInit(): Promise<void> {

    return super.onInit().then(_ => {
  
      // other init code may be present
  
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<IBlocketAppProps > = React.createElement(
      BlocketApp,
      {
        loadListItems: this.loadListItems,
        context: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async loadListItems(sortColumn: string, asc: boolean, searchvalue?: string, search?: boolean): Promise<IListItem[]>{
    if(search === true){
    const result: IListItem[] = await sp.web.lists.getByTitle("MarketPlaceList").items
    .filter(`substringof('${encodeURIComponent(searchvalue)}',Title) or substringof('${encodeURIComponent(searchvalue)}',Kategori)`)
    .orderBy(sortColumn, asc).get();
    return (result);
    }
    else
    {
      const result: IListItem[] = await sp.web.lists.getByTitle("MarketPlaceList").items
      .orderBy(sortColumn, asc).get();
      return (result);
    }
  }



  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
