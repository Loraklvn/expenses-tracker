"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactElement } from "react";

const queryClient = new QueryClient();

const Providers = ({
  children,
}: React.PropsWithChildren<{
  children?: React.ReactNode;
}>): ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
export default Providers;
