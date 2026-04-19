import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "../page";
import * as service from "../service";

const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

const mockLogout = jest.fn();
let mockToken: string | null = "token-fake";
let mockIsAuthenticated = true;
let mockIsLoading = false;

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    token: mockToken,
    logout: mockLogout,
    isAuthenticated: mockIsAuthenticated,
    isLoading: mockIsLoading,
  }),
}));

jest.mock("../service");
const mockBuscarUnidade = service.buscarUnidade as jest.MockedFunction<typeof service.buscarUnidade>;

const dadosMock = {
  unidade: { nome: "Unidade Desbravadores Central" },
  saldo: "4.750",
};

describe("DashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToken = "token-fake";
    mockIsAuthenticated = true;
    mockIsLoading = false;
  });

  it("exibe o nome da unidade e o saldo após carregar os dados", async () => {
    mockBuscarUnidade.mockResolvedValue(dadosMock);
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Unidade Desbravadores Central")).toBeInTheDocument();
      expect(screen.getByText("4.750 pts")).toBeInTheDocument();
    });
  });

  it("exibe o botão de extrato após carregar os dados", async () => {
    mockBuscarUnidade.mockResolvedValue(dadosMock);
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Ver Extrato da Conta" })).toBeInTheDocument();
    });
  });

  it("navega para /extrato ao clicar no botão de extrato", async () => {
    mockBuscarUnidade.mockResolvedValue(dadosMock);
    render(<DashboardPage />);

    await userEvent.click(await screen.findByRole("button", { name: "Ver Extrato da Conta" }));

    expect(mockPush).toHaveBeenCalledWith("/extrato");
  });

  it("exibe mensagem de erro quando a API falha", async () => {
    mockBuscarUnidade.mockRejectedValue(new Error("Não foi possível carregar os dados da unidade."));
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Não foi possível carregar os dados da unidade.")).toBeInTheDocument();
    });
  });

  it("chama logout e redireciona para /login ao clicar em Sair", async () => {
    mockBuscarUnidade.mockResolvedValue(dadosMock);
    render(<DashboardPage />);

    await userEvent.click(screen.getByRole("button", { name: "Sair" }));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("redireciona para /login se o usuário não estiver autenticado", () => {
    mockIsAuthenticated = false;
    mockToken = null;
    render(<DashboardPage />);

    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("não chama buscarUnidade se não houver token", () => {
    mockToken = null;
    mockIsAuthenticated = false;
    render(<DashboardPage />);

    expect(mockBuscarUnidade).not.toHaveBeenCalled();
  });
});
