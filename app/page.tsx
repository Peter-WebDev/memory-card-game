import MemoryGame from "./components/MemoryGame";

export default async function Home() {
  return (
    <main className="grid place-content-center container mx-auto p-4 max-w-4xl min-h-svh">
      <h1 className="text-5xl font-black mb-6 text-center">Memory Game</h1>
      <MemoryGame />
    </main >
  );
}