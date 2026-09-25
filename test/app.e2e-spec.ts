import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/app.setup.js';
import { User } from './../src/users/entities/user.entity.js';
import { Author } from './../src/author/entities/author.entity.js';
import { BookRole } from './../src/common/types/enums/book-role.enum.js';

// Smoke-tests the main user journey against the real database configured in
// .env: register -> login -> create books -> connect them -> read the graph.
// Every row is created under run-unique usernames and removed in afterAll.
describe('BookGraph (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const runId = Date.now().toString(36);
  const password = 'SuperSecret123!';
  const createdUserIds: string[] = [];
  const createdAuthorIds: string[] = [];

  const register = async (username: string): Promise<string> => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'E2E', lastName: 'Tester', username, password })
      .expect(201);
    createdUserIds.push(res.body.id);
    return res.body.id;
  };

  // Login only sets the HttpOnly cookie; pull the JWT out of it so the rest of
  // the suite can use the Bearer header, which the strategy also accepts.
  const login = async (username: string): Promise<string> => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password })
      .expect(201);
    const cookies = ([] as string[]).concat(res.headers['set-cookie'] ?? []);
    const tokenCookie = cookies.find((c) => c.startsWith('access_token='));
    expect(tokenCookie).toBeDefined();
    expect(tokenCookie).toContain('HttpOnly');
    return tokenCookie!.split(';')[0].slice('access_token='.length);
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    // Books cascade from their user and connections cascade from their books,
    // so deleting the users first frees the authors for deletion.
    if (dataSource?.isInitialized) {
      if (createdUserIds.length) {
        await dataSource.getRepository(User).delete(createdUserIds);
      }
      if (createdAuthorIds.length) {
        await dataSource.getRepository(Author).delete(createdAuthorIds);
      }
    }
    await app?.close();
  });

  it('rejects unauthenticated access to protected routes', async () => {
    await request(app.getHttpServer()).get('/graph').expect(401);
    await request(app.getHttpServer()).get('/books').expect(401);
  });

  it('rejects login with a wrong password', async () => {
    const username = `e2e_${runId}_bad`;
    await register(username);
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password: 'not-the-password' })
      .expect(401);
  });

  describe('register -> login -> books -> connection -> graph', () => {
    const username = `e2e_${runId}_owner`;
    let ownerId: string;
    let token: string;
    let authorId: string;
    let duneId: string;
    let messiahId: string;

    const auth = () => ({ Authorization: `Bearer ${token}` });

    it('registers without leaking the password hash', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'E2E', lastName: 'Owner', username, password })
        .expect(201);
      ownerId = res.body.id;
      createdUserIds.push(ownerId);

      expect(res.body.username).toBe(username);
      expect(res.body).not.toHaveProperty('hashedPassword');
      expect(res.body).not.toHaveProperty('password');
    });

    it('rejects a duplicate username', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'E2E', lastName: 'Owner', username, password })
        .expect(409);
    });

    it('logs in and issues a JWT cookie', async () => {
      token = await login(username);
      expect(token.split('.')).toHaveLength(3);
    });

    it('creates an author', async () => {
      const res = await request(app.getHttpServer())
        .post('/author')
        .set(auth())
        .send({ name: `Frank Herbert ${runId}` })
        .expect(201);
      authorId = res.body.id;
      createdAuthorIds.push(authorId);
    });

    it('rejects a book payload with unknown fields', async () => {
      await request(app.getHttpServer())
        .post('/books')
        .set(auth())
        .send({ title: 'Dune', authorId, userId: 'someone-else' })
        .expect(400);
    });

    it('creates two books owned by the caller', async () => {
      const dune = await request(app.getHttpServer())
        .post('/books')
        .set(auth())
        .send({ title: 'Dune', authorId, status: BookRole.READ })
        .expect(201);
      const messiah = await request(app.getHttpServer())
        .post('/books')
        .set(auth())
        .send({ title: 'Dune Messiah', authorId, status: BookRole.WISHLIST })
        .expect(201);

      duneId = dune.body.id;
      messiahId = messiah.body.id;
      expect(duneId).toBeDefined();
      expect(messiahId).toBeDefined();
    });

    it('connects the two books', async () => {
      const res = await request(app.getHttpServer())
        .post('/book-connections')
        .set(auth())
        .send({
          sourceBookId: duneId,
          discoveredBookId: messiahId,
          description: 'Sequel',
        })
        .expect(201);
      expect(res.body.sourceBookId).toBe(duneId);
      expect(res.body.discoveredBookId).toBe(messiahId);
    });

    it('rejects a self-referencing connection', async () => {
      await request(app.getHttpServer())
        .post('/book-connections')
        .set(auth())
        .send({ sourceBookId: duneId, discoveredBookId: duneId })
        .expect(400);
    });

    it('rejects a duplicate connection, in either direction', async () => {
      await request(app.getHttpServer())
        .post('/book-connections')
        .set(auth())
        .send({ sourceBookId: messiahId, discoveredBookId: duneId })
        .expect(409);
    });

    it("returns the caller's graph as vis-network nodes and edges", async () => {
      const res = await request(app.getHttpServer())
        .get('/graph')
        .set(auth())
        .expect(200);

      expect(res.body.nodes).toHaveLength(2);
      expect(res.body.nodes).toEqual(
        expect.arrayContaining([
          { id: duneId, label: 'Dune', group: BookRole.READ },
          { id: messiahId, label: 'Dune Messiah', group: BookRole.WISHLIST },
        ]),
      );
      expect(res.body.edges).toEqual([
        expect.objectContaining({ from: duneId, to: messiahId, label: 'Sequel' }),
      ]);
    });

    describe('as a different user', () => {
      let otherToken: string;
      const other = () => ({ Authorization: `Bearer ${otherToken}` });

      beforeAll(async () => {
        const otherUsername = `e2e_${runId}_other`;
        await register(otherUsername);
        otherToken = await login(otherUsername);
      });

      it('sees an empty graph', async () => {
        const res = await request(app.getHttpServer())
          .get('/graph')
          .set(other())
          .expect(200);
        expect(res.body).toEqual({ nodes: [], edges: [] });
      });

      it("cannot read or connect the owner's books", async () => {
        await request(app.getHttpServer())
          .get(`/books/${duneId}`)
          .set(other())
          .expect(404);
        await request(app.getHttpServer())
          .post('/book-connections')
          .set(other())
          .send({ sourceBookId: duneId, discoveredBookId: messiahId })
          .expect(404);
      });

      it("cannot read the owner's account", async () => {
        await request(app.getHttpServer())
          .get(`/users/${ownerId}`)
          .set(other())
          .expect(403);
      });
    });
  });
});
