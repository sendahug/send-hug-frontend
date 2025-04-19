/*
  MyDB interface
  IndexedDB interface for the Send A Hug application.
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

import { DBSchema } from "idb";
import { iconCharacters } from "./types";
import { Role, UserIconColours } from "./user.interface";

export type IDBObjectType = IDBPost | IDBUser | IDBMessage | IDBThread;

export interface IDBPost {
  date: Date;
  givenHugs: number;
  id: number;
  isoDate: string;
  text: string;
  userId: number;
  user: string;
  sentHugs: number[];
}

export interface IDBUser {
  id: number;
  displayName: string;
  givenH: number;
  posts: number;
  receivedH: number;
  role: Role;
  selectedIcon: iconCharacters;
  iconColours: UserIconColours;
}

export interface IDBMessage {
  date: Date;
  for: {
    displayName: string;
    selectedIcon?: iconCharacters;
    iconColours?: UserIconColours;
  };
  forId: number;
  from: {
    displayName: string;
    selectedIcon?: iconCharacters;
    iconColours?: UserIconColours;
  };
  fromId: number;
  id: number;
  isoDate: string;
  messageText: string;
  threadID: number;
}

export interface IDBThread {
  latestMessage: Date;
  user1: {
    displayName: string;
    selectedIcon: iconCharacters;
    iconColours: UserIconColours;
  };
  user1Id: number;
  user2: {
    displayName: string;
    selectedIcon: iconCharacters;
    iconColours: UserIconColours;
  };
  user2Id: number;
  numMessages: number;
  isoDate: string;
  id: number;
}

// IndexedDB Database schema
export interface MyDB extends DBSchema {
  posts: {
    key: number;
    value: IDBPost;
    indexes: { date: string; user: number; hugs: number };
  };
  users: {
    key: number;
    value: IDBUser;
  };
  messages: {
    key: number;
    value: IDBMessage;
    indexes: { date: string; thread: number };
  };
  threads: {
    key: number;
    value: IDBThread;
    indexes: { latest: string };
  };
}
