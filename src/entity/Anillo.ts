import { IsNotEmpty } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "anillos", schema: "public" })
export class Anillo {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({
    length: 100,
  })
  categoria: string;

  @Column("text", { nullable: true })
  nombre: string;

  @Column("text", { nullable: true })
  pesoOro: string;

  @Column("text", { nullable: true })
  pesoPlata: string;

  @Column("text")
  talla: number;

  @Column("varchar")
  foto: string;

  @Column("varchar", { unique: true })
  referencia: string;
}
