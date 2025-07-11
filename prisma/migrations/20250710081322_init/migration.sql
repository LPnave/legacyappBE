-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PM', 'Developer');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('Draft', 'InProgress', 'Completed');

-- CreateTable
CREATE TABLE "User" (
    "UserID" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "Name" TEXT,
    "Role" "Role" NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "Project" (
    "ProjectID" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT,
    "Status" "ProjectStatus" NOT NULL,
    "CreatedByID" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("ProjectID")
);

-- CreateTable
CREATE TABLE "ProjectAssignment" (
    "AssignmentID" TEXT NOT NULL,
    "ProjectID" TEXT NOT NULL,
    "UserID" TEXT NOT NULL,
    "AssignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectAssignment_pkey" PRIMARY KEY ("AssignmentID")
);

-- CreateTable
CREATE TABLE "Page" (
    "PageID" TEXT NOT NULL,
    "ProjectID" TEXT NOT NULL,
    "Title" TEXT,
    "ScreenshotPath" TEXT NOT NULL,
    "Order" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("PageID")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "WorkflowID" TEXT NOT NULL,
    "FromPageID" TEXT NOT NULL,
    "ToPageID" TEXT NOT NULL,
    "Label" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("WorkflowID")
);

-- CreateTable
CREATE TABLE "Comment" (
    "CommentID" TEXT NOT NULL,
    "PageID" TEXT NOT NULL,
    "UserID" TEXT NOT NULL,
    "Content" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("CommentID")
);

-- CreateTable
CREATE TABLE "PDFReport" (
    "ReportID" TEXT NOT NULL,
    "ProjectID" TEXT NOT NULL,
    "GeneratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FilePath" TEXT NOT NULL,

    CONSTRAINT "PDFReport_pkey" PRIMARY KEY ("ReportID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_CreatedByID_fkey" FOREIGN KEY ("CreatedByID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAssignment" ADD CONSTRAINT "ProjectAssignment_ProjectID_fkey" FOREIGN KEY ("ProjectID") REFERENCES "Project"("ProjectID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAssignment" ADD CONSTRAINT "ProjectAssignment_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_ProjectID_fkey" FOREIGN KEY ("ProjectID") REFERENCES "Project"("ProjectID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_FromPageID_fkey" FOREIGN KEY ("FromPageID") REFERENCES "Page"("PageID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_ToPageID_fkey" FOREIGN KEY ("ToPageID") REFERENCES "Page"("PageID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_PageID_fkey" FOREIGN KEY ("PageID") REFERENCES "Page"("PageID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PDFReport" ADD CONSTRAINT "PDFReport_ProjectID_fkey" FOREIGN KEY ("ProjectID") REFERENCES "Project"("ProjectID") ON DELETE RESTRICT ON UPDATE CASCADE;
