import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AprovacoesPage from "../page";
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

let mockToken: string | null = "token-fake";
let mockIsAuthenticated = true;
let mockIsLoading = false;
let mockRole = "Admin";

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    token: mockToken,
    isAuthenticated: mockIsAuthenticated,
    isLoading: mockIsLoading,
    role: mockRole,
    name: "Teste",
    logout: jest.fn(),
  }),
}));

jest.mock("../service");
const mockBuscarSolicitacoes = service.buscarSolicitacoes as jest.MockedFunction<typeof service.buscarSolicitacoes>;
const mockAprovarSolicitacao = service.aprovarSolicitacao as jest.MockedFunction<typeof service.aprovarSolicitacao>;
const mockReprovarSolicitacao = service.reprovarSolicitacao as jest.MockedFunction<typeof service.reprovarSolicitacao>;

const solicitacoesMock = [
  { id: "1", tipo: "Manual", status: "Solicitado", valor: 150, descricao: "Premiação mensal", criadoEm: "2025-01-01T00:00:00Z", unidadeId: "u1", nomeUnidade: "Alpha", nomeDesafio: null },
  { id: "2", tipo: "Desafio", status: "Solicitado", valor: 50, descricao: "Desc desafio", criadoEm: "2025-02-01T00:00:00Z", unidadeId: "u2", nomeUnidade: "Beta", nomeDesafio: "Desafio Beta" },
];

describe("AprovacoesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToken = "token-fake";
    mockIsAuthenticated = true;
    mockIsLoading = false;
    mockRole = "Admin";
  });

  it("exibe as solicitações pendentes após carregar", async () => {
    mockBuscarSolicitacoes.mockResolvedValue(solicitacoesMock);
    render(<AprovacoesPage />);

    await waitFor(() => {
      expect(screen.getByText("Premiação mensal")).toBeInTheDocument();
      expect(screen.getByText("Desafio Beta")).toBeInTheDocument();
    });
  });

  it("exibe mensagem de lista vazia quando não há solicitações pendentes", async () => {
    mockBuscarSolicitacoes.mockResolvedValue([]);
    render(<AprovacoesPage />);

    await waitFor(() => {
      expect(screen.getByText("Nenhuma solicitação pendente.")).toBeInTheDocument();
    });
  });

  it("filtra apenas solicitações com status Solicitado", async () => {
    mockBuscarSolicitacoes.mockResolvedValue([
      ...solicitacoesMock,
      { id: "3", tipo: "Manual", status: "Aprovado", valor: 10, descricao: "Já aprovada", criadoEm: "2025-03-01T00:00:00Z", unidadeId: "u3", nomeUnidade: "Gamma", nomeDesafio: null },
    ]);
    render(<AprovacoesPage />);

    await waitFor(() => expect(screen.getByText("Premiação mensal")).toBeInTheDocument());
    expect(screen.queryByText("Já aprovada")).not.toBeInTheDocument();
  });

  it("exibe mensagem de erro quando buscarSolicitacoes falha", async () => {
    mockBuscarSolicitacoes.mockRejectedValue(new Error("Não foi possível carregar as solicitações."));
    render(<AprovacoesPage />);

    await waitFor(() => {
      expect(screen.getByText("Não foi possível carregar as solicitações.")).toBeInTheDocument();
    });
  });

  it("não exibe mensagem de lista vazia quando há erro", async () => {
    mockBuscarSolicitacoes.mockRejectedValue(new Error("Não foi possível carregar as solicitações."));
    render(<AprovacoesPage />);

    await waitFor(() => {
      expect(screen.queryByText("Nenhuma solicitação pendente.")).not.toBeInTheDocument();
    });
  });

  // it("chama aprovarSolicitacao e remove o item ao confirmar aprovação", async () => {
  //   mockBuscarSolicitacoes.mockResolvedValue([solicitacoesMock[0]]);
  //   mockAprovarSolicitacao.mockResolvedValue(undefined);
  //   render(<AprovacoesPage />);

  //   await waitFor(() => screen.getByText("Premiação mensal"));

  //   fireEvent.click(screen.getByRole("button", { name: /Aprovar/i }));
  //   await waitFor(() => screen.getByRole("button", { name: /Sim/i }));

  //   await act(async () => {
  //     fireEvent.click(screen.getByRole("button", { name: /Sim/i }));
  //   });

  //   expect(mockAprovarSolicitacao).toHaveBeenCalledWith("token-fake", "1", undefined);
  //   await waitFor(() =>
  //     expect(screen.queryByText("Premiação mensal")).not.toBeInTheDocument()
  //   );
  // });

  // it("chama reprovarSolicitacao e remove o item ao confirmar reprovação", async () => {
  //   mockBuscarSolicitacoes.mockResolvedValue([solicitacoesMock[1]]);
  //   mockReprovarSolicitacao.mockResolvedValue(undefined);
  //   render(<AprovacoesPage />);

  //   await waitFor(() => screen.getByText("Desafio Beta"));

  //   fireEvent.click(screen.getByRole("button", { name: /Reprovar/i }));
  //   await waitFor(() => screen.getByRole("button", { name: /Sim/i }));

  //   await act(async () => {
  //     fireEvent.click(screen.getByRole("button", { name: /Sim/i }));
  //   });

  //   expect(mockReprovarSolicitacao).toHaveBeenCalledWith("token-fake", "2");
  //   await waitFor(() =>
  //     expect(screen.queryByText("Desafio Beta")).not.toBeInTheDocument()
  //   );
  // });

  it("cancela a confirmação ao clicar em Não", async () => {
    mockBuscarSolicitacoes.mockResolvedValue([solicitacoesMock[0]]);
    render(<AprovacoesPage />);

    await waitFor(() => screen.getByText("Premiação mensal"));

    await userEvent.click(screen.getByRole("button", { name: /Aprovar/i }));
    await userEvent.click(screen.getByRole("button", { name: /Não/i }));

    expect(mockAprovarSolicitacao).not.toHaveBeenCalled();
    expect(screen.getByText("Premiação mensal")).toBeInTheDocument();
  });

  // it("exibe lista vazia após aprovar a última solicitação", async () => {
  //   const user = userEvent.setup({ pointerEventsCheck: 0 });
  //   mockBuscarSolicitacoes.mockResolvedValue([solicitacoesMock[0]]);
  //   mockAprovarSolicitacao.mockResolvedValue(undefined);
  //   render(<AprovacoesPage />);

  //   await waitFor(() => screen.getByText("Premiação mensal"));

  //   await user.click(screen.getByRole("button", { name: /Aprovar/i }));
  //   await waitFor(() => screen.getByRole("button", { name: /Sim/i }));
  //   await user.click(screen.getByRole("button", { name: /Sim/i }));

  //   await waitFor(() =>
  //     expect(screen.getByText("Nenhuma solicitação pendente.")).toBeInTheDocument()
  //   );
  // });

  it("redireciona para /login se não estiver autenticado", () => {
    mockIsAuthenticated = false;
    mockToken = null;
    render(<AprovacoesPage />);

    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("redireciona para /dashboard se o role não for Admin", () => {
    mockRole = "Conselheiro";
    render(<AprovacoesPage />);

    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
  });

  it("não chama buscarSolicitacoes se não houver token", () => {
    mockToken = null;
    mockIsAuthenticated = false;
    render(<AprovacoesPage />);

    expect(mockBuscarSolicitacoes).not.toHaveBeenCalled();
  });

  it("navega para a página anterior ao clicar em Voltar", async () => {
    mockBuscarSolicitacoes.mockResolvedValue(solicitacoesMock);
    render(<AprovacoesPage />);

    await waitFor(() => screen.getByText("Premiação mensal"));

    await userEvent.click(screen.getByRole("button", { name: "Voltar" }));

    expect(mockBack).toHaveBeenCalled();
  });
});
