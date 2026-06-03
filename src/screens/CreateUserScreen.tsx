import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { Box, Typography, Paper } from "@mui/material";
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";

const StyledMainPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  border: `1px solid ${theme.palette.grey![200]}`,
  backgroundColor: theme.palette.background.paper,
  overflow: "hidden",
}));

const StyledHeaderBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const StyledHeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.grey![800],
}));

const StyledBodyBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  color: theme.palette.grey![600],
}));

export default function CreateUserScreen() {
  const { t } = useTranslation();
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/" },
      { label: t("home.adminPages") },
      { label: t("home.createUser") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);

  return (
    <StyledMainPaper elevation={0}>
      <StyledHeaderBox>
        <StyledHeaderTitle variant="h6">
          {t("home.createUser")}
        </StyledHeaderTitle>
      </StyledHeaderBox>
      <StyledBodyBox>
        <Typography variant="body1">{t("home.createUser")}</Typography>
      </StyledBodyBox>
    </StyledMainPaper>
  );
}
