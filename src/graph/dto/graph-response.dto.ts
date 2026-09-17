export class GraphNodeDto {
  id: string;
  label: string;
  group?: string; // Es. book status (READ, READING, WISHLIST)
}

export class GraphEdgeDto {
  id: string;
  from: string; // sourceBookId
  to: string;   // discoveredBookId
  label?: string; // description
}

export class GraphResponseDto {
  nodes: GraphNodeDto[];
  edges: GraphEdgeDto[];
}