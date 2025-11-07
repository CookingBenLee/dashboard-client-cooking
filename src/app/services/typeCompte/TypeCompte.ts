export class TypeCompte {
  id?: number;
  libelle?: string;
  description?: string;
  isDeleted?: boolean;

  constructor(
    id?: number,
    libelle?: string,
    description?: string,
    isDeleted?: boolean
  ) {
    this.id = id;
    this.libelle = libelle;
    this.description = description;
    this.isDeleted = isDeleted;
  }
}
