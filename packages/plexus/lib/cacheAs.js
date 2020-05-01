"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeCacheScope = makeCacheScope;
exports.default = void 0;

// Copyright (c) 2019 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
function makeCacheScope() {
  const cache = new Map();
  return function cacheAs(key, value) {
    const stored = cache.get(key);

    if (stored) {
      return stored;
    }

    cache.set(key, value);
    return value;
  };
}

const defaultScope = Object.assign(makeCacheScope(), {
  makeScope: makeCacheScope
});
var _default = defaultScope;
exports.default = _default;