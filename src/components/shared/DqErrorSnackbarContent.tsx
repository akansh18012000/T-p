import { Box, Button } from "@mui/material";
import { GetApp } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export interface DqErrorSnackbarContentProps {
  /** The backend `error_message` shown first (e.g. "8 of 416 row(s) have errors."). */
  errorMessage: string;
  /** Violation lines, already row-number-adjusted by the caller. */
  violations: string[];
  /**
   * When provided, the violation list is too long to show inline: render a
   * download hint + Download button instead of the bulleted list. When absent,
   * the violations are listed inline.
   */
  onDownload?: () => void;
}

/**
 * Snackbar message body for data-quality (DQ) upload errors, shared by every
 * upload screen. Shows `error_message` first, then either an inline bulleted
 * list of violations (≤ limit) or a Download button (> limit) depending on
 * whether `onDownload` is supplied. The bulleted-list layout mirrors the
 * existing multi-error snackbar pattern used across the master screens.
 */
export function DqErrorSnackbarContent({
  errorMessage,
  violations,
  onDownload,
}: DqErrorSnackbarContentProps) {
  const { t } = useTranslation();

  return (
    <Box component="span">
      {errorMessage}
      {onDownload ? (
        <>
          <Box component="span" sx={{ display: "block", mt: 0.5 }}>
            {t("upload.dqDownloadHint")}
          </Box>
          <Button
            size="small"
            startIcon={<GetApp />}
            onClick={onDownload}
            sx={{ mt: 0.5, color: "inherit" }}
          >
            {t("upload.dqDownloadButton")}
          </Button>
        </>
      ) : (
        <>
          <Box component="span" sx={{ display: "block", mt: 0.5 }}>
            {t("upload.dqDetailsBelow")}
          </Box>
          <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
            {violations.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
