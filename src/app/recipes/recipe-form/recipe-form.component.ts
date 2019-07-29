import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { Recipe } from '../../models/recipe';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent {
  @Output() recipeSubmit = new EventEmitter<Recipe>();
  
  @Input() set recipe(initial: Recipe) {
    if (initial) {
      this.recipeForm.patchValue(initial);
      this.img_preview = initial.image_file;
    }
  }

  public recipeForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    servings: ['', Validators.required],
    cook_time: ['', Validators.required],
    ingredients: ['', Validators.required],
    directions: ['', Validators.required],
    image_file: ['']
  });

  private img: File;
  public img_preview;

  constructor(
    private fb: FormBuilder,
    private ng2ImgMax: Ng2ImgMaxService,
    public sanitizer: DomSanitizer,
    private http: HttpClient) { }

  // getters for form controls
  get title() { return this.recipeForm.get('title'); }
  get description() { return this.recipeForm.get('description'); }
  get servings() { return this.recipeForm.get('servings'); }
  get cook_time() { return this.recipeForm.get('cook_time'); }
  get ingredients() { return this.recipeForm.get('ingredients'); }
  get directions() { return this.recipeForm.get('directions'); }
  get image_file() { return this.recipeForm.get('image_file'); }
  
  // triggered on file input change
  // resize image and upload to S3
  upload_image(fileInput) {
    if(fileInput.target.files && fileInput.target.files[0]) {
      let image = fileInput.target.files[0];

      this.ng2ImgMax.resizeImage(image, 200, 10000).subscribe(
        result => {
          this.img = new File([result], result.name);
          this.get_preview(this.img);
          this.get_signed_request(this.img);
        }, err => {
          console.warn('woops! ', err);
        });
    } else {
      this.img = null;
      this.img_preview = null;
      this.image_file.setValue('');
    }
  }

  // set the initial preview before upload
  // This is good for the ~.5 sec while the
  // image uploads to S3.
  get_preview(file: File) {
    const reader: FileReader = new FileReader();
    reader.onload = ((e) => {
        this.img_preview = e.target['result'];
      });
    reader.readAsDataURL(file);
  }

  // get a signed request for uploading to S3
  get_signed_request(file: File) {
    let ext = file.name.split('.').pop();
    let f_name = Date.now() + '.' + ext;
    this.http.post("/api/sign_s3/", {
      "file_name": f_name,
      "file_type": file.type
    }).subscribe((resp) => {
      this.upload_to_s3(file, resp['data'], resp['url']);
    });
  }

  // upload the image to S3
  upload_to_s3(file: File, s3Data, url: string) {
    var postData = new FormData();
    console.log('S3Data: ', s3Data);
    for (let key in s3Data.fields) {
      postData.append(key, s3Data.fields[key]);
    }
    postData.append('file', file);
    
    this.http.post(s3Data.url, postData)
      .subscribe(() => {
        this.img_preview = url;
        this.image_file.setValue(url);
      });
  }

  onSubmit() {
    this.recipeSubmit.emit(new Recipe(this.recipeForm.value));
  }
}
