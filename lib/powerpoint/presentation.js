var fs = require('fs');
var application = require('./application');
var Slide = require('./slide');
var Shape = require('./shape');

function Presentation(presentationPath) {
    presentationPath = presentationPath || null;
    var nativePresentation;
    var presentation = this;
    if(fs.existsSync(presentationPath)) {
        nativePresentation = application.open(presentationPath, true);
    } else {
        nativePresentation = application.fetch(presentationPath, true);
    }
    
    presentation.slides = function(selector) {
        var slides = [];
        var i;
        var nativeSlides = nativePresentation.slides(selector, true)
        for(i=0; i<nativeSlides.length; i++) {
            slides.push(new Slide(nativeSlides[i]))
        }
        return slides;
    }
    
    presentation.addSlide = function(options) {
        return new Slide(nativePresentation.addSlide(options, true));
    }
    
    presentation.nativeSlides = function(selector) {
        return nativePresentation.slides(selector, true);
    }
    
    presentation.shapes = function(selector, slides) {
         slides = (typeof slides === 'string') ? presentation.slides(slides) : slides;
         slides = (typeof slides === 'undefined') ? presentation.slides() : slides;
         slides = (slides.length)  ? slides : [slides];
         
         var shapes = [], i;
         for(i=0; i<slides.length; i++) {
             shapes = shapes.concat(slides[i].shapes(selector))
         }
        return shapes;
    }
    
    presentation.attr = function(input, cb) {
        cb = cb || true;
        return nativePresentation.attr(input, cb);
    };
   
    presentation.quit = function(cb) {
        cb = cb || true;
        nativePresentation.close(null, true);
        application.quit(null, cb);
    };
    presentation.close = function(cb) {
        cb = cb || true;
        nativePresentation.close(null, cb);
    };
    
    presentation.save = function(cb) {
        cb = cb || true;
        nativePresentation.save(null, cb);
    };
    
    presentation.saveAs = function(input, cb) {
        cb = cb || true;
        nativePresentation.saveAs(input, cb);
    };
    
    presentation.saveAsCopy = function(input, cb) {
        cb = cb || true;
        nativePresentation.saveAs(input, cb);
    };

    //* Attr shortcuts
     presentation.path = function() {
        return presentation.attr('Path', true); 
    }
    
    presentation.name = function() {
        return presentation.attr('Name', true); 
    }
    
    presentation.fullName = function() {
        return presentation.attr('FullName', true); 
    }
    
    presentation.builtinProp = function(prop, value) {
        if(typeof prop !== 'string') {
            return nativePresentation.properties(null, true).getAllBuiltinProperties(null, true);
        } else if(typeof value !== 'string') {
            return nativePresentation.properties(null, true).getBuiltinProperty(prop, true);
        } else {
            return nativePresentation.properties(null, true).setBuiltinProperty({'prop': prop, 'value': value}, true);
        }      
    }
    
    presentation.customProp = function(prop, value) {
        if(typeof prop !== 'string') {
            return nativePresentation.properties(null, true).getAllCustomProperties(null, true);
        } else if(typeof value !== 'string') {
            return nativePresentation.properties(null, true).getCustomProperty(prop, true);
        } else {
            return nativePresentation.properties(null, true).setCustomProperty({'prop': prop, 'value': value}, true);
        }      
    }
    
    presentation.tag = {
        get: function(name) {
            return nativePresentation.tags(null, true).get(name, true);
        },
        set: function(name, value) {
            nativePresentation.tags(null, true).set({name: name, value:value}, true);
            return presentation;
        },
        remove: function(name) {
           nativePresentation.tags(null, true).remove(name, true);
           return presentation; 
        }
    }
    
    presentation.tags = nativePresentation.tags(null, true).all(null, true);
    
    presentation.type = function() {
        return nativePresentation.getType(null, true);
    }
    
    presentation.selectedShape = function() {
        return new Shape(nativePresentation.getSelectedShape(null, true));
    }
    
    presentation.selectedSlide = function() {
        return new Slide(nativePresentation.getActiveSlide(null, true));
    }
    
    presentation.slideHeight = function() {
        return presentation.attr('SlideHeight', true); 
    }
    
    presentation.slideWidth = function() {
        return presentation.attr('SlideWidth', true); 
    }
}

module.exports = Presentation;
