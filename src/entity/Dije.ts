import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "dije", schema: "public" })
export class Dije {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  alto: string;

  @Column("varchar", { length: 100 })
  ancho: string;

  @Column()
  categoria: string;

  @Column("varchar")
  foto: string;

  @Column("text", { nullable: true })
  pesoOro: string;

  @Column("text", { nullable: true })
  pesoPlata: string;

  @Column("varchar", { unique: true, length: 100 })
  referencia: string;
}
