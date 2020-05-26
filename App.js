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
var Note = /** @class */ (function () {
    function Note() {
    }
    return Note;
}());
var RootNote = /** @class */ (function (_super) {
    __extends(RootNote, _super);
    function RootNote() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RootNote;
}(Note));
var ChordNote = /** @class */ (function () {
    function ChordNote() {
    }
    return ChordNote;
}());
var Chord = /** @class */ (function () {
    function Chord() {
    }
    return Chord;
}());
var Options = /** @class */ (function () {
    function Options() {
    }
    return Options;
}());
// todo 
var Instrument = /** @class */ (function () {
    function Instrument() {
    }
    return Instrument;
}());
//# sourceMappingURL=App.js.map