import { beforeAll, describe, expect, test } from 'vitest'
describe("test pokemon api", () => {
  let response: Response;
  let body: {
    [key: string]: any;
  };
  beforeAll(async () => {

    response = await fetch('https://pokeapi.co/api/v2/pokemon/25/')
    body = await response.json();

  });

  test('Should have response status 200', () => {
    expect(response.status).toBe(200);
  });
  test('should fetch pokemon list successfully', () => {
    expect(body.forms[0].name
    ).toBe('pikachu')
  })
})


