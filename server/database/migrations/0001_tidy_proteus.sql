ALTER TABLE "workspaceMembers" RENAME COLUMN "workSpaceId" TO "workspaceId";--> statement-breakpoint
ALTER TABLE "workspaceMembers" DROP CONSTRAINT "workspaceMembers_workSpaceId_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "workspaceMembers" DROP CONSTRAINT "workspaceMembers_workSpaceId_userId_pk";--> statement-breakpoint
ALTER TABLE "workspaceMembers" ADD CONSTRAINT "workspaceMembers_workspaceId_userId_pk" PRIMARY KEY("workspaceId","userId");--> statement-breakpoint
ALTER TABLE "workspaceMembers" ADD CONSTRAINT "workspaceMembers_workspaceId_workspaces_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;