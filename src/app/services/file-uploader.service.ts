import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {

  public Progress: number = 0;
  private onUploadFinished = new Subject<any>(); public onUploadFinished$ = this.onUploadFinished.asObservable();

  constructor(private http: HttpClient) { }

  public Upload_Files(files: any) {

    if (files.length === 0) { return; }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.http.post(environment.fileUrl + 'api/Upload', formData, { reportProgress: true, observe: 'events' })

      .subscribe({
        next: (event: any) => {

          if (event.type === HttpEventType.UploadProgress) { this.Progress = Math.round(100 * event.loaded / event.total); }

          else if (event.type === HttpEventType.Response) { this.onUploadFinished.next(event.body); }

        },

        error: (err: HttpErrorResponse) => console.log(err)
      });
  }

  public Upload_Blob(data: any, fileName: string) {
   
    const formData = new FormData();
    formData.append('file', data, fileName);
  
    this.http.post(environment.fileUrl + 'api/Upload', formData, { reportProgress: true, observe: 'events' })
      .subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.Progress = Math.round(100 * event.loaded / event.total);
          } else if (event.type === HttpEventType.Response) {
            this.onUploadFinished.next(event.body);
          }
        },
        error: (err: HttpErrorResponse) => console.log(err)
      });
  }
}

export class File_Model {
  FileName: string = '';
  FileURL: string = '';
}
