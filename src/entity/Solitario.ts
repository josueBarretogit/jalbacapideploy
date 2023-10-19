import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "solitarios", schema: "public" })
export class Solitario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  pesoOro: string;

  @Column("varchar", { nullable: true })
  pesoPlata: string;

  @Column("varchar")
  talla: number;

  @Column("varchar")
  foto: string;

  @Column("varchar", { unique: true })
  referencia: string;

  @Column("varchar")
  tamanoPiedra: string;

  @Column("varchar")
  formaPiedra: string | "ovalado" | "corazon" | "redondo";
}
