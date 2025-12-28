import { useTranslation } from "react-i18next";
import { STR_DECODER } from "../../../conf/AppRoutes";
import { HomeCard } from "./HomeCard";

export const StrDecoderCard = () => {
    const { t } = useTranslation();
    return (
        <HomeCard
            description={t("str-extractor.description-short")}
            imgUrl="img/extract-str.png"
            linkDest={STR_DECODER}
            linkText={t("str-extractor.start-extractor")}
            title={t("str-extractor.title")}
        />
    );
};
