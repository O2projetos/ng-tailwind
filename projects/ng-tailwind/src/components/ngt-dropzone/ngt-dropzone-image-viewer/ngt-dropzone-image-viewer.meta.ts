export interface ImageViewerConfig {
    btnContainerClass?: string;
    btnClass?: string;
    btnSubClass?: string;
    zoomFactor?: number;
    wheelZoom?: boolean;
    allowFullscreen?: boolean;
    allowKeyboardNavigation?: boolean;
    btnShow?: {
        zoomIn?: boolean;
        zoomOut?: boolean;
        rotateClockwise?: boolean;
        rotateCounterClockwise?: boolean;
        next?: boolean;
        prev?: boolean;
        reset?: boolean;
    };
    btnIcons?: {
        zoomIn?: ActionButton;
        zoomOut?: ActionButton;
        rotateClockwise?: ActionButton;
        rotateCounterClockwise?: ActionButton;
        next?: ActionButton;
        prev?: ActionButton;
        fullscreen?: ActionButton;
        reset?: ActionButton;
    };

}

interface ActionButton {
    icon?: string;
    text?: string;
}

export const DefaultNgtDropzoneImageViewerConfig: ImageViewerConfig = {
    zoomFactor: 0.1,
    wheelZoom: false,
    allowFullscreen: true,
    allowKeyboardNavigation: true,
    btnShow: {
        zoomIn: true,
        zoomOut: true,
        rotateClockwise: true,
        rotateCounterClockwise: true,
        next: true,
        prev: true,
        reset: true
    },
    btnIcons: {
        zoomIn: {
            icon: 'fa fa-plus',
            text: 'zoom_in'
        },
        zoomOut: {
            icon: 'fa fa-minus',
            text: 'zoom_out'
        },
        rotateClockwise:  {
            icon: 'fa fa-repeat',
            text: 'rotate_right'
        },
        rotateCounterClockwise:  {
            icon: 'fa fa-undo',
            text: 'rotate_left'
        },
        next:  {
            icon: 'fa fa-arrow-right',
            text: 'arrow_right'
        },
        prev:  {
            icon: 'fa fa-arrow-left',
            text: 'arrow_left'
        },
        fullscreen:  {
            icon: 'fa fa-arrows-alt',
            text: 'fullscreen'
        },
        reset:  {
            icon: 'fa fa-undo',
            text: 'restore'
        },
    }
};
