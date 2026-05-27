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
const mockCriarSolicitacao = service.criarSolicitacao as jest.MockedFunction<typeof service.criarSolicitacao>;

describe("NovaTransacaoPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToken = "token-fake";
    mockIsAuthenticated = true;
    mockIsLoading = false;
    mockRole = "Admin";
  });

  it("renderiza o formulário com os campos esperados", async () => {
    render(<NovaTransacaoPage />);

    await screen.findByLabelText("Valor");
    await screen.findByLabelText("Descrição");
    await screen.findByRole("button", { name: "Criar Solicitação" });
  });

  it("chama criarSolicitacao com os dados preenchidos ao submeter", async () => {
    mockCriarSolicitacao.mockResolvedValue(undefined);
    render(<NovaTransacaoPage />);

    await screen.findByLabelText("Valor");

    await userEvent.type(screen.getByLabelText("Valor"), "150");
    await userEvent.type(screen.getByLabelText("Descrição"), "Premiação mensal");
    await userEvent.click(screen.getByRole("button", { name: "Criar Solicitação" }));

    await waitFor(() => {
      expect(mockCriarSolicitacao).toHaveBeenCalledWith("token-fake", {
        valor: 150,
        descricao: "Premiação mensal",
      });
    });
  });

  it("exibe mensagem de sucesso após criar solicitação", async () => {
    mockCriarSolicitacao.mockResolvedValue(undefined);
    render(<NovaTransacaoPage />);

    await screen.findByLabelText("Valor");

    await userEvent.type(screen.getByLabelText("Valor"), "100");
    await userEvent.type(screen.getByLabelText("Descrição"), "Teste");
    await userEvent.click(screen.getByRole("button", { name: "Criar Solicitação" }));

    await screen.findByText("Solicitação criada com sucesso!");
  });

  it("limpa os campos após criar solicitação com sucesso", async () => {
    mockCriarSolicitacao.mockResolvedValue(undefined);
    render(<NovaTransacaoPage />);

    await screen.findByLabelText("Valor");

    await userEvent.type(screen.getByLabelText("Valor"), "200");
    await userEvent.type(screen.getByLabelText("Descrição"), "Teste limpeza");
    await userEvent.click(screen.getByRole("button", { name: "Criar Solicitação" }));

    expect(screen.getByLabelText("Valor")).toHaveValue(null);
    expect(screen.getByLabelText("Descrição")).toHaveValue("");
  });

  it("exibe mensagem de erro quando criarSolicitacao falha", async () => {
    mockCriarSolicitacao.mockRejectedValue(new Error("Ocorreu um erro ao criar a solicitação. Tente novamente."));
    render(<NovaTransacaoPage />);

    await screen.findByLabelText("Valor");

    await userEvent.type(screen.getByLabelText("Valor"), "50");
    await userEvent.type(screen.getByLabelText("Descrição"), "Erro");
    await userEvent.click(screen.getByRole("button", { name: "Criar Solicitação" }));

    await screen.findByText("Ocorreu um erro ao criar a solicitação. Tente novamente.");
  });

  it("desabilita o botão enquanto está enviando", async () => {
    mockCriarSolicitacao.mockImplementation(() => new Promise(() => {}));
    render(<NovaTransacaoPage />);

    await screen.findByLabelText("Valor");

    await userEvent.type(screen.getByLabelText("Valor"), "50");
    await userEvent.type(screen.getByLabelText("Descrição"), "Teste");
    await userEvent.click(screen.getByRole("button", { name: "Criar Solicitação" }));

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
    render(<NovaTransacaoPage />);

    await screen.findByLabelText("Valor");

    await userEvent.click(screen.getByRole("button", { name: "Voltar" }));

    expect(mockBack).toHaveBeenCalled();
  });
});
