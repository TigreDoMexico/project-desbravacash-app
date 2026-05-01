import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExtratoPage from "../page";
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

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    token: mockToken,
    logout: jest.fn(),
    isAuthenticated: mockIsAuthenticated,
    isLoading: mockIsLoading,
    name: "Usuário Teste",
  }),
}));

jest.mock("../service");
const mockBuscarExtrato = service.buscarExtrato as jest.MockedFunction<typeof service.buscarExtrato>;

const transacoesMock = [
  { id: "1", descricao: "Premiação mensal", valor: "150", tipo: "credito", status: "Aprovado", mes: "Jan" },
  { id: "2", descricao: "Penalidade", valor: "50", tipo: "debito", status: "Aprovado", mes: "Fev" },
];

describe("ExtratoPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToken = "token-fake";
    mockIsAuthenticated = true;
    mockIsLoading = false;
  });

  it("exibe as transações após carregar o extrato", async () => {
    mockBuscarExtrato.mockResolvedValue({ transacoes: transacoesMock });
    render(<ExtratoPage />);

    await waitFor(() => {
      expect(screen.getByText("Premiação mensal")).toBeInTheDocument();
      expect(screen.getByText("Penalidade")).toBeInTheDocument();
    });
  });

  it("exibe sinal de + para crédito e - para débito", async () => {
    mockBuscarExtrato.mockResolvedValue({ transacoes: transacoesMock });
    render(<ExtratoPage />);

    await waitFor(() => {
      expect(screen.getByText("+ 150")).toBeInTheDocument();
      expect(screen.getByText("- 50")).toBeInTheDocument();
    });
  });

  it("exibe mensagem de lista vazia quando não há transações", async () => {
    mockBuscarExtrato.mockResolvedValue({ transacoes: [] });
    render(<ExtratoPage />);

    await waitFor(() => {
      expect(screen.getByText("Nenhuma transação encontrada.")).toBeInTheDocument();
    });
  });

  it("exibe mensagem de erro quando buscarExtrato falha", async () => {
    mockBuscarExtrato.mockRejectedValue(new Error("Não foi possível carregar o extrato."));
    render(<ExtratoPage />);

    await waitFor(() => {
      expect(screen.getByText("Não foi possível carregar o extrato.")).toBeInTheDocument();
    });
  });

  it("não exibe mensagem de lista vazia quando há erro", async () => {
    mockBuscarExtrato.mockRejectedValue(new Error("Não foi possível carregar o extrato."));
    render(<ExtratoPage />);

    await waitFor(() => {
      expect(screen.queryByText("Nenhuma transação encontrada.")).not.toBeInTheDocument();
    });
  });

  it("redireciona para /login se não estiver autenticado", () => {
    mockIsAuthenticated = false;
    mockToken = null;
    render(<ExtratoPage />);

    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("não chama buscarExtrato se não houver token", () => {
    mockToken = null;
    mockIsAuthenticated = false;
    render(<ExtratoPage />);

    expect(mockBuscarExtrato).not.toHaveBeenCalled();
  });

  it("navega para a página anterior ao clicar em Voltar", async () => {
    mockBuscarExtrato.mockResolvedValue({ transacoes: transacoesMock });
    render(<ExtratoPage />);

    await waitFor(() => screen.getByText("Premiação mensal"));

    await userEvent.click(screen.getByRole("button", { name: "Voltar" }));

    expect(mockBack).toHaveBeenCalled();
  });
});
