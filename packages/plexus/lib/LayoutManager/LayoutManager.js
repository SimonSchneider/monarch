"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("./types");

var _Coordinator = _interopRequireDefault(require("./Coordinator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright (c) 2017 Uber Technologies, Inc.
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
class LayoutManager {
  constructor(options) {
    this.layoutId = void 0;
    this.coordinator = void 0;
    this.pendingResult = void 0;
    this.options = void 0;

    this._handleUpdate = data => {
      const pendingResult = this.pendingResult;

      if (!pendingResult || data.layoutId !== pendingResult.id) {
        return;
      }

      if (data.type === _types.ECoordinatorPhase.Positions) {
        const isPositionsResolved = pendingResult.isPositionsResolved,
              resolvePositions = pendingResult.resolvePositions;

        if (isPositionsResolved) {
          // eslint-disable-next-line no-console
          console.warn('Duplicate positiosn update', data);
          return;
        }

        const graph = data.graph,
              vertices = data.vertices;

        if (!vertices || !resolvePositions) {
          // make flow happy
          throw new Error('Invalid state');
        }

        pendingResult.isPositionsResolved = true;
        resolvePositions({
          graph,
          vertices,
          isCancelled: false
        });
      } else if (data.type === _types.ECoordinatorPhase.Done) {
        const resolveLayout = pendingResult.resolveLayout;
        const edges = data.edges,
              graph = data.graph,
              vertices = data.vertices;

        if (!edges || !vertices || !resolveLayout) {
          // make flow happy
          throw new Error('Invalid state');
        }

        this.pendingResult = null;
        resolveLayout({
          edges,
          graph,
          vertices,
          isCancelled: false
        });
      } else {
        throw new Error('Unrecognized update type');
      }
    };

    this.options = options;
    this.layoutId = 0;
    this.coordinator = new _Coordinator.default(this._handleUpdate);
    this.pendingResult = null;
  }

  getLayout(edges, vertices) {
    this._cancelPending();

    this.layoutId++;
    const id = this.layoutId;
    this.coordinator.getLayout(id, edges, vertices, this.options);
    this.pendingResult = {
      id,
      isPositionsResolved: false
    };
    const positions = new Promise(resolve => {
      if (this.pendingResult && id === this.pendingResult.id) {
        this.pendingResult.resolvePositions = resolve;
      }
    });
    const layout = new Promise(resolve => {
      if (this.pendingResult && id === this.pendingResult.id) {
        this.pendingResult.resolveLayout = resolve;
      }
    });
    return {
      layout,
      positions
    };
  }

  stopAndRelease() {
    this._cancelPending();

    this.coordinator.stopAndRelease();
  }

  _cancelPending() {
    const pending = this.pendingResult;

    if (pending) {
      if (!pending.isPositionsResolved && pending.resolvePositions) {
        pending.resolvePositions({
          isCancelled: true
        });
        pending.isPositionsResolved = true;
      }

      if (pending.resolveLayout) {
        pending.resolveLayout({
          isCancelled: true
        });
      }

      this.pendingResult = null;
    }
  }

}

exports.default = LayoutManager;