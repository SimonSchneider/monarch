"use strict";

var _getLayout2 = _interopRequireDefault(require("./getLayout"));

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// TODO: Use WorkerGlobalScope instead of Worker
const ctx = self;
let currentMeta;

function handleMessage(event) {
  const _ref = event.data,
        edges = _ref.edges,
        meta = _ref.meta,
        options = _ref.options,
        vertices = _ref.vertices;
  currentMeta = meta;

  const _getLayout = (0, _getLayout2.default)(meta.phase, edges, vertices, options),
        layoutError = _getLayout.layoutError,
        result = _objectWithoutProperties(_getLayout, ["layoutError"]);

  const type = layoutError ? _types.EWorkerErrorType.LayoutError : meta.phase;

  const message = _objectSpread({
    meta,
    type
  }, result);

  ctx.postMessage(message);
  currentMeta = null;
}

function handleError(errorType, event) {
  const colno = event.colno,
        error = event.error,
        filename = event.filename,
        lineno = event.lineno,
        message = event.message;
  const payload = {
    type: _types.EWorkerErrorType.Error,
    meta: currentMeta,
    errorMessage: {
      colno,
      error,
      errorType,
      filename,
      lineno,
      message
    }
  };
  ctx.postMessage(payload);
}

ctx.onmessage = handleMessage;
ctx.onerror = handleError.bind(null, 'error');
ctx.onmessageerror = handleError.bind(ctx, 'messageerror');