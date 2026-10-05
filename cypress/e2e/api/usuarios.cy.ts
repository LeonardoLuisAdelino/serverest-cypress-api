import { gerarUsuario, Usuario } from '../../support/factories/usuario'
import { criarUsuario, buscarUsuario } from '../../support/api/usuarios'

describe('API /usuarios', () => {
  it('cria um usuário com dados válidos', () => {
    criarUsuario(gerarUsuario()).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body.message).to.contain('sucesso')
      expect(res.body).to.have.property('_id')
    })
  })

  it('consulta o usuário criado pelo id', () => {
    const usuario = gerarUsuario()
    criarUsuario(usuario)
      .then((res) => buscarUsuario(res.body._id))
      .then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.nome).to.eq(usuario.nome)
        expect(res.body.email).to.eq(usuario.email)
      })
  })

  it('rejeita cadastro com e-mail duplicado', () => {
    const usuario = gerarUsuario()
    criarUsuario(usuario)
    criarUsuario(usuario, false).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.message).to.eq('Este email já está sendo usado')
    })
  })

  const camposObrigatorios: (keyof Usuario)[] = [
    'nome',
    'email',
    'password',
    'administrador',
  ]

  camposObrigatorios.forEach((campo) => {
    it(`rejeita cadastro sem o campo ${campo}`, () => {
      const body: Partial<Usuario> = gerarUsuario()
      delete body[campo]
      criarUsuario(body, false).then((res) => {
        expect(res.status).to.eq(400)
        expect(res.body).to.have.property(campo)
      })
    })
  })
})