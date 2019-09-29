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
import { sp, spODataEntityArray, Item } from "@pnp/sp";
import { IListItem } from './IListItem';
import { IUserItem } from './IUserItem';

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
        loadUserItems: this.loadUserItems

      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async loadListItems(): Promise<IListItem[]>{
    const result: IListItem[] = await sp.web.lists.getByTitle("MarketPlaceList").items.getAll();
    console.log('result', result);
    return (result);
  }

  private async loadUserItems(): Promise<IUserItem[]>{
    const result: IUserItem[] = await sp.web.lists.getByTitle("MarketPlaceList").items.select('Author/Id,Author/Title,Author/Name,Author/EMail')
    .expand('Author')
    .getAll().then((item: any[])=>{
      console.log('user', item);
      return(item);

    });

    return(result);
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
