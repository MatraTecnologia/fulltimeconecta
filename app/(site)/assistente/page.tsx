import type { Metadata } from "next";
import { AssistantChat } from "./assistant-chat";

export const metadata: Metadata = { title: "Assistente · Fulltime" };

const AssistentePage = () => (
  <div className="mx-auto max-w-3xl px-4 py-10">
    <h1 className="text-3xl font-extrabold">Assistente Fulltime</h1>
    <p className="mt-2 text-muted-foreground">
      Conte o que está acontecendo e indicamos quais especialidades procurar. O assistente não faz diagnóstico nem indica medicação.
    </p>
    <AssistantChat />
  </div>
);

export default AssistentePage;
