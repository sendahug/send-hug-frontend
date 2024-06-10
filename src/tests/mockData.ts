/*
	Mock Data for tests
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

import { type User as FirebaseUser } from "firebase/auth";

import { type User } from "../app/interfaces/user.interface";

export const mockAuthedUser: User = {
  id: 4,
  displayName: "name",
  receivedH: 2,
  givenH: 2,
  posts: 2,
  loginCount: 3,
  role: {
    id: 1,
    name: "admin",
    permissions: [],
  },
  jwt: "",
  blocked: false,
  releaseDate: undefined,
  autoRefresh: false,
  refreshRate: 20,
  pushEnabled: false,
  selectedIcon: "kitty",
  iconColours: {
    character: "#BA9F93",
    lbg: "#e2a275",
    rbg: "#f8eee4",
    item: "#f4b56a",
  },
  firebaseId: "fb",
};

export function getMockFirebaseUser(): FirebaseUser {
  return {
    emailVerified: false,
    isAnonymous: false,
    email: "",
    providerData: [],
    refreshToken: "",
    tenantId: "",
    delete: () => new Promise(() => undefined),
    getIdToken: (_forceRefresh?: boolean) => new Promise(() => ""),
    getIdTokenResult: (_forceRefresh?: boolean) => new Promise(() => ({})),
    reload: () => new Promise(() => undefined),
    toJSON: () => ({}),
    metadata: {},
    displayName: "",
    phoneNumber: "",
    photoURL: "",
    providerId: "",
    uid: "fb",
  };
}
