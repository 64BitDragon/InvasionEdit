import { Card, List, ListItem, ListItemText } from "@mui/material";
import "./DebugSidebar.css";
import { useCursorContext } from "../../context/CursorContext";
import { useDebugSettingsContext } from "../../context/DebugSettingsContext";
import { useTranslation } from "react-i18next";
import { useFldMapContext } from "../../context/FldMapContext";
import { Layers, LayerIndexes, LayerIndex } from "../../../../../domain/fld/Layer";

export const DebugSidebar = () => {
    const { hoveredPoint } = useCursorContext();
    const { fldFile } = useFldMapContext();
    const { debugSettings } = useDebugSettingsContext();
    const { t } = useTranslation();

    if (!debugSettings.showDebugCursorPosition) {
        return <></>;
    }

    if (!fldFile || !hoveredPoint) {
        return <></>;
    }

    const { width, height } = fldFile;
    const z = hoveredPoint % width;
    const x = height - 1 - Math.floor(hoveredPoint / width);
    const items = LayerIndexes.map((layer: LayerIndex) => (
        <ListItem key={layer}>
            <ListItemText>
                {t(Layers[layer].label)}: {fldFile.layers[layer].getUint8(hoveredPoint)}
            </ListItemText>
        </ListItem>
    ));

    const newX = height - 1 - x;
    const x2 = newX * -1999;
    const z2 = newX * 1152 + z * 2305;

    return (
        <Card className="debug-sidebar">
            <p>{t("fld-editor.debug.hovered-point")}</p>
            <List disablePadding dense>
                <ListItem>
                    <ListItemText>Index: {hoveredPoint}</ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText>
                        X: {x} Z: {z}
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText>
                        Z2: {z2} (0x {formatAsLittleEndianHex(z2)} LE)
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText>
                        X2: {x2} (0x {formatAsLittleEndianHex(x2)} LE)
                    </ListItemText>
                </ListItem>
                {items}
            </List>
        </Card>
    );
};

function formatAsLittleEndianHex(num: number): string {
    // Ensure num is a 32-bit signed integer
    num |= 0;

    // Extract individual bytes in little-endian order
    const byte1 = (num & 0xff).toString(16).toUpperCase().padStart(2, "0");
    const byte2 = ((num >> 8) & 0xff).toString(16).toUpperCase().padStart(2, "0");
    const byte3 = ((num >> 16) & 0xff).toString(16).toUpperCase().padStart(2, "0");
    const byte4 = ((num >> 24) & 0xff).toString(16).toUpperCase().padStart(2, "0");

    // Concatenate the bytes in little-endian order with spaces
    const hexString = `${byte1} ${byte2} ${byte3} ${byte4}`;

    return hexString;
}
