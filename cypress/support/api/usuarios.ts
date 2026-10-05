import { Usuario } from '../factories/usuario'

export const criarUsuario = (
  body: Partial<Usuario>,
  failOnStatusCode = true
) =>
  cy.request({ method: 'POST', url: '/usuarios', body, failOnStatusCode })

export const buscarUsuario = (id: string, failOnStatusCode = true) =>
  cy.request({ method: 'GET', url: `/usuarios/${id}`, failOnStatusCode })