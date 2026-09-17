import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GraphNodeDto {
  @ApiProperty({ example: 'd3b07384-d113-424a-a521-30596287f391' })
  id: string;

  @ApiProperty({ example: '1984' })
  label: string;

  @ApiPropertyOptional({ example: 'READ', description: 'Book status or category group' })
  group?: string;
}

export class GraphEdgeDto {
  @ApiProperty({ example: 'f8a09485-f335-535b-b743-52718409f513' })
  id: string;

  @ApiProperty({ example: 'd3b07384-d113-424a-a521-30596287f391' })
  from: string;

  @ApiProperty({ example: 'e5c18495-e224-535b-b632-41607398f402' })
  to: string;

  @ApiPropertyOptional({ example: 'Direct Influence' })
  label?: string;
}

export class GraphResponseDto {
  @ApiProperty({ type: [GraphNodeDto] })
  nodes: GraphNodeDto[];

  @ApiProperty({ type: [GraphEdgeDto] })
  edges: GraphEdgeDto[];
}