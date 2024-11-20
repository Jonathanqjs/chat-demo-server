import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable, PrimaryColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UniqueMetadata } from 'typeorm/metadata/UniqueMetadata';

export enum MessageStatus {
  sent ='00',
  delivered='01',
  read = '02',
}

@Entity({
  name:'messages'
})
export class MessagesEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    zerofill:true,
    name:'message_id'
  })
  messageId: string

  @Column({
    nullable:false,
    name:'sender_id',
    type:'int'
  })
  senderId: number 

  @Column({
    nullable:false,
    name:'receiver_id',
    type:'int'
  })
  receiverId: number

  @Column({name:'content',type:'varchar',default:''})
  content:string

  @Column({
    name:'media_url',
    type:'varchar',
    default:''
  })
  mediaUrl:string

  @CreateDateColumn({
    name:'create_time',
    length:0,
    type:'datetime'
  })
  createDate:string


  constructor(partial: Partial<MessagesEntity>) {
    super()
    Object.assign(this, partial);
  }
}
