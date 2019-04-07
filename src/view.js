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
var EMPTY_CIRCLE = 'empty_circle.png';
var EMPTY_SQUARE = 'empty_square.png';
var FILLED_CIRCLE = 'filled_in_circle.png';
var FILLED_SQUARE = 'filled_in_square.png';
var Foo = /** @class */ (function () {
    function Foo(asm) {
        this.asm = asm;
        this.views = [];
    }
    return Foo;
}());
var CycleView = /** @class */ (function () {
    function CycleView(activators, nonActivators) {
        this.activators = activators;
        this.nonActivators = nonActivators;
        this.position = 0;
        this.imageViews = [];
        this.isClosed = false;
        var mainDiv = document.getElementById("mainDiv");
        this.base = document.createElement('ul');
        if (!mainDiv)
            throw ("base is null");
        mainDiv.appendChild(this.base);
        for (var i = 0; i < this.activators; i++) {
            this.imageViews.push(new ActivatorImageView(this.base, false));
        }
        for (var i = 1; i < this.nonActivators; i++) {
            this.imageViews.push(new NonActivatorImageView(this.base, false));
        }
        this.imageViews.push(new NonActivatorImageView(this.base, true));
        this.imageViews.forEach(function (c) { return c.render(); });
        this.length = this.activators + this.nonActivators;
        this.position = this.length - 1;
    }
    CycleView.prototype.move = function () {
        if (!this.isClosed) {
            this.addImage();
        }
        else {
            this.imageViews[this.position].flipImage();
            this.position++;
            if (this.position >= this.length)
                this.position = 0;
            this.imageViews[this.position].flipImage();
        }
    };
    CycleView.prototype.closeCycle = function () {
        this.isClosed = true;
    };
    CycleView.prototype.addImage = function () {
        var node = new NonActivatorImageView(this.base, true);
        this.imageViews[this.position].flipImage();
        this.imageViews.push(node);
        node.render();
        this.position++;
        this.length++;
    };
    return CycleView;
}());
var ImageView = /** @class */ (function () {
    function ImageView(base, imageSrc) {
        this.base = base;
        this.image = new Image(100, 100);
        this.setSource(imageSrc);
    }
    ImageView.prototype.setSource = function (imageSrc) {
        this.image.src = imageSrc;
    };
    ImageView.prototype.render = function () {
        var node = document.createElement('li');
        node.setAttribute('style', 'display: inline; margin: -90px 0 0 -90px;');
        this.base.appendChild(node);
        node.appendChild(this.image);
    };
    ImageView.prototype.flipImage = function () {
    };
    return ImageView;
}());
var ActivatorImageView = /** @class */ (function (_super) {
    __extends(ActivatorImageView, _super);
    function ActivatorImageView(base, isActive) {
        var _this = _super.call(this, base, isActive ? EMPTY_SQUARE : FILLED_SQUARE) || this;
        _this.isActive = isActive;
        return _this;
    }
    ActivatorImageView.prototype.flipImage = function () {
        // debugger
        this.isActive = !this.isActive;
        if (this.isActive) {
            this.setSource(EMPTY_SQUARE);
        }
        else {
            this.setSource(FILLED_SQUARE);
        }
    };
    return ActivatorImageView;
}(ImageView));
var NonActivatorImageView = /** @class */ (function (_super) {
    __extends(NonActivatorImageView, _super);
    function NonActivatorImageView(base, isActive) {
        var _this = _super.call(this, base, isActive ? EMPTY_CIRCLE : FILLED_CIRCLE) || this;
        _this.isActive = isActive;
        return _this;
    }
    NonActivatorImageView.prototype.flipImage = function () {
        this.isActive = !this.isActive;
        if (this.isActive) {
            this.setSource(EMPTY_CIRCLE);
        }
        else {
            this.setSource(FILLED_CIRCLE);
        }
    };
    return NonActivatorImageView;
}(ImageView));
