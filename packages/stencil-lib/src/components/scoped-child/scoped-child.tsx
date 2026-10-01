import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'scoped-child',
  shadow: true,
})
export class ScopedChild {
  render() {
    return (
      <Host>
        <span>Child content</span>
      </Host>
    );
  }
}
