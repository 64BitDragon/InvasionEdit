import { Divider, IconButton, Stack, Tooltip } from "@mui/material";
import { ActiveResource, useResourceActionContext } from "../../context/ResourceActionContext";
import DeleteIcon from "@mui/icons-material/Delete";
import FactoryIcon from "@mui/icons-material/Factory";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { MinMaxNumberInput } from "../../../../../common/input/MinMaxNumberInput";
import { useTranslation } from "react-i18next";

export const ResourceActions = () => {
    const { t } = useTranslation();
    const { activeResource, setActiveResource, radius, setRadius } = useResourceActionContext();

    return (
        <Stack direction="row" gap="16px" alignItems="center" height="100%" width="auto">
            <Tooltip title={t("actions.resource.remove")}>
                <IconButton
                    color={getActionColor("DELETE", activeResource)}
                    onClick={() => setActiveResource("DELETE")}
                >
                    <DeleteIcon sx={{ fontSize: 32 }} />
                </IconButton>
            </Tooltip>
            <Tooltip title={t("actions.resource.xenit")}>
                <IconButton color={getActionColor("XENIT", activeResource)} onClick={() => setActiveResource("XENIT")}>
                    <FactoryIcon sx={{ fontSize: 32 }} />
                </IconButton>
            </Tooltip>
            <Tooltip title={t("actions.resource.tritium")}>
                <IconButton
                    color={getActionColor("TRITIUM", activeResource)}
                    onClick={() => setActiveResource("TRITIUM")}
                >
                    <FlashOnIcon sx={{ fontSize: 32 }} />
                </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem />
            <MinMaxNumberInput
                label={t("actions.resource.radius")}
                min={1}
                max={16}
                onValueChanged={setRadius}
                value={radius}
            />
        </Stack>
    );
};
const getActionColor = (resourceAction: ActiveResource, currentAction: ActiveResource) =>
    resourceAction === currentAction ? "primary" : "default";
