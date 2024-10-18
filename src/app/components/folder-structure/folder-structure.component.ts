import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {FolderService} from '../../services/folder.service';
import {Folder} from '../../models/folder.model';
import {File} from '../../models/file.model';

@Component({
  selector: 'app-folder-structure',
  templateUrl: './folder-structure.component.html',
  styleUrls: ['./folder-structure.component.css']
})
export class FolderStructureComponent implements OnInit {
  allFolders: Folder[] = [];
  subFolders: Folder[] = [];
  files: File[] = [];
  breadcrumb: Folder[] = [];
  newFolderName: string = '';
  newFileName: string = '';
  formAddFolder: boolean = false;
  formAddFile: boolean = false;
  visibleFolder: boolean = false;
  visibleFile: boolean = false;
  idFolder: number = 0;

  private selectedFolderId = new Subject<number>();

  constructor(private folderService: FolderService) {
  }

  ngOnInit(): void {
    this.loadFolderTree();
    this.setupFolderSelection();
  }

  loadFolderTree() {
    this.folderService.getFolderTree().subscribe(folders => {
      this.allFolders = folders;
    });
  }

  setupFolderSelection() {
    this.selectedFolderId.pipe(
      switchMap(id => {
        return this.folderService.getFolderContents(id);
      })
    ).subscribe(contents => {
      this.subFolders = contents.subfolders;
      this.files = contents.files;

      // Memanggil loadBreadcrumb untuk memperbarui jalur breadcrumb saat folder dipilih
      this.loadBreadcrumb(this.idFolder);
    });
  }

  onFolderClick(folderId: number) {
    this.selectedFolderId.next(folderId);
    this.idFolder = folderId;
    this.newFolderName = '';
  }

  createFolder() {
    if (this.newFolderName.trim()) {
      this.folderService.createFolder(this.newFolderName, this.idFolder)
        .subscribe(
          response => {
            this.newFolderName = '';
            this.subFolders.push(response);
            this.formAddFolder = !this.formAddFolder;
            this.visibleFolder = !this.visibleFolder;
            this.loadFolders();
          },
          error => {
            console.error('Error creating folder', error);
          }
        );
    }
  }

  loadFolders() {
    this.folderService.getFolderTree().subscribe(folders => {
      this.allFolders = folders;
    });
  }

  loadBreadcrumb(folderId: number) {
    this.folderService.getBreadcrumbPath(folderId).subscribe({
      next: (data) => {
        this.breadcrumb = this.buildBreadcrumb(data);
      },
      error: (err) => {
        console.error("Gagal memuat breadcrumb:", err);
      }
    });
  }

  buildBreadcrumb(folder: Folder): Folder[] {
    const path: Folder[] = [];
    let current: Folder | undefined | null = folder;
    while (current) {
      path.unshift(current);
      current = current.parent || null;
    }
    return path;
  }

  onclickFolder() {
    this.formAddFolder = !this.formAddFolder;
    this.visibleFolder = !this.visibleFolder
  }

  onclickFile() {
    this.formAddFile = !this.formAddFile;
    this.visibleFile = !this.visibleFile
  }

  createFiles() {
    if (this.newFileName.trim()) {
      this.folderService.createFiles(this.newFileName, this.idFolder)
        .subscribe(
          response => {
            this.newFileName = '';
            this.formAddFile = !this.formAddFile;
            this.visibleFile = !this.visibleFile;
            this.files.push(response);
          },
          error => {
            console.error('Error creating files', error);
          }
        );
    }
  }
}
