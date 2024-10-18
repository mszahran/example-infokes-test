import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { API_BASE_URL } from "../setting/variables";
import { Folder } from '../models/folder.model';
import { File } from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  constructor(private http: HttpClient) {}

  getBreadcrumbPath(folderId: number): Observable<Folder> {
    return this.http.get<Folder>(`${API_BASE_URL}/folders/${folderId}/breadcrumb`);
  }

  getFolderTree(): Observable<Folder[]> {
    return this.http.get<Folder[]>(`${API_BASE_URL}/folders/tree`).pipe(
      catchError(this.handleError<Folder[]>('getFolderTree', []))
    );
  }

  getFolderContents(id: number): Observable<{ subfolders: Folder[], files: File[] }> {
    return this.http.get<{ subfolders: Folder[], files: File[] }>(`${API_BASE_URL}/folders/${id}/contents`).pipe(
      catchError(this.handleError<{ subfolders: Folder[], files: File[] }>('getFolderContents'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  createFolder(name: string, id: number): Observable<any> {
    const parent_id = id === 0 ? null : id;
    return this.http.post(`${API_BASE_URL}/folders`, { name,  parent_id});
  }

  createFiles(name: string, id: number): Observable<any> {
    const folder_id = id === 0 ? null : id;
    return this.http.post(`${API_BASE_URL}/files`, { name,  folder_id});
  }
}
