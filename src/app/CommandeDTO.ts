import { LigneCommandeDTO } from "./LigneCommandeDTO";

export interface CommandeDTO {
    tiersId: number;
    adresse: string;
    lignes: LigneCommandeDTO[];
  }