import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NovaTransacaoPage from "../page";
import * as service from "../service";

const mockReplace = jest.fn();
const mockBack = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, back: mockBack }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

jest.mock("@/components/ui/TitleLabel/TitleLabel", () => ({
  __esModule: true,
  default: () => <span>DesbravaCash</span>,
}));

const mockLogout = jest.fn();
let mockToken: string | null = "token-fake";
let mockIsAuthenticated = true;
let mockIsLoading = false;
let mockRole = "Admin";

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    token: mockToken,
    logout: mockLogout,
    isAuthenticated: mockIsAuthenticated,
    isLoading: mockIsLoading,
    role: mockRole,
    name: "Usuário Teste",
  }),
}));

jest.mock("../service");
const mockBuscarUnidades = service.buscarUnidades as jest.MockedFunction<typeof service.buscarUnidades>;
const mockCriarTransacao = service.criarTransacao as jest.MockedFunction<typeof service.criarTransacao>;

const unidadesMock = {
  unidades: [
    { id: "1", nome: "Unidade Alpha" },
    { id: "2", nome: "Unidade Beta" },
  ],
};

describe("NovaTransacaoPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToken = "token-fake";
    mockIsAuthenticated = true;
    mockIsLoading = false;
    mockRole = "Admin";
  });

  it("renderiza o formulário com os campos esperados", async () => {
    mockBuscarUnidades.mockResolvedValue(unidadesMock);
    render(<NovaTransacaoPage />);

    await screen.findByLabelText("Valor");
    await screen.findByLabelText("Descrição");
    await screen.findByRole("button", { name: "Criar Transação" })
  });

  it("carrega e exibe as unidades no select", async () => {
    mockBuscarUnidades.mockResolvedValue(unidadesMock);
    render(<NovaTransacaoPage />);

    await screen.findByRole("option", { name: "Unidade Alpha" })
    await screen.findByRole("option", { name: "Unidade Beta" })
  });

  it("exibe mensagem de erro quando buscarUnidades falha", async () => {
    mockBuscarUnidades.mockRejectedValue(new Error("Não foi possível carregar as unidades."));
    render(<NovaTransacaoPage />);

    await screen.findByText("Não foi possível carregar as unidades.");
  });

  it("chama criarTransacao com os dados preenchidos ao submeter", async () => {
    mockBuscarUnidades.mockResolvedValue(unidadesMock);
    mockCriarTransacao.mockResolvedValue(undefined);
    render(<NovaTransacaoPage />);

    await screen.findByLabelText("Valor");

    await userEvent.type(screen.getByLabelText("Valor"), "150");
    await userEvent.type(screen.getByLabelText("Descrição"), "Premiação mensal");
    await userEvent.click(screen.getByRole("button", { name: "Criar Transação" }));

    await waitFor(() => {
      expect(mockCriarTransacao).toHaveBeenCalledWith("token-fake", {
        unidadeId: "1",
        valor: "150",
        descricao: "Premiação mensal",
        tipoTransacao: "credito",
      });
    });
  });

  it("exibe mensagem de sucesso após criar transação", async () => {
    mockBuscarUnidades.mockResolvedValue(unidadesMock);
    mockCriarTransacao.mockResolvedValue(undefined);
    render(<NovaTransacaoPage />);

    await screen.findByLabelText("Valor");

    await userEvent.type(screen.getByLabelText("Valor"), "100");
    await userEvent.type(screen.getByLabelText("Descrição"), "Teste");
    await userEvent.click(screen.getByRole("button", { name: "Criar Transação" }));

    await screen.findByText("Transação criada com sucesso!");
  });

  it("limpa os campos após criar transação com sucesso", async () => {
    mockBuscarUnidades.mockResolvedValue(unidadesMock);
    mockCriarTransacao.mockResolvedValue(undefined);
    render(<NovaTransacaoPage />);

    await screen.findByLabelText("Valor");

    await waitFor(() => screen.getByLabelText("Valor"));

    await userEvent.type(screen.getByLabelText("Valor"), "200");
    await userEvent.type(screen.getByLabelText("Descrição"), "Teste limpeza");
    await userEvent.click(screen.getByRole("button", { name: "Criar Transação" }));

    expect(screen.getByLabelText("Valor")).toHaveValue(null);
    expect(screen.getByLabelText("Descrição")).toHaveValue("");
  });

  it("exibe mensagem de erro quando criarTransacao falha", async () => {
    mockBuscarUnidades.mockResolvedValue(unidadesMock);
    mockCriarTransacao.mockRejectedValue(new Error("Não foi possível criar a transação."));
    render(<NovaTransacaoPage />);

    await screen.findByLabelText("Valor");

    await userEvent.type(screen.getByLabelText("Valor"), "50");
    await userEvent.type(screen.getByLabelText("Descrição"), "Erro");
    await userEvent.click(screen.getByRole("button", { name: "Criar Transação" }));

    await screen.findByText("Não foi possível criar a transação.");
  });

  it("desabilita o botão enquanto está enviando", async () => {
    mockBuscarUnidades.mockResolvedValue(unidadesMock);
    mockCriarTransacao.mockImplementation(() => new Promise(() => {}));
    render(<NovaTransacaoPage />);

    await screen.findByLabelText("Valor");

    await userEvent.type(screen.getByLabelText("Valor"), "50");
    await userEvent.type(screen.getByLabelText("Descrição"), "Teste");
    await userEvent.click(screen.getByRole("button", { name: "Criar Transação" }));

    expect(screen.getByRole("button", { name: "Carregando..." })).toBeDisabled();
  });

  it("redireciona para /login se não estiver autenticado", () => {
    mockIsAuthenticated = false;
    mockToken = null;
    render(<NovaTransacaoPage />);

    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("redireciona para /dashboard se o role não for Admin", () => {
    mockRole = "Membro";
    render(<NovaTransacaoPage />);

    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
  });

  it("navega para a página anterior ao clicar em Voltar", async () => {
    mockBuscarUnidades.mockResolvedValue(unidadesMock);
    render(<NovaTransacaoPage />);

    await screen.findByLabelText("Valor");

    await userEvent.click(screen.getByRole("button", { name: "Voltar" }));

    expect(mockBack).toHaveBeenCalled();
  });
});
