describe('Sanidade da API', () => {
    it('lista usuários pré-cadastrados', () => {
      cy.request('GET', '/usuarios').then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.have.property('usuarios')
      })
    })
  })