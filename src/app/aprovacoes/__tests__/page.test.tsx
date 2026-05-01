import { render, screen, waitFor } from "@testing-library/react";
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
    logout: jest.fn(),
    isAuthenticated: mockIsAuthenticated,
    isLoading: mockIsLoading,
    role: mockRole,
    name: "Usuário Teste",
  }),
}));

jest.mock("../service");
const mockBuscarPendentes = service.buscarPendentes as jest.MockedFunction<typeof service.buscarPendentes>;
const mockAtualizarStatus = service.atualizarStatus as jest.MockedFunction<typeof service.atualizarStatus>;

const transacoesMock = [
  { id: "1", descricao: "Premiação mensal", valor: "150", nomeUnidade: "Alpha", tipo: "credito", status: "Pendente", mes: "Jan" },
  { id: "2", descricao: "Penalidade", valor: "50", nomeUnidade: "Beta", tipo: "debito", status: "Pendente", mes: "Fev" },
];

describe("AprovacoesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToken = "token-fake";
    mockIsAuthenticated = true;
    mockIsLoading = false;
    mockRole = "Admin";
  });

  it("exibe as transações pendentes após carregar", async () => {
    mockBuscarPendentes.mockResolvedValue({ transacoes: transacoesMock });
    render(<AprovacoesPage />);

    await waitFor(() => {
      expect(screen.getByText("Unidade Alpha: Premiação mensal")).toBeInTheDocument();
      expect(screen.getByText("Unidade Beta: Penalidade")).toBeInTheDocument();
    });
  });

  it("exibe sinal de + para crédito e - para débito", async () => {
    mockBuscarPendentes.mockResolvedValue({ transacoes: transacoesMock });
    render(<AprovacoesPage />);

    await waitFor(() => {
      expect(screen.getByText("+ 150")).toBeInTheDocument();
      expect(screen.getByText("- 50")).toBeInTheDocument();
    });
  });

  it("exibe mensagem de lista vazia quando não há pendentes", async () => {
    mockBuscarPendentes.mockResolvedValue({ transacoes: [] });
    render(<AprovacoesPage />);

    await waitFor(() => {
      expect(screen.getByText("Nenhuma transação pendente.")).toBeInTheDocument();
    });
  });

  it("exibe mensagem de erro quando buscarPendentes falha", async () => {
    mockBuscarPendentes.mockRejectedValue(new Error("Não foi possível carregar as transações pendentes."));
    render(<AprovacoesPage />);

    await waitFor(() => {
      expect(screen.getByText("Não foi possível carregar as transações pendentes.")).toBeInTheDocument();
    });
  });

  it("não exibe mensagem de lista vazia quando há erro", async () => {
    mockBuscarPendentes.mockRejectedValue(new Error("Não foi possível carregar as transações pendentes."));
    render(<AprovacoesPage />);

    await waitFor(() => {
      expect(screen.queryByText("Nenhuma transação pendente.")).not.toBeInTheDocument();
    });
  });

  it("chama atualizarStatus com status 1 e remove a transação ao aprovar", async () => {
    mockBuscarPendentes.mockResolvedValue({ transacoes: transacoesMock });
    mockAtualizarStatus.mockResolvedValue(undefined);
    render(<AprovacoesPage />);

    await waitFor(() => screen.getByText("Unidade Alpha: Premiação mensal"));

    mockBuscarPendentes.mockResolvedValue({ transacoes: [transacoesMock[1]] });
    const botoesAprovar = screen.getAllByRole("button", { name: /Aprovar/i });
    await userEvent.click(botoesAprovar[0]);

    expect(mockAtualizarStatus).toHaveBeenCalledWith("token-fake", "1", 1);
    await waitFor(() =>
      expect(screen.queryByText("Unidade Alpha: Premiação mensal")).not.toBeInTheDocument()
    );
  });

  it("chama atualizarStatus com status 2 e remove a transação ao reprovar", async () => {
    mockBuscarPendentes.mockResolvedValue({ transacoes: transacoesMock });
    mockAtualizarStatus.mockResolvedValue(undefined);
    render(<AprovacoesPage />);

    await waitFor(() => screen.getByText("Unidade Beta: Penalidade"));

    mockBuscarPendentes.mockResolvedValue({ transacoes: [transacoesMock[0]] });
    const botoesReprovar = screen.getAllByRole("button", { name: /Reprovar/i });
    await userEvent.click(botoesReprovar[1]);

    expect(mockAtualizarStatus).toHaveBeenCalledWith("token-fake", "2", 2);
    await waitFor(() =>
      expect(screen.queryByText("Unidade Beta: Penalidade")).not.toBeInTheDocument()
    );
  });

  it("exibe lista vazia após aprovar a última transação pendente", async () => {
    mockBuscarPendentes.mockResolvedValue({ transacoes: [transacoesMock[0]] });
    mockAtualizarStatus.mockResolvedValue(undefined);
    render(<AprovacoesPage />);

    await waitFor(() => screen.getByText("Unidade Alpha: Premiação mensal"));

    mockBuscarPendentes.mockResolvedValue({ transacoes: [] });
    await userEvent.click(screen.getByRole("button", { name: /Aprovar/i }));

    await waitFor(() =>
      expect(screen.getByText("Nenhuma transação pendente.")).toBeInTheDocument()
    );
  });

  it("redireciona para /login se não estiver autenticado", () => {
    mockIsAuthenticated = false;
    mockToken = null;
    render(<AprovacoesPage />);

    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("redireciona para /dashboard se o role não for Admin", () => {
    mockRole = "Membro";
    render(<AprovacoesPage />);

    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
  });

  it("não chama buscarPendentes se não houver token", () => {
    mockToken = null;
    mockIsAuthenticated = false;
    render(<AprovacoesPage />);

    expect(mockBuscarPendentes).not.toHaveBeenCalled();
  });

  it("navega para a página anterior ao clicar em Voltar", async () => {
    mockBuscarPendentes.mockResolvedValue({ transacoes: transacoesMock });
    render(<AprovacoesPage />);

    await waitFor(() => screen.getByText("Unidade Alpha: Premiação mensal"));

    await userEvent.click(screen.getByRole("button", { name: "Voltar" }));

    expect(mockBack).toHaveBeenCalled();
  });
});
