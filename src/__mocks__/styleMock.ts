const styleMock = new Proxy({} as Record<string, string>, {
  get: (_, className: string) => className,
});

export default styleMock;
