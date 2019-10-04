import{ IListItem } from '../IListItem';
import { IUserItem } from '../IUserItem';
import { WebPartContext } from '@microsoft/sp-webpart-base';  


export interface IBlocketAppProps {
  loadListItems?: (sortColumn: string, asc: boolean, searchvalue: string, search?: boolean) => Promise<IListItem[]>;
  loadUserItems?: () => Promise<IUserItem[]>;
  context?: WebPartContext;
  items?: IListItem[];
  hideDialog?: any;
  openDialog?: boolean;
  closeDialog?: () => void;
}
