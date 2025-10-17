export type IconMeta = {
  id: string;
  name: string;
  description: string;
  tags?: string[];
  recommended?: {
    scale?: number;
    x?: number;
    y?: number;
    colorNotes?: string;
  };
};


