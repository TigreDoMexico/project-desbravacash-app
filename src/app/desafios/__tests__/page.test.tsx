import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DesafiosPage from "../page";
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
let mockRole = "Conselheiro";

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    token: mockToken,
    isAuthenticated: mockIsAuthenticated,
    isLoading: mockIsLoading,
    role: mockRole,
  }),
}));

jest.mock("../service");
const mockBuscarDesafios = service.buscarDesafios as jest.MockedFunction<typeof service.buscarDesafios>;
const mockSolicitarDesafio = service.solicitarDesafio as jest.MockedFunction<typeof service.solicitarDesafio>;

const desafiosMock = [
  { id: "1", descricao: "Desafio Alpha", pontuacao: 50, dataConclusao: "2025-12-31T00:00:00", podeSolicitar: true, solicitado: false, concluido: false },
  { id: "2", descricao: "Desafio Beta", pontuacao: 100, dataConclusao: "2025-11-30T00:00:00", podeSolicitar: false, solicitado: true, concluido: false },
];

describe("DesafiosPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToken = "token-fake";
    mockIsAuthenticated = true;
    mockIsLoading = false;
    mockRole = "Conselheiro";
  });

  it("exibe os desafios após carregar", async () => {
    mockBuscarDesafios.mockResolvedValue(desafiosMock);
    render(<DesafiosPage />);

    await waitFor(() => {
      expect(screen.getByText("Desafio Alpha")).toBeInTheDocument();
      expect(screen.getByText("Desafio Beta")).toBeInTheDocument();
    });
  });

  it("exibe mensagem de lista vazia quando não há desafios", async () => {
    mockBuscarDesafios.mockResolvedValue([]);
    render(<DesafiosPage />);

    await waitFor(() => {
      expect(screen.getByText("Nenhum desafio disponível.")).toBeInTheDocument();
    });
  });

  it("exibe mensagem de erro quando buscarDesafios falha", async () => {
    mockBuscarDesafios.mockRejectedValue(new Error("Não foi possível carregar os desafios."));
    render(<DesafiosPage />);

    await waitFor(() => {
      expect(screen.getByText("Não foi possível carregar os desafios.")).toBeInTheDocument();
    });
  });

  it("não exibe mensagem de lista vazia quando há erro", async () => {
    mockBuscarDesafios.mockRejectedValue(new Error("Não foi possível carregar os desafios."));
    render(<DesafiosPage />);

    await waitFor(() => {
      expect(screen.queryByText("Nenhum desafio disponível.")).not.toBeInTheDocument();
    });
  });

  it("exibe botão Solicitar apenas para desafios disponíveis", async () => {
    mockBuscarDesafios.mockResolvedValue(desafiosMock);
    render(<DesafiosPage />);

    await waitFor(() => screen.getByText("Desafio Alpha"));

    const botoes = screen.getAllByRole("button", { name: /Solicitar/i });
    expect(botoes).toHaveLength(1);
  });

  it("exibe badge 'Aguardando aprovação' para desafio solicitado", async () => {
    mockBuscarDesafios.mockResolvedValue(desafiosMock);
    render(<DesafiosPage />);

    await waitFor(() => {
      expect(screen.getByText("Aguardando aprovação")).toBeInTheDocument();
    });
  });

  it("chama solicitarDesafio e atualiza o estado ao solicitar", async () => {
    mockBuscarDesafios.mockResolvedValue(desafiosMock);
    mockSolicitarDesafio.mockResolvedValue(undefined);
    render(<DesafiosPage />);

    await waitFor(() => screen.getByText("Desafio Alpha"));

    await userEvent.click(screen.getByRole("button", { name: /Solicitar/i }));

    expect(mockSolicitarDesafio).toHaveBeenCalledWith("token-fake", "1");
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /Solicitar/i })).not.toBeInTheDocument();
    });
  });

  it("exibe aviso quando solicitarDesafio falha", async () => {
    mockBuscarDesafios.mockResolvedValue(desafiosMock);
    mockSolicitarDesafio.mockRejectedValue(new Error("Já existe uma solicitação ativa para esta unidade."));
    render(<DesafiosPage />);

    await waitFor(() => screen.getByText("Desafio Alpha"));

    await userEvent.click(screen.getByRole("button", { name: /Solicitar/i }));

    await waitFor(() => {
      expect(screen.getByText("Já existe uma solicitação ativa para esta unidade.")).toBeInTheDocument();
    });
  });

  it("redireciona para /login se não estiver autenticado", () => {
    mockIsAuthenticated = false;
    mockToken = null;
    render(<DesafiosPage />);

    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("redireciona para /dashboard se o role não for Conselheiro", () => {
    mockRole = "Admin";
    render(<DesafiosPage />);

    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
  });

  it("não chama buscarDesafios se o role não for Conselheiro", () => {
    mockRole = "Admin";
    render(<DesafiosPage />);

    expect(mockBuscarDesafios).not.toHaveBeenCalled();
  });

  it("navega para a página anterior ao clicar em Voltar", async () => {
    mockBuscarDesafios.mockResolvedValue(desafiosMock);
    render(<DesafiosPage />);

    await waitFor(() => screen.getByText("Desafio Alpha"));

    await userEvent.click(screen.getByRole("button", { name: "Voltar" }));

    expect(mockBack).toHaveBeenCalled();
  });
});
