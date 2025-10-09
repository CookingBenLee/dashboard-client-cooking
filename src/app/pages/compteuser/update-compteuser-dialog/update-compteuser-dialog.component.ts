import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

//PRIME NG 
import { MaterialModule } from 'src/app/material.module';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-update-compteuser-dialog',
  templateUrl: './update-compteuser-dialog.component.html',
  styleUrls: ['./update-compteuser-dialog.component.scss'],
  standalone: true,
  providers: [MessageService,ConfirmationService], // ✅ ajoute cette ligne
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MaterialModule,
    InputTextModule,
    DropdownModule,
    CardModule,
    InputNumberModule,
    InputTextareaModule,
    ConfirmDialogModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    DividerModule,
    RippleModule,
    PanelModule,
    ReactiveFormsModule
  ]
})
export class UpdateCompteUserDialogComponent implements OnInit {

  compteForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  // États pour message de succès/erreur
  isError = false;
  isSuccess = false;
  erreur = '';
  sucess = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateCompteUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.compteForm = this.fb.group({
      denomination: [this.data?.denomination || '', Validators.required],
      typeCompte: [this.data?.typeCompte?.id || '', Validators.required],
      address: [this.data?.address?.id || ''],
      photo: [this.data?.photo || ''],
      imageBase64: [this.data?.imageBase64 || '']
    });

    // Prévisualisation de l'image si déjà existante
    this.imagePreview = this.data?.photo
      ? 'http://localhost:5000/uploads/logos/' + this.data.photo
      : null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.compteForm.patchValue({ imageBase64: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onSave() {
    if (this.compteForm.valid) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.isSuccess = true;
        this.sucess = 'Compte utilisateur mis à jour avec succès !';
        this.dialogRef.close(this.compteForm.value);
      }, 1000);
    } else {
      this.isError = true;
      this.erreur = 'Veuillez remplir correctement les champs requis.';
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
