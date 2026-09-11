import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn 
} from "typeorm";

@Entity('books')
export class Book {

}