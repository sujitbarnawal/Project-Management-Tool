import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
  jsonb,
  boolean
} from "drizzle-orm/pg-core";

//users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password"),
  avatar_url: text("avatar_url"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  subscription_plan: text("subscription_plan").default("free").notNull(),
  subscription_expiry: timestamp("subscription_expiry"),
});
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

//workspaces table
export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  ownerId: uuid("ownerId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;

//workspace members
export const workspaceMembers = pgTable(
  "workspaceMembers",
  {
    workspaceId: uuid("workspaceId")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 50 }).notNull().default("member"),
    joinedAt: timestamp("joinedAt").notNull().defaultNow(),
  },
  (table) => {
    return { pk: primaryKey({ columns: [table.workspaceId, table.userId] }) };
  },
);

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;

//boards
export const boards = pgTable("boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspaceId")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  position: integer("position").notNull().default(0),
  backgroundColor: varchar("backgroundColor", { length: 7 }).default("#0079BF"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Board = typeof boards.$inferSelect;
export type NewBoard = typeof boards.$inferInsert;

//lists
export const lists = pgTable("lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("boardId")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const listRelations=relations(lists,({one,many})=>({
  board:one(boards,{
    fields:[lists.boardId],
    references:[boards.id]
  }),
  tasks:many(tasks)
}))

export type List = typeof lists.$inferSelect;
export type NewList = typeof lists.$inferInsert;

//tasks
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  listId: uuid("listId")
    .notNull()
    .references(() => lists.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  position: integer("position").notNull().default(0),
  dueDate: timestamp("dueDate"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const tasksRelations=relations(tasks,({one,many})=>({
  list:one(lists,{
    fields:[tasks.listId],
    references:[lists.id]
  }),
  assignees:many(taskAssignees),
  comments:many(comments),
  attachments:many(attachments)
}))

export type Task = typeof tasks.$inferSelect;
export type NewTAsk = typeof tasks.$inferSelect;

//task assignees
export const taskAssignees = pgTable(
  "taskAssignees",
  {
    taskId: uuid("taskId")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assignedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.taskId, table.userId] }),
    };
  },
);

export const taskAssigneesRelations = relations(taskAssignees,({one})=>({
  task:one(tasks,{
    fields:[taskAssignees.taskId],
    references:[tasks.id]
  }),
  user:one(users,{
    fields:[taskAssignees.userId],
    references:[users.id]
  })
}))

export type TaskAssignee = typeof taskAssignees.$inferSelect;
export type NewTaskAssignee = typeof taskAssignees.$inferInsert;

//comments
export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("taskId")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const commentsRelations=relations(comments,({one})=>({
  task:one(tasks,{
    fields:[comments.taskId],
    references:[tasks.id]
  }),
  user:one(users,{
    fields:[comments.userId],
    references:[users.id]
  })
}))

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

//attachments
export const attachments = pgTable("attachments",{
    id:uuid("id").primaryKey().defaultRandom(),
    taskId: uuid("taskId")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
    filename:text("filename").notNull(),
    url:text("url").notNull(),
    publicId:varchar("publicId",{length:255}),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const attachmentsRelations = relations(attachments,({one})=>({
  task:one(tasks,{
    fields:[attachments.taskId],
    references:[tasks.id]
  })
}))

export type Attachment = typeof attachments.$inferSelect;
export type NewAttachment = typeof attachments.$inferInsert;

//activitylogs
export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 100 }).notNull(), // created, updated, deleted, moved, etc.
  entityType: varchar('entity_type', { length: 50 }).notNull(), // board, list, task, etc.
  entityId: uuid('entity_id'),
  metadata: jsonb('metadata'), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;


export const workspaceInvitations = pgTable("workspace_invitations",{
  id:uuid("id").primaryKey().defaultRandom(),
  workspaceId:uuid("workspaceId").references(()=>workspaces.id,{onDelete:"cascade"}),
  email:varchar("email",{length:255}).notNull(),
  role:varchar("role",{length:50}).notNull(),
  token:varchar("token",{length:255}).notNull().unique(),
  invitedBy:uuid("invitedBy").references(()=>users.id,{onDelete:"cascade"}),
  expiresAt:timestamp("expiresAt").notNull(),
  accepted:boolean("accepted").default(false),
})


export type WorkspaceInvitation =typeof workspaceInvitations.$inferSelect;
export type NewWorkspaceInvitation =typeof workspaceInvitations.$inferInsert;