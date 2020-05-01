"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var convCoord = _interopRequireWildcard(require("./dot/conv-coord"));

var _convInputs2 = _interopRequireDefault(require("./convInputs"));

var _layoutWorker = _interopRequireDefault(require("./layout.worker.bundled"));

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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

/* eslint-disable no-console */
// eslint-disable-next-line import/order, import/no-unresolved
function killWorker(worker) {
  const w = worker; // to make flow happy

  const noop = () => {};

  w.onmessage = noop; // $FlowIgnore - https://github.com/facebook/flow/issues/6191

  w.onmessageerror = noop;
  w.onerror = noop;
  w.terminate();
}

function findAndRemoveWorker(lists, worker) {
  for (let i = 0; i < lists.length; i++) {
    const list = lists[i];
    const wi = list.indexOf(worker);

    if (wi >= 0) {
      list.splice(wi, 1);
      return {
        ok: true,
        list
      };
    }
  }

  return {
    ok: false
  };
}

class Coordinator {
  constructor(callback) {
    this.currentLayout = void 0;
    this.nextWorkerId = void 0;
    this.idleWorkers = void 0;
    this.busyWorkers = void 0;
    this.callback = void 0;

    this._handleVizWorkerError = event => {
      const worker = event.target;

      const _findAndRemoveWorker = findAndRemoveWorker([this.busyWorkers, this.idleWorkers], worker),
            ok = _findAndRemoveWorker.ok;

      if (ok) {
        console.error('Viz worker onerror');
        console.error(event);
        killWorker(worker);
      } else {
        console.error('Viz worker onerror from unknown viz worker');
        console.error(event);
      }
    };

    this._handleVizWorkerMessageError = event => {
      // TODO(joe): something more useful
      const msg = {
        event,
        currentLayout: this.currentLayout,
        errorType: '_handleVizWorkerMessageError'
      };
      console.error(msg);
    };

    this._handleVizWorkerMessage = event => {
      const worker = event.target;
      const workerMessage = event.data;
      const type = workerMessage.type;

      this._makeWorkerIdle(worker);

      const isStale = !this.currentLayout || Boolean(workerMessage.meta && workerMessage.meta.layoutId !== this.currentLayout.id);

      if (type === _types.EWorkerErrorType.Error) {
        console.error(`${isStale ? '(stale) ' : ''}Error from viz.worker`, event);
        return;
      }

      if (isStale) {
        return;
      }

      if (type === _types.EWorkerErrorType.LayoutError) {
        // TODO(joe): implement retries with more spacing
        console.error('layout-error', event);
        return;
      }

      if (workerMessage.type === _types.EWorkerPhase.Positions || workerMessage.type === _types.EWorkerPhase.Edges || workerMessage.type === _types.EWorkerPhase.DotOnly) {
        this._processResult(type, workerMessage);

        return;
      }

      console.error(`Unknown worker message type: ${type}`, event);
    };

    this.callback = callback;
    this.currentLayout = null;
    this.nextWorkerId = 0;
    this.idleWorkers = [];
    this.busyWorkers = [];
  }

  getLayout(id, inEdges, inVertices, options) {
    this.busyWorkers.forEach(killWorker);
    this.busyWorkers.length = 0;

    const _convInputs = (0, _convInputs2.default)(inEdges, inVertices),
          edges = _convInputs.edges,
          unmapEdges = _convInputs.unmapEdges,
          unmapVertices = _convInputs.unmapVertices,
          _vertices = _convInputs.vertices;

    const vertices = _vertices.map(convCoord.vertexToDot);

    this.currentLayout = {
      id,
      cleaned: {
        edges,
        vertices
      },
      options: options || null,
      input: {
        edges: inEdges,
        unmapEdges,
        unmapVertices,
        vertices: inVertices
      },
      status: {
        phase: _types.ECoordinatorPhase.NotStarted
      }
    };
    const isDotOnly = Boolean(options && options.useDotEdges);
    const phase = isDotOnly ? _types.EWorkerPhase.DotOnly : _types.EWorkerPhase.Positions;

    this._postWork(phase, edges, vertices);
  }

  stopAndRelease() {
    this.idleWorkers.forEach(killWorker);
    this.idleWorkers.length = 0;
    this.busyWorkers.forEach(killWorker);
    this.busyWorkers.length = 0;
    this.currentLayout = null;
  }

  _initWorker() {
    const worker = new _layoutWorker.default();
    worker.id = this.nextWorkerId;
    this.nextWorkerId++;
    worker.onerror = this._handleVizWorkerError;
    worker.onmessageerror = this._handleVizWorkerMessageError;
    worker.onmessage = this._handleVizWorkerMessage;
    return worker;
  }

  _makeWorkerIdle(worker) {
    const _findAndRemoveWorker2 = findAndRemoveWorker([this.busyWorkers, this.idleWorkers], worker),
          ok = _findAndRemoveWorker2.ok;

    if (ok) {
      this.idleWorkers.push(worker);
    } else {
      killWorker(worker);
    }
  }

  _postWork(phase, edges, vertices) {
    if (!this.currentLayout) {
      throw new Error('_startWork called without a current layout');
    }

    const _this$currentLayout = this.currentLayout,
          id = _this$currentLayout.id,
          options = _this$currentLayout.options,
          status = _this$currentLayout.status;

    const worker = this.idleWorkers.pop() || this._initWorker();

    this.busyWorkers.push(worker);
    status.phase = phase;
    status.workerId = worker.id;
    const message = {
      options,
      edges,
      vertices,
      meta: {
        phase,
        layoutId: id,
        workerId: worker.id
      }
    };
    worker.postMessage(message);
  }

  _processResult(phase, workerMessage) {
    const layout = this.currentLayout;

    if (!layout) {
      // make flow happy - this is already checked and should not happen
      return;
    }

    const edges = workerMessage.edges,
          graph = workerMessage.graph,
          meta = workerMessage.meta,
          vertices = workerMessage.vertices;
    const workerId = meta.workerId;
    const cleaned = layout.cleaned,
          input = layout.input,
          status = layout.status;
    const stPhase = status.phase,
          stWorkerId = status.workerId;

    if (phase !== stPhase || workerId !== stWorkerId) {
      console.error(`Have work results, but in an invalid state`);
      return;
    }

    if (!vertices || !graph || phase !== _types.EWorkerPhase.Positions && !edges) {
      console.error('Have work results, but recieved invalid result data');
      return;
    }

    const adjVertexCoords = convCoord.vertexToPixels.bind(null, graph);
    const adjCleanVertices = vertices.map(adjVertexCoords);
    const adjVertices = input.unmapVertices(adjCleanVertices);
    const adjGraph = convCoord.graphToPixels(graph);

    if (phase === _types.EWorkerPhase.Positions || phase === _types.EWorkerPhase.DotOnly) {
      this.callback({
        type: _types.ECoordinatorPhase.Positions,
        layoutId: layout.id,
        graph: adjGraph,
        vertices: adjVertices
      });
    } // phase is either edges or dot-only


    if (edges) {
      const pixelEdges = edges.map(edge => convCoord.edgeToPixels(graph, edge));
      const mergedEdges = input.unmapEdges(pixelEdges);
      this.callback({
        type: _types.ECoordinatorPhase.Done,
        layoutId: layout.id,
        graph: adjGraph,
        edges: mergedEdges,
        vertices: adjVertices
      });
    }

    if (phase === _types.EWorkerPhase.Positions) {
      this._postWork(_types.EWorkerPhase.Edges, cleaned.edges, vertices);
    }
  }

}

exports.default = Coordinator;