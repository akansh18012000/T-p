import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styled, alpha } from "@mui/material/styles";
import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  DATA_INPUT_ITEMS,
  MASTER_MAINTENANCE_ITEMS,
  handleMenuItemNavigation,
  type MenuItem as MenuItemType,
} from "../config/menuConfig.js";

/* Local styled components - Home uses AppLayout (header, no sidebar) from App.tsx */
const StyledContentInnerBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
  overflow: "hidden",
  padding: theme.spacing(4),
  backgroundColor:
    (theme.palette.primary as { lightest?: string }).lightest ?? "#D9EFE7",
  gap: theme.spacing(3),
}));

const StyledWelcomeBox = styled(Box)({
  flexShrink: 0,
});

const StyledWelcomeTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(1),
}));

const StyledWelcomeSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.light,
}));

const StyledTwoColumnBox = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(4),
  overflow: "hidden",
}));

const StyledSectionBox = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const StyledSectionHeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(1),
}));

const StyledSectionAccent = styled(Box)(({ theme }) => ({
  height: "3px",
  width: "60px",
  backgroundColor: theme.palette.primary.main,
  borderRadius: "2px",
}));

const StyledScrollBox = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  paddingRight: theme.spacing(1.5),
  "&::-webkit-scrollbar": { width: "6px" },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.scrollbar?.thumb ?? theme.palette.grey![300],
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: theme.palette.grey![500],
  },
}));

const StyledDivider = styled(Box)(({ theme }) => ({
  width: "2px",
  backgroundColor:
    (theme.palette.secondary as { lightest?: string }).lightest ?? "#E0E0E0",
}));

const StyledMenuCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  backgroundColor: theme.palette.background.paper,
  border: "none",
  borderRadius: "12px",
  width: "200px",
  height: "200px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover": {
    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
    transform: "translateY(-8px)",
    "&::before": {
      opacity: 1,
    },
  },
}));

const StyledMasterMenuCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  backgroundColor: theme.palette.background.paper,
  border: "none",
  borderRadius: "12px",
  width: "200px",
  height: "200px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover": {
    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
    transform: "translateY(-8px)",
    "&::before": {
      opacity: 1,
    },
  },
}));

const StyledIconBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 60,
  height: 60,
  borderRadius: "12px",
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.primary.dark, 0.08)} 100%)`,
  marginBottom: theme.spacing(2),
  transition: "all 0.3s ease",
  "& .MuiSvgIcon-root": {
    fontSize: 32,
    color: theme.palette.primary.main,
  },
}));

const StyledCardLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.secondary.main,
  fontSize: "0.95rem",
  lineHeight: 1.4,
  wordBreak: "break-word",
  marginBottom: theme.spacing(0.5),
}));

const StyledGridContainer = styled(Grid)({
  marginTop: 0,
});

export default function HomeScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleMenuItemClick = (item: MenuItemType) => {
    handleMenuItemNavigation(item, navigate, "home");
  };

  const renderDataInputCards = () => {
    return (
      <StyledGridContainer container spacing={2}>
        {DATA_INPUT_ITEMS.map((item: MenuItemType) => {
          const IconComponent = item.icon;
          return (
            <Grid item key={item.id}>
              <StyledMenuCard onClick={() => handleMenuItemClick(item)}>
                <StyledIconBox>
                  {IconComponent && <IconComponent />}
                </StyledIconBox>
                <StyledCardLabel variant="body2">
                  {t(item.label)}
                </StyledCardLabel>
              </StyledMenuCard>
            </Grid>
          );
        })}
      </StyledGridContainer>
    );
  };

  const renderMasterMaintenanceCards = () => {
    return (
      <StyledGridContainer container spacing={2}>
        {MASTER_MAINTENANCE_ITEMS.map((item: MenuItemType) => {
          const IconComponent = item.icon;
          return (
            <Grid item key={item.id}>
              <StyledMasterMenuCard onClick={() => handleMenuItemClick(item)}>
                <StyledIconBox>
                  {IconComponent && <IconComponent />}
                </StyledIconBox>
                <StyledCardLabel variant="body2">
                  {t(item.label)}
                </StyledCardLabel>
              </StyledMasterMenuCard>
            </Grid>
          );
        })}
      </StyledGridContainer>
    );
  };

  return (
    <StyledContentInnerBox>
      <StyledWelcomeBox>
        <StyledWelcomeTitle variant="h4">
          {t("home.welcome")}
        </StyledWelcomeTitle>
        <StyledWelcomeSubtitle variant="body1">
          {t("home.manageItems")}
        </StyledWelcomeSubtitle>
      </StyledWelcomeBox>

      <StyledTwoColumnBox>
        <StyledSectionBox>
          <StyledSectionHeaderBox>
            <StyledSectionTitle variant="h6">
              {t("home.dataInput")}
            </StyledSectionTitle>
            <StyledSectionAccent />
          </StyledSectionHeaderBox>
          <StyledScrollBox>{renderDataInputCards()}</StyledScrollBox>
        </StyledSectionBox>

        <StyledDivider />

        <StyledSectionBox>
          <StyledSectionHeaderBox>
            <StyledSectionTitle variant="h6">
              {t("home.masterMaintenance")}
            </StyledSectionTitle>
            <StyledSectionAccent />
          </StyledSectionHeaderBox>
          <StyledScrollBox>{renderMasterMaintenanceCards()}</StyledScrollBox>
        </StyledSectionBox>
      </StyledTwoColumnBox>
    </StyledContentInnerBox>
  );
}
