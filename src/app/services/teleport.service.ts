/*
	Teleporter Service
	Send a Hug Service
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

// Angular imports
import { ElementRef, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TeleportService {
  private teleportTargets: { [key: string]: ElementRef } = {};

  constructor() {}

  /**
   * Adds a new teleport target to the mapping.
   * @param name - the name to map the outlet to.
   * @param target - the ElementRef to use. This is generated
   *                 using Angular's ViewChild decorator.
   */
  createTeleportTarget(name: string, target: ElementRef) {
    this.teleportTargets[name] = target;
  }

  /**
   * Gets a teleport target according to its name.
   * @param name - the name of the outlet to fetch.
   * @returns the ElementRef of the outlet.
   */
  getTeleportTarget(name: string): ElementRef | undefined {
    return this.teleportTargets[name];
  }
}
