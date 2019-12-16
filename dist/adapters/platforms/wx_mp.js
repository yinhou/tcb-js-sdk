"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
var util_1 = require("../../lib/util");
function isWxMp() {
    if (typeof wx === 'undefined') {
        return false;
    }
    if (typeof App === 'undefined') {
        return false;
    }
    if (typeof Page === 'undefined') {
        return false;
    }
    if (typeof getApp !== 'function') {
        return false;
    }
    if (!wx.onAppHide) {
        return false;
    }
    if (!wx.offAppHide) {
        return false;
    }
    if (!wx.onAppShow) {
        return false;
    }
    if (!wx.offAppShow) {
        return false;
    }
    if (!wx.getSystemInfoSync) {
        return false;
    }
    if (!wx.getStorageSync) {
        return false;
    }
    if (!wx.setStorageSync) {
        return false;
    }
    if (!wx.connectSocket) {
        return false;
    }
    if (!wx.request) {
        return false;
    }
    try {
        if (!wx.getSystemInfoSync()) {
            return false;
        }
        if (wx.getSystemInfoSync().AppPlatform === 'qq') {
            return false;
        }
    }
    catch (e) {
        return false;
    }
    return true;
}
exports.isWxMp = isWxMp;
var WxRequest = (function (_super) {
    __extends(WxRequest, _super);
    function WxRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WxRequest.prototype.post = function (options) {
        var url = options.url, data = options.data, headers = options.headers;
        return new Promise(function (resolve, reject) {
            wx.request({
                url: util_1.formatUrl('https:', url),
                data: data,
                method: 'POST',
                header: headers,
                success: function (res) {
                    resolve(res);
                },
                fail: function (err) {
                    reject(err);
                }
            });
        });
    };
    WxRequest.prototype.upload = function (options) {
        return new Promise(function (resolve) {
            var url = options.url, file = options.file, name = options.name, data = options.data, headers = options.headers;
            wx.uploadFile({
                url: util_1.formatUrl('https:', url),
                name: name,
                formData: data,
                filePath: file,
                header: headers,
                success: function (res) {
                    var result = {
                        statusCode: res.statusCode,
                        data: res.data || {}
                    };
                    if (res.statusCode === 200 && data.success_action_status) {
                        result.statusCode = parseInt(data.success_action_status, 10);
                    }
                    resolve(result);
                },
                fail: function (err) {
                    resolve(err);
                }
            });
        });
    };
    WxRequest.prototype.download = function (options) {
        var url = options.url, headers = options.headers;
        return new Promise(function (resolve, reject) {
            wx.downloadFile({
                url: util_1.formatUrl('https:', url),
                header: headers,
                success: function (res) {
                    resolve(res);
                },
                fail: function (err) {
                    reject(err);
                }
            });
        });
    };
    return WxRequest;
}(types_1.AbstractSDKRequest));
exports.WxRequest = WxRequest;
exports.wxMpStorage = {
    setItem: function (key, value) {
        wx.setStorageSync(key, value);
    },
    getItem: function (key) {
        return wx.getStorageSync(key);
    },
    removeItem: function (key) {
        wx.removeStorageSync(key);
    },
    clear: function () {
        wx.clearStorageSync();
    }
};
var WxMpWebSocket = (function () {
    function WxMpWebSocket(url, options) {
        if (options === void 0) { options = {}; }
        var ws = wx.connectSocket(__assign({ url: url }, options));
        var socketTask = {
            set onopen(cb) {
                ws.onOpen(cb);
            },
            set onmessage(cb) {
                ws.onMessage(cb);
            },
            set onclose(cb) {
                ws.onClose(cb);
            },
            set onerror(cb) {
                ws.onError(cb);
            },
            send: function (data) { return ws.send({ data: data }); },
            close: function (code, reason) { return ws.close({ code: code, reason: reason }); },
            get readyState() {
                return ws.readyState;
            },
            CONNECTING: 0,
            OPEN: 1,
            CLOSING: 2,
            CLOSED: 3
        };
        return socketTask;
    }
    return WxMpWebSocket;
}());
exports.WxMpWebSocket = WxMpWebSocket;
function genAdapter() {
    var adapter = {
        root: {},
        reqClass: WxRequest,
        wsClass: WxMpWebSocket,
        localStorage: exports.wxMpStorage,
        primaryStorage: types_1.StorageType.local
    };
    return adapter;
}
exports.genAdapter = genAdapter;