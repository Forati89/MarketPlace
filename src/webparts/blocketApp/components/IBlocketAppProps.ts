import{ IListItem } from '../IListItem';
import { IUserItem } from '../IUserItem';

export interface IBlocketAppProps {
  loadListItems: () => Promise<IListItem[]>;
  loadUserItems: () => Promise<IUserItem[]>;
}
