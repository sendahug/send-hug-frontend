/*
  Teleport
  Send a Hug Directive
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2024 Send A Hug

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  The provided Software is separate from the idea behind its website. The Send A Hug
  website and its underlying design and ideas are owned by Send A Hug group and
  may not be sold, sub-licensed or distributed in any way. The Software itself may
  be adapted for any purpose and used freely under the given conditions.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

import { TeleportService } from "@app/services/teleport.service";

// Heavily inspired by https://netbasal.com/beam-me-up-scotty-on-teleporting-templates-in-angular-a924f1a7798
@Directive({
  selector: "[teleport]",
  standalone: true,
})
export class TeleportDirective {
  @Input({ required: true }) teleport!: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private teleportService: TeleportService,
  ) {}

  /**
   * Angular's OnInit hook.
   */
  ngOnInit() {
    const target = this.teleportService.getTeleportTarget(this.teleport);

    // If the target wasn't found, just render it where it is.
    if (!target) {
      console.warn(
        `Target not found. Check the used name.
        Hint: The name of the target should be the key it's
        registered to, not the name/ID of the element.`,
      );
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      return;
    }

    const embeddedView = this.viewContainerRef.createEmbeddedView(this.templateRef);
    embeddedView.rootNodes.forEach((node) => target.nativeElement.appendChild(node));
  }

  /**
   * Angular's OnDestroy hook.
   */
  ngOnDestroy() {
    this.viewContainerRef.clear();
  }
}
