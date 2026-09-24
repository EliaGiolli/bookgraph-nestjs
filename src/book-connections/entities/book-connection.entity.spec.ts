import { getMetadataArgsStorage } from 'typeorm';
import { BookConnection } from './book-connection.entity.js';
import { dataSourceOptions } from '../../config/data-source.js';

// Two entity classes were once mapped to `book_connections`: only one of them
// was registered with TypeORM, and the other was the one the service injected —
// so every book-connections and graph request failed with
// EntityMetadataNotFoundError. These tests pin the consolidation.
describe('BookConnection entity mapping', () => {
  const entitiesForTable = () =>
    getMetadataArgsStorage().tables.filter((table) => table.name === 'book_connections');

  it('is the only class mapped to the book_connections table', () => {
    const mapped = entitiesForTable();

    expect(mapped).toHaveLength(1);
    expect(mapped[0].target).toBe(BookConnection);
  });

  it('is the class registered with the TypeORM CLI data source', () => {
    // data-source.ts and app.module.ts must register the same class the service
    // injects, or migrations describe a table nobody queries.
    expect(dataSourceOptions.entities).toContain(BookConnection);
  });

  describe('columns', () => {
    const columnNames = () =>
      getMetadataArgsStorage()
        .filterColumns(BookConnection)
        .map((column) => column.propertyName);

    it.each(['userId', 'sourceBookId', 'discoveredBookId', 'description', 'createdAt'])(
      'declares %s',
      (name) => {
        expect(columnNames()).toContain(name);
      },
    );

    it.each(['discoveryMethod', 'suggestedBy'])(
      'no longer declares %s',
      (name) => {
        expect(columnNames()).not.toContain(name);
      },
    );
  });

  it('exposes both inverse sides so Book.sourceConnections resolves', () => {
    // Book declares OneToMany against these; without the inverse function on the
    // ManyToOne, TypeORM cannot resolve the relation.
    const relations = getMetadataArgsStorage()
      .filterRelations(BookConnection)
      .map((relation) => relation.propertyName);

    expect(relations).toEqual(expect.arrayContaining(['sourceBook', 'discoveredBook']));
  });
});
