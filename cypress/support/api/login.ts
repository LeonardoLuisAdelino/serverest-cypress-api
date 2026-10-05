export const fazerLogin = (
    email: string,
    password: string,
    failOnStatusCode = true
  ) =>
    cy.request({
      method: 'POST',
      url: '/login',
      body: { email, password },
      failOnStatusCode,
    })