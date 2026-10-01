import { ScopedChild, SlotParent } from '@example/stencil-lib-react/next';

export default function ServerComponent() {
  return (
    <main>
      <h1>Scoped SSR server component</h1>
      <SlotParent>
        <ScopedChild />{' '}trailing text
      </SlotParent>
    </main>
  );
}
