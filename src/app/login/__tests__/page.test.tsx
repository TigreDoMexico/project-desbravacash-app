import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../page";
import * as service from "../service";

// Mock do next/navigation
const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

// Mock do next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

// Mock do AuthContext
const mockLogin = jest.fn();
let mockIsAuthenticated = false;
let mockIsLoading = false;

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: mockIsAuthenticated,
    isLoading: mockIsLoading,
  }),
}));

// Mock do service
jest.mock("../service");
const mockRealizarLogin = service.RealizarLogin as jest.MockedFunction<typeof service.RealizarLogin>;

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAuthenticated = false;
    mockIsLoading = false;
  });

  it("renderiza os campos de telefone, senha e o botão de entrar", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText("Telefone")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("chama RealizarLogin com os valores preenchidos ao submeter", async () => {
    mockRealizarLogin.mockResolvedValue("token-fake");
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText("Telefone"), "11999999999");
    await userEvent.type(screen.getByLabelText("Senha"), "senha123");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(mockRealizarLogin).toHaveBeenCalledWith("11999999999", "senha123");
  });

  it("salva o token e redireciona para o dashboard após login bem-sucedido", async () => {
    mockRealizarLogin.mockResolvedValue("token-fake");
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText("Telefone"), "11999999999");
    await userEvent.type(screen.getByLabelText("Senha"), "senha123");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("token-fake");
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("exibe mensagem de erro quando a API retorna falha", async () => {
    mockRealizarLogin.mockRejectedValue(new Error("Login inválido. Verifique seu telefone e senha."));
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText("Telefone"), "11999999999");
    await userEvent.type(screen.getByLabelText("Senha"), "errada");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(screen.getByText("Login inválido. Verifique seu telefone e senha.")).toBeInTheDocument();
    });
  });

  it("desabilita o botão enquanto o login está sendo processado", async () => {
    mockRealizarLogin.mockImplementation(() => new Promise(() => {})); // nunca resolve
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText("Telefone"), "11999999999");
    await userEvent.type(screen.getByLabelText("Senha"), "senha123");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(screen.getByRole("button", { name: "Entrando..." })).toBeDisabled();
  });

  it("redireciona para o dashboard se o usuário já estiver autenticado", () => {
    mockIsAuthenticated = true;
    render(<LoginPage />);

    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
  });
});
