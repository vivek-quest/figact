type IDMap<T> = { [id: string]: T };

export type StyleType = "FILL" | "TEXT" | "EFFECT" | "GRID";

export type NodeType = 
  | "DOCUMENT"
  | "CANVAS"
  | "FRAME"
  | "GROUP"
  | "VECTOR"
  | "BOOLEAN_OPERATION"
  | "STAR"
  | "LINE"
  | "ELLIPSE"
  | "REGULAR_POLYGON"
  | "RECTANGLE"
  | "TEXT"
  | "SLICE"
  | "COMPONENT"
  | "COMPONENT_SET"
  | "INSTANCE";

export interface Style {
  key: string;
  file_key: string;
  node_id: string;
  style_type: StyleType;
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    handle: string;
    img_url: string;
  };
  sort_position?: string;
  [extra: string]: any;
}

export interface FileStyle {
  key: string;
  name: string;
  description: string;
  styleType: StyleType;
  remote: boolean;
  [extra: string]: any;
}

export interface Component {
  key: string;
  file_key: string;
  node_id: string;
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user?: any;
  containing_frame?: any;
  [extra: string]: any;
}

export interface ComponentSet {
  key: string;
  file_key: string;
  node_id: string;
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user?: any;
  containing_frame?: any;
  [extra: string]: any;
}

export interface Node {
  id: string;
  name: string;
  type: NodeType;
  children?: Node[];
  [extra: string]: any;
}

export interface Branch {
  key: string;
  name: string;
  thumbnail_url: string;
  last_modified: string;
  link_access: string;
  [extra: string]: any;
}

export interface FileBase {
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  role: string;
  editorType: string;
  linkAccess: string;
}

export interface File extends FileBase {
  document: Node;
  components: IDMap<Component>;
  componentSets: IDMap<ComponentSet>;
  schemaVersion: number;
  styles: IDMap<FileStyle>;
  mainFileKey?: string;
  branches?: Branch[];
  [extra: string]: any;
}

export interface FileNodes extends FileBase {
  nodes: IDMap<{
    document: Node;
    components: IDMap<Component>;
    componentSets: IDMap<ComponentSet>;
    styles: IDMap<FileStyle>;
  }>;
  [extra: string]: any;
}

export interface GetFileResponse extends File {}

export interface GetFileNodesResponse extends FileNodes {}

export interface GetFileStylesResponse {
  meta: {
    styles: Style[];
  };
  status: number;
  error?: boolean;
  [extra: string]: any;
}

export interface GetStyleResponse {
  meta: Style;
  status: number;
  error?: boolean;
  [extra: string]: any;
}