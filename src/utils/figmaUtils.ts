
const convertGradient = (fill: any): string | null => {
    if (!fill.gradientStops || fill.gradientStops.length === 0) {
        return null;
    }

    const sortedStops = [...fill.gradientStops].sort((a, b) => a.position - b.position);

    const stops = sortedStops.map(stop => {
        const { r, g, b } = stop.color;
        const a = stop.color.a ?? 1;
        const position = Math.round(stop.position * 10000) / 100;
        
        const red = Math.round(Math.max(0, Math.min(1, r)) * 255);
        const green = Math.round(Math.max(0, Math.min(1, g)) * 255);
        const blue = Math.round(Math.max(0, Math.min(1, b)) * 255);
        const alpha = Math.max(0, Math.min(1, a));

        return `rgba(${red}, ${green}, ${blue}, ${alpha}) ${position}%`;
    }).join(', ');

    switch (fill.type) {
        case 'GRADIENT_LINEAR': {
            const angle = calculateGradientAngle(fill.gradientTransform);
            return `linear-gradient(${angle}deg, ${stops})`;
        }
        case 'GRADIENT_RADIAL': {
            const position = calculateGradientPosition(fill.gradientTransform);
            return `radial-gradient(circle at ${position}, ${stops})`;
        }
        case 'GRADIENT_ANGULAR': {
            const angle = calculateGradientAngle(fill.gradientTransform);
            return `conic-gradient(from ${angle}deg, ${stops})`;
        }
        case 'GRADIENT_DIAMOND': {
            console.warn('GRADIENT_DIAMOND is not directly supported in CSS, using radial-gradient as fallback');
            const position = calculateGradientPosition(fill.gradientTransform);
            return `radial-gradient(circle at ${position}, ${stops})`;
        }
        default:
            return null;
    }
}

const calculateGradientAngle = (transform?: any): number => {
    if (!transform || !Array.isArray(transform) || transform.length !== 2) return 180;

    const [[a, b], [c, d]] = transform;

    let angle = Math.atan2(b, a) * (180 / Math.PI);
    angle = ((angle % 360) + 360) % 360;
    angle = (90 - angle + 360) % 360;

    return Math.round(angle);
}

const calculateGradientPosition = (transform?: any): string => {
    if (!transform || !Array.isArray(transform) || transform.length !== 2) return '50% 50%';

    const [[, , tx], [, , ty]] = transform;

    const x = Math.max(0, Math.min(100, Math.round((tx ?? 0.5) * 100)));
    const y = Math.max(0, Math.min(100, Math.round((ty ?? 0.5) * 100)));

    return `${x}% ${y}%`;
}

export default class FigmaUtils {
    static toClassName(name: string, prefix?: string) {
        if (!name) return "";

        let className = name
            .trim()
            .toLowerCase()
            .replace(/[\/\s_]+/g, "-")      // convert spaces, slashes, underscores → hyphen
            .replace(/[^a-z0-9\-]/g, "")    // remove anything not alphanumeric or hyphen
            .replace(/\-+/g, "-")           // collapse repeated hyphens
            .replace(/^\-+|\-+$/g, "");     // trim hyphens

        if (/^[0-9]/.test(className)) className = "x-" + className;
        if (prefix) className = `${prefix}-${className}`;

        return className;
    }

    static fillToCSSValue(fill: any) {
        switch (fill.type) {
            case 'SOLID':
                const { r, g, b } = fill.color;
                const a = fill.opacity ?? 1;
                return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
            
            case 'GRADIENT_LINEAR':
            case 'GRADIENT_RADIAL':
            case 'GRADIENT_ANGULAR':
            case 'GRADIENT_DIAMOND':
                return convertGradient(fill);
            case 'IMAGE':
                return fill.imageRef ? `url(${fill.imageRef})` : null;
            default:
                return null; 
        }
    }
}