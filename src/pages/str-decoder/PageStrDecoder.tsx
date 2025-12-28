import { MainLayout } from "../../layout/MainLayout";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { AboutCard } from "./components/AboutCard";
import { delay } from "../../common/utils/delay";
import { ParseFailedError } from "./components/ParseFailedError";
import { usePageTitle } from "../../common/utils/usePageTitle";
import { parseStrFile } from "../../domain/StrUtils";
import saveAs from "file-saver";
import { useTranslation } from "react-i18next";
import { buildStringTable } from "../../domain/StrUtils";
import { StrTableRow } from "../../domain/StrUtils";
import { StrFileData } from "../../domain/StrUtils";



const PageStrDecoder = () => {
    const { t } = useTranslation();
    const title = t("str-extractor.title");
    usePageTitle(title);

    const [parseFailed, setParseFailed] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const [parsed, setParsed] = useState<StrFileData | null>(null);

    
    const handleFileChanged = async (file?: File) => {
        // This is where the parsing would go
        if (file && !isParsing) {
            setIsParsing(true);
            try {
                await delay(250); // wait for ui to update because parsing is resource intensive
                setParsed(parseStrFile(await file.arrayBuffer()));
            } catch {
                setParseFailed(true);
            } finally {
                setIsParsing(false);
            }
        }
        return;
    };

    return (
        <MainLayout mainMaxWidth={900}>
            <Typography variant="h3" component="h2" display="block" gutterBottom>
                {title}
            </Typography>
            <Stack gap="16px">
                <ParseFailedError failed={parseFailed} />
                <AboutCard onFileChanged={handleFileChanged} disableSelection={isParsing} />
                {parsed &&<StrTable
                    table={buildStringTable(parsed)}
                    languageNames={["German", "English", "French", "Italian", "Spanish"]}
                />}

            </Stack>
        </MainLayout>
    );

    type Props = {
    table: StrTableRow[];
    languageNames: string[];
    };

    function StrTable({ table, languageNames }: Props) {
        exportStrAsTxt(table, languageNames);
    return (
        <table style={{
            borderCollapse: "collapse",
            width: "100%"
        }}>
        <thead>
            <tr>
            <th style={{ border: "1px solid #666", padding: "4px" }}>Index</th>
            {languageNames.map(lang => (
                <th style={{ border: "1px solid #666", padding: "4px" }} key={lang}>{lang}</th>
            ))}
            </tr>
        </thead>
        <tbody>
            {table.map(row => (
            <tr key={row.index}>
                <td style={{ border: "1px solid #666", padding: "4px" }}>{row.index}</td>
                {row.values.map((value, i) => (
                <td style={{ border: "1px solid #666", padding: "4px" }} key={i}>
                    <textarea defaultValue={value} />
                </td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>
    );
    }


function exportStrAsTxt(
  table: StrTableRow[],
  languageNames: string[],
  fileName = "strings.txt"
) {
  const lines: string[] = [];

  table.forEach(row => {
    lines.push(`[${row.index}]`);
    row.values.forEach((value, i) => {
      lines.push(`${languageNames[i]}: ${value}`);
    });
    lines.push(""); // blank line
  });

  const blob = new Blob([lines.join("\n")], {
    type: "text/plain;charset=utf-8"
  });

  saveAs(blob, fileName);
}


};



export default PageStrDecoder;
