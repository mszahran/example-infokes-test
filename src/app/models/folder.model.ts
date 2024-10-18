export interface Folder {
  id: number;
  name: string;
  parent_id?: number;
  children?: Folder[];
  created_at: string;
  updated_at: string;
  parent?: Folder;
}
