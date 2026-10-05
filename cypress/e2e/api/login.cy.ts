import { gerarUsuario } from '../../support/factories/usuario'
import { criarUsuario } from '../../support/api/usuarios'
import { fazerLogin } from '../../support/api/login'


describe('Login pela API', () => {
	const criarUsuario = (email: string, password = 'Senha123') =>
		cy.request({
			method: 'POST',
			url: '/usuarios',
			body: {
				nome: 'Usuário de teste',
				email,
				password,
				administrador: 'false',
			},
		});

	it('retorna 200 e um token com credenciais válidas', () => {
		const email = `login-${Date.now()}@teste.com`;
		const password = 'Senha123';

		criarUsuario(email, password).then((respostaUsuario) => {
			expect(respostaUsuario.status).to.eq(201);

			cy.request({
				method: 'POST',
				url: '/login',
				body: { email, password },
			}).then((resposta) => {
				expect(resposta.status).to.eq(200);
				expect(resposta.body.authorization).to.be.a('string').and.not.be.empty;
			});
		});
	});

	it('retorna erro e mensagem de credenciais inválidas para senha errada', () => {
		const email = `senha-errada-${Date.now()}@teste.com`;

		criarUsuario(email).then(() => {
			cy.request({
				method: 'POST',
				url: '/login',
				failOnStatusCode: false,
				body: { email, password: 'senha-incorreta' },
			}).then((resposta) => {
				expect(resposta.status).to.eq(401);
				expect(resposta.body.message).to.eq('Email e/ou senha inválidos');
			});
		});
	});

	it('retorna erro para um e-mail inexistente', () => {
		cy.request({
			method: 'POST',
			url: '/login',
			failOnStatusCode: false,
			body: {
				email: `inexistente-${Date.now()}@teste.com`,
				password: 'Senha123',
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
