import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class TaskEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({name: 'text'})
    name: string

    @Column({default: false})
    isCompleted: boolean
}