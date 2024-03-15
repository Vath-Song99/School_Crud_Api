
export const swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: 'users API',
      description: 'API to manage userss',
      version: '1.0.0',
    },
    paths: {
      '/users': {
        get: {
          summary: 'Get all userss',
          responses: {
            '200': {
              description: 'List of userss',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/users',
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create a new users',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/usersInput',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'users created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/users',
                  },
                },
              },
            },
          },
        },
      },
      '/users/{usersId}': {
        get: {
          summary: 'Get a users by ID',
          parameters: [
            {
              name: 'usersId',
              in: 'path',
              description: 'ID of the users',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'users details',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/users',
                  },
                },
              },
            },
          },
        },
        put: {
          summary: 'Update a users by ID',
          parameters: [
            {
              name: 'usersId',
              in: 'path',
              description: 'ID of the users',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/usersInput',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'users updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/users',
                  },
                },
              },
            },
          },
        },
        delete: {
          summary: 'Delete a users by ID',
          parameters: [
            {
              name: 'usersId',
              in: 'path',
              description: 'ID of the users',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'users deleted successfully',
            },
          },
        },
      },
    },
    components: {
      schemas: {
        users: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            director: { type: 'string' },
            year: { type: 'number' },
          },
        },
        usersInput: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            director: { type: 'string' },
            year: { type: 'number' },
          },
          required: ['name', 'director', 'year'],
        },
      },
    },
  };
  