import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

@Entity({ name: "usuarios", schema: "public" })
export class Usuario {
  constructor(
    correo: string,
    contrasena: string,
    rol: string,
    estado: boolean,
  ) {
    this.correo = correo;
    this.contrasena = contrasena;
    this.rol = rol;
    this.estado = estado;
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
    message: "La contraseña es muy corta minimo 7",
  })
  @Column("varchar", { length: 100 })
  contrasena: string;

  @Column("varchar", { length: 100 })
  rol: string;

  @Column("boolean")
  estado: boolean;
}

export default Usuario;
