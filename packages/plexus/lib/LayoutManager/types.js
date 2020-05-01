"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EWorkerPhase = exports.ECoordinatorPhase = exports.EWorkerErrorType = void 0;
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
let EWorkerErrorType;
exports.EWorkerErrorType = EWorkerErrorType;

(function (EWorkerErrorType) {
  EWorkerErrorType["Error"] = "Error";
  EWorkerErrorType["LayoutError"] = "LayoutError";
})(EWorkerErrorType || (exports.EWorkerErrorType = EWorkerErrorType = {}));

let ECoordinatorPhase;
exports.ECoordinatorPhase = ECoordinatorPhase;

(function (ECoordinatorPhase) {
  ECoordinatorPhase["Done"] = "Done";
  ECoordinatorPhase["DotOnly"] = "DotOnly";
  ECoordinatorPhase["Edges"] = "Edges";
  ECoordinatorPhase["NotStarted"] = "NotStarted";
  ECoordinatorPhase["Positions"] = "Positions";
})(ECoordinatorPhase || (exports.ECoordinatorPhase = ECoordinatorPhase = {}));

let EWorkerPhase;
exports.EWorkerPhase = EWorkerPhase;

(function (EWorkerPhase) {
  EWorkerPhase[EWorkerPhase["DotOnly"] = ECoordinatorPhase.DotOnly] = "DotOnly";
  EWorkerPhase[EWorkerPhase["Edges"] = ECoordinatorPhase.Edges] = "Edges";
  EWorkerPhase[EWorkerPhase["Positions"] = ECoordinatorPhase.Positions] = "Positions";
})(EWorkerPhase || (exports.EWorkerPhase = EWorkerPhase = {}));