import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { User } from "./user";
import { Activity } from "./activity";

@Entity({ name: "timesheets" })
@Index("idx_user_running_timesheet", ["userId", "runningFlag"], {
  unique: true,
})
export class Timesheet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "datetime" })
  startTime: Date;

  @Column({ type: "datetime", nullable: true })
  endTime: Date | null;

  @Column()
  activityId: number;

  @Column()
  userId: number;

  // Generated column that's 1 when timesheet is running, NULL when stopped
  // This enables unique constraint: only one (userId, 1) combination allowed
  // Multiple (userId, NULL) combinations are allowed due to MySQL NULL behavior
  @Column({
    type: "tinyint",
    asExpression: "CASE WHEN endTime IS NULL THEN 1 ELSE NULL END",
    generatedType: "STORED",
    nullable: true,
  })
  runningFlag: number | null;

  @ManyToOne(() => Activity)
  @JoinColumn({ name: "activityId" })
  activity: Activity;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
