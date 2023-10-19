import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
@Entity({ name: "usuarios", schema: "public" })
export class Usuario {
  constructor(correo: string, contrasena: string) {
    this.correo = correo;
    this.contrasena = contrasena;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({
    message: "El corre no puede estar vacio",
  })
  @IsEmail(undefined, {
    message: "El correo es  invalido",
  })
  @Column("varchar", { length: 100, unique: true })
  correo: string;

  @IsNotEmpty({
    message: "La contraseña no puede estar vacia",
  })
  @MinLength(6, {
    message: "La contraseña es muy corta minimo 6 caracteres maximo 20",
  })
  @MaxLength(20, {
    message: "La contraseña es muy corta minimo 6 caracteres maximo 20",
  })
  @Column("varchar", { length: 100 })
  contrasena: string;
}

export default Usuario;
