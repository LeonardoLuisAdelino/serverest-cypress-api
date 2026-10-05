import { gerarUsuario } from '../../support/factories/usuario'
import { criarUsuario } from '../../support/api/usuarios'
import { fazerLogin } from '../../support/api/login'


describe('Login pela API', () => {
	it('retorna 200 e um token com credenciais válidas', () => {
		const usuario = gerarUsuario();

		criarUsuario(usuario).then((respostaUsuario) => {
			expect(respostaUsuario.status).to.eq(201);

			fazerLogin(usuario.email, usuario.password).then((resposta) => {
				expect(resposta.status).to.eq(200);
				expect(resposta.body.authorization).to.be.a('string').and.not.be.empty;
			});
		});
	});

	it('retorna erro e mensagem de credenciais inválidas para senha errada', () => {
		const usuario = gerarUsuario();

		criarUsuario(usuario).then(() => {
			cy.request({
				method: 'POST',
				url: '/login',
				failOnStatusCode: false,
				body: { email: usuario.email, password: 'senha-incorreta' },
			}).then((resposta) => {
				expect(resposta.status).to.eq(401);
				expect(resposta.body.message).to.eq('Email e/ou senha inválidos');
			});
		});
	});

	it('retorna erro para um e-mail inexistente', () => {
		const usuario = gerarUsuario();

		cy.request({
			method: 'POST',
			url: '/login',
			failOnStatusCode: false,
			body: {
				email: usuario.email,
				password: usuario.password,
			},
		}).then((resposta) => {
			expect(resposta.status).to.eq(401);
			expect(resposta.body.message).to.eq('Email e/ou senha inválidos');
		});
	});

	it('retorna erro quando e-mail e senha não são informados', () => {
		cy.request({
			method: 'POST',
			url: '/login',
			failOnStatusCode: false,
			body: {},
		}).then((resposta) => {
			expect(resposta.status).to.eq(400);
			expect(resposta.body).to.deep.equal({
				email: 'email é obrigatório',
				password: 'password é obrigatório',
			});
		});
	});
});
