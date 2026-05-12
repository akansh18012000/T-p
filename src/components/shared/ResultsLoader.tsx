// AI Generated Code by Deloitte + Cursor (BEGIN)
import { CircularProgress, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

const StyledLoaderBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  border: `1px solid ${theme.palette.grey![200]}`,
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  margin: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const StyledFullScreenLoaderBackdrop = styled(Box)(({ theme }) => ({
  position: "fixed",
  inset: 0,
  zIndex: theme.zIndex.modal + 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
  backgroundColor: "rgba(255, 255, 255, 0.6)",
  backdropFilter: "blur(2px)",
}));

const StyledLoaderLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![600],
}));

type ResultsLoaderProps = {
  label?: string;
  /** When true, renders a fixed-position page-wide overlay instead of an inline card. */
  fullScreen?: boolean;
};

export function ResultsLoader({ label, fullScreen }: ResultsLoaderProps) {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t("common.loadingResults");
  if (fullScreen) {
    return (
      <StyledFullScreenLoaderBackdrop role="status" aria-live="polite">
        <CircularProgress size={48} />
        <StyledLoaderLabel variant="body1">{resolvedLabel}</StyledLoaderLabel>
      </StyledFullScreenLoaderBackdrop>
    );
  }
  return (
    <StyledLoaderBox>
      <CircularProgress size={36} />
      <StyledLoaderLabel variant="body2">{resolvedLabel}</StyledLoaderLabel>
    </StyledLoaderBox>
  );
}
// AI Generated Code by Deloitte + Cursor (END)
