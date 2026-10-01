'use client';

import { useState } from 'react';
import { ScopedChild, SlotParent } from '@example/stencil-lib-react/next';

export function StateDemo() {
  const [label, setLabel] = useState('trailing text');

  return (
    <>
      <SlotParent>
        <ScopedChild />{' '}{label}
      </SlotParent>
      <button onClick={() => setLabel('updated text')}>Update text</button>
    </>
  );
}
