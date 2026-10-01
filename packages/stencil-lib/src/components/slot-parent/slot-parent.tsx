import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'slot-parent',
  shadow: true,
})
export class SlotParent {
  render() {
    return (
      <Host>
        <span>
          <slot />
        </span>
      </Host>
    );
  }
}
