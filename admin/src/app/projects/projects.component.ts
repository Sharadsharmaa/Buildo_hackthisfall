import { Component, OnInit, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements AfterViewInit, OnInit, OnDestroy {
  dtOptions: any = {};
  projectAddForm!: FormGroup;
  projectEditForm!: FormGroup;
  isSubmitted = false;
  isSubmitted1 = false;
  listener: any;
  selectedFile: any;
  constructor(
    private renderer: Renderer2,
    private pipe: DatePipe,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.projectAddForm = this.fb.group({
      name: ['', Validators.required],
      short_description: ['', Validators.required],
      total_area: ['', Validators.required],
      total_price: ['', Validators.required],
      resource: ['', Validators.required]
    });
    this.projectEditForm = this.fb.group({
      _id: ['', Validators.required],
      name: ['', Validators.required],
      short_description: ['', Validators.required],
      total_area: [''],
      total_price: ['', Validators.required],
      resource: ['', Validators.required]
    });

    this.getProjects();
  }

  onFileChanged(e: any) {
    const file = e.target.files[0];

    this.selectedFile = file;

  }
  addProject(): void {
    this.spinner.show();
    var formData = new FormData();
    formData.append('name', this.projectAddForm.value.name);
    formData.append('short_description', this.projectAddForm.value.short_description);
    formData.append('total_area', this.projectAddForm.value.total_area);
    formData.append('total_price', this.projectAddForm.value.total_price);
    formData.append('resource', this.selectedFile);
    this.userService.addProject(formData).subscribe(res => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        $('#addProjectModal').modal('hide');
        this.toastr.success(res.message, 'Success');
        this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => this.router.navigate(['/projects']));
      } else {
        this.toastr.error(res.message, 'Error');
      }
    }, (err) => {
      this.spinner.hide();
      this.toastr.error(err.message, 'Error');
    });
  }

  editUser(id: any): void {
    this.spinner.show();
    this.userService.editUser({ id }).subscribe(
      res => {
        this.spinner.hide();
        if (res.statusCode === 200) {
          if (res.data.user) {
            $('#editUserModal').modal('show');
            this.projectEditForm.patchValue(res.data.user);
          }
        } else {
          this.toastr.error(res.message, 'Error');
        }
      }
      , err => {
        this.spinner.hide();
        this.toastr.error('Something went wrong', 'Error');

      });
  }
  updateUser(): void {
    this.spinner.show();
    this.userService.updateUser(this.projectEditForm.value).subscribe(res => {
      this.spinner.hide();
      if (res.statusCode === 200) {
        $('#editUserModal').modal('hide');
        this.toastr.success(res.message, 'Success');
        this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => this.router.navigate(['/projects']));
      } else {
        this.toastr.error(res.message, 'Error');
      }
    }, (err) => {
      this.spinner.hide();
      this.toastr.error('Something went wrong', 'Error');
    });
  }

  deleteProject(id: string): void {
    if (confirm("Are you sure you want to delete this project?")) {
      this.spinner.show()
      this.userService.deleteProject({ id }).subscribe(res => {
        this.spinner.hide();
        if (res.statusCode === 200) {
          this.toastr.success(res.message, 'Success');
          this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => this.router.navigate(['/projects']));
        } else {
          this.toastr.error(res.message, 'Error');
        }
      }, (err) => {
        this.spinner.hide();
        this.toastr.error('Something went wrong', 'Error');

      })
    }
  }

  getProjects(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: false,
      order: [2, 'desc'],
      ajax: (dataTablesParameters: any, callback: any) => {
        this.spinner.show();
        this.userService.getProjects(dataTablesParameters).subscribe(
          res => {
            this.spinner.hide();
            if (res.statusCode === 200) {
              callback({
                recordsTotal: res.recordsTotal,
                recordsFiltered: res.recordsFiltered,
                data: res.projects
              });
            } else {
              this.spinner.hide();
              this.toastr.error(res.message, 'Error');
            }
          }
          , err => {
            callback({
              recordsTotal: 0,
              recordsFiltered: [],
              data: []
            });
            this.spinner.hide();
            this.toastr.error('Something Went Wrong!', 'Error');
          });
      },
      columns: [
        { title: 'Name', data: 'name', name: 'name', orderable: true },
        { title: 'Short Description', data: 'short_description', name: 'short_description', orderable: false },
        // { title: 'Long Description', data: 'long_description', name: 'long_description', orderable: false },
        { title: 'Total Area', data: 'total_area', name: 'total_area', orderable: false },
        { title: 'Total Price', data: 'total_price', name: 'total_price', orderable: false },
        { title: 'Created&nbsp;On', data: 'createdAt', searchable: false, name: 'createdAt', render: (createdAt: string, type: any, full: any) => this.pipe.transform(full.createdAt, 'short') },
        { title: 'Updated&nbsp;On', data: 'updatedAt', searchable: false, name: 'updatedAt', render: (updatedAt: string, type: any, full: any) => this.pipe.transform(full.updatedAt, 'short') },
        {
          title: 'Action', data: '_id', name: '_id', orderable: false, searchable: false, render(id: string, type: any, full: any): any {
            return `
        <a href="javascript:void(0)">
        <i class="fa fa-edit" title="Edit" edit-id=` + id + `>
        </i>
        </a>
        |
        <a href="javascript:void(0)">
        <i class="fa fa-trash text-danger" title="Delete" delete-id=` + id + `>
        </i>
        </a>
          `;
          }
        },
      ],

      responsive: true
    };
  }

  ngAfterViewInit(): void {
    this.listener = this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute("edit-id")) {
        $('#editUserModal').modal('show');
        this.editUser(event.target.getAttribute('edit-id'));
      } else if (event.target.hasAttribute("delete-id")) {
        this.deleteProject(event.target.getAttribute('delete-id'));
      }
    });
  }

  ngOnDestroy(): void {
    if (this.listener) {
      this.listener();
    }
  }
}
