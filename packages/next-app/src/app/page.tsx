import { SlotDemo } from './components/SlotDemo';

export default function Home() {
  return (
    <main>
      <h1>Scoped SSR slot reproduction</h1>
      <p>The box should contain the child component followed by a space and trailing text.</p>
      <section aria-label="Rendered result">
        <SlotDemo />
      </section>
    </main>
  );
}
