import { CursorPosition, Point, Drawing, DrawingId } from "../types";

function updateCursor(
    cursors: Record<string, CursorPosition>,
    peerId: string,
    position: Point
): Record<string, CursorPosition> {
    return {
        ...cursors,
        [peerId]: {
            ...position,
            peerId,
        },
    };
}

function addOrUpdateDrawing(
    drawings: Record<string, Drawing>,
    drawing: Drawing
): Record<string, Drawing> {
    return {
        ...drawings,
        [drawing.id]: drawing,
    };
}

function removeDrawing(
    drawings: Record<string, Drawing>,
    drawingId: DrawingId
): Record<string, Drawing> {
    return Object.fromEntries(
        Object.entries(drawings).filter(([key]) => key !== drawingId)
    );
}

export { updateCursor, addOrUpdateDrawing, removeDrawing }