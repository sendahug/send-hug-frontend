/*
  User interface
  Based on the User Model
  For the user's own profile
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

import { iconCharacters } from "./types";

export interface UserIconColours {
  character: string;
  lbg: string;
  rbg: string;
  item: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: string[];
}

export interface User {
  id?: number;
  auth0Id: string;
  displayName: string;
  receivedH: number;
  givenH: number;
  posts: number;
  loginCount: number;
  role: Role;
  jwt: string;
  blocked: boolean;
  releaseDate: Date | undefined;
  autoRefresh: boolean;
  pushEnabled: boolean;
  refreshRate: number;
  selectedIcon: iconCharacters;
  iconColours: UserIconColours;
}
