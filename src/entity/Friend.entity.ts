import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable, PrimaryColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, Unique, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UniqueMetadata } from 'typeorm/metadata/UniqueMetadata';
import { UserEntity } from './User.entity';

export enum FriendStatus {
  accepted ='00',
  pending='01',
}


@Unique(['userId', 'friendId'])
@Entity({name:'users_relationship'})
export class FriendEntity extends BaseEntity {

  @PrimaryGeneratedColumn({
    zerofill:true,
    name:'relationship_id'
  })
  relationshipId: string

  @Column({
    name:'user_id',
    type:'int'
  })
  userId: number

  @Column({
    name:'friend_id',
    type:'int'
  })
  friendId: number

  @Column({
    type:'char',
    nullable:true
  })
  status:FriendStatus

  @CreateDateColumn({
    name:'create_date',
    length:0,
    type:'datetime'
  })
  createDate:string

  constructor(partial: Partial<FriendEntity>) {
    super()
    Object.assign(this, partial);
  }
}
