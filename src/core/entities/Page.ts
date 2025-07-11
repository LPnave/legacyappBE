export interface Page {
  PageID: string;
  ProjectID: string;
  Title?: string;
  ScreenshotPath: string;
  Order: number;
  PositionX?: number;
  PositionY?: number;
  CreatedAt: Date;
  UpdatedAt: Date;
} 