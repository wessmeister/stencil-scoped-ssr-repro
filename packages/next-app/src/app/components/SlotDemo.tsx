'use client';

import { ScopedChild, SlotParent } from '@example/stencil-lib-react/next';

export function SlotDemo() {
  return (
    <SlotParent>
      <ScopedChild />{' '}trailing text
    </SlotParent>
  );
}
