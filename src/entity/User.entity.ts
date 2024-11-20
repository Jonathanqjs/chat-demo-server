import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable, PrimaryColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UniqueMetadata } from 'typeorm/metadata/UniqueMetadata';

@Entity({
  name:'users'
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    zerofill:true,
    name:'user_id'
  })
  userId: number

  @Column({unique:true,name:'user_name'})
  userName:string
  
  @Column(
  )
  password:string

  @CreateDateColumn({
    name:'create_date',
    length:0,
    type:'datetime'
  })
  createDate:string

  @Column({type:'date',nullable:true})
  birthday:Date

  @Column({
    type:'char',
    nullable:true
  })
  gender:'00'|'01'|'02'

  @Column({
    name:'avatar_url',
    type:'varchar',
    default:''
  })
  avatarUrl:string

  constructor(partial: Partial<UserEntity>) {
    super()
    Object.assign(this, partial);
  }
}
